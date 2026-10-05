# nodeloris

**A modern, powerful and optimized Node.js version of the Slowloris attack (with Slow POST support).**

Complete rewrite of the original Python pwnloris tool, designed to be more efficient, stable, and harder to detect.

---

## ✨ Features

- Pure Node.js (no heavy dependencies)
- Hybrid **Slowloris + Slow POST** attack
- Cluster mode – Fully utilizes multi-core CPUs
- Fragmented headers + randomized trickle (stealthier)
- Clean shutdown with Ctrl+C
- Real-time statistics
- Very low RAM usage per connection
- Optimized to bypass Nginx / Cloudflare protections (within limits of single or multiple IPs)

---

<img width="627" height="889" alt="image" src="https://github.com/user-attachments/assets/43825408-9013-4603-b6c0-e6f1078a5c0c" />


## 📊 Real Performance

| Machine                        | Workers | Connections per Worker | Total Connections     |
|--------------------------------|---------|------------------------|-----------------------|
| VPS 16 cores / 64GB RAM        | 16      | 800                    | ~12,000 – 13,500      |
| Dev Machine (Residential IP)   | 5       | 250                    | ~1,000 – 1,300        |

**Total with 2 IPs**: Approximately **13,000 – 15,000 concurrent connections**.

---

## 🚀 Installation & Usage

## From npm

```bash
npm i -g @roflsec/nodeloris
```

### 2. Then
On a powerful VPS:
```
ulimit -n 65535 && nodeloris target.com -c 1200 --workers 16
```
On a dev machine / residential IP / Ur mom's adress:
```
ulimit -n 65535 && nodeloris target.com -c 250 --workers 5
```

## From Github
### 1. Clone the repository

```bash
#old beta repo:
#git clone https://github.com/RoflSecurity/pwnloris-node.git && cd ~/pwnloris-node
```

### 2. Then
On a powerful VPS:
```
ulimit -n 65535 && node --max-old-space-size=32768 pwnloris.js target.com -c 800 --workers 16
```
On a dev machine / residential IP / Ur mom's adress:
```
ulimit -n 65535 && node --max-old-space-size=4096 nodeloris.js target.com -c 250 --workers 5
```

## Available Options

-c <number> → Connections per worker (default: 1200)
--workers <number> → Number of workers (recommended: number of CPU cores)
--https → Use HTTPS (port 443 by default)

Full example:
```
ulimit -n 65535 && node nodeloris.js example.com -c 700 --workers 12 --https
```
Using pm2:
```
ulimit -n 65535 && pm2 start nodeloris.js --name "nodeloris" --node-args="--max-old-space-size=32768" -- target.com -c 750 --workers 16
```

## ⚠️ Important Warnings

This tool is for educational and authorized penetration testing purposes only.
Attacking websites without explicit permission is illegal and may result in legal consequences.
Use on residential connections (e.g. your mom's IP) must remain very moderate to avoid saturating the home router.
Cloudflare and modern WAFs significantly limit the effectiveness of single-IP attacks.


## 📌 Best Practices

Run in short bursts of 3 to 5 minutes, then pause for 30–60 seconds before restarting.
Using multiple IPs (VPS + residential) greatly increases the impact.
Always monitor system resources with free -h and htop.


## 📁 Main Files

nodeloris.js
readme.md


## 🔮 Future Improvements (Fork it, help us !)

SOCKS5 / Proxy support ?
Automatic Burst & Reset mode ?
Smart URL and User-Agent rotation ?
Real-time web dashboard ?


Made for educational purposes only.

Repository: TODO AGAIN WHEN UNFLAGG :/


## LulzHat LICENCE :

```
The LulzHat License v1.0

Copyright (c) 2025 RoflSec

Permission is hereby granted, free of charge, to any human, robot, or sentient AI
that obtains a copy of this software and associated documentation files (the "Software"), 
to do whatever the hell they want but ONLY for educational purposes, legal pentesting, 
or making your cat look cooler on the internet.

YOU CANNOT use this software to be an actual jerk: hacking random people, destroying stuff, 
or getting arrested is strictly forbidden. If you ignore this, congratulations, 
you are legally and morally dumb.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
PURPOSE, OR NOT GETTING SUED. USE AT YOUR OWN RISK, AND MAY THE LULZ BE WITH YOU.

By using this software, you pledge to only cause chaos (in a lab, a VM, or a controlled environment, or your mum's computer).
Breaking real laws voids your permission and might make you cry in court, the software creator can't be held responsible.
```
