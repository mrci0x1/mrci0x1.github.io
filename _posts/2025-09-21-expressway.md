---
title: "HackTheBox Expressway Writeup"
date: 2025-09-21
categories: [HTB, Machines]
tags: [Linux, VPN/IKE,CVE]
image:
  path: /assets/Expressway-htb/1.png
  lqip: data:image/webp;base64,UklGRpoAAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSDIAAAARL0AmbZurmr57yyIiqE8oiG0bejIYEQTgqiDA9vqnsUSI6H+oAERp2HZ65qP/VIAWAFZQOCBCAAAA8AEAnQEqEAAIAAVAfCWkAALp8sF8rgRgAP7o9FDvMCkMde9PK7euH5M1m6VWoDXf2FkP3BqV0ZYbO6NA/VFIAAAA
  alt: "Expressway HTB — blog writeup cover"
---



## Nmap Scan

I started by running a full TCP scan on the target using:
```shell
sudo nmap 10.10.11.87  -T4 -A -open -p-
```
Surprisingly, this didn’t reveal much, so I decided to focus on specific protocols instead. I ran a UDP scan with:
```shell
sudo nmap -sU -v -Pn -F 10.10.11.87
```
![nmap](/assets/Expressway-htb/nmap-scan-expressway.png)
From this scan, I noticed that port 500/udp is open, which corresponds to ISAKMP, indicating that the target likely supports VPN/IKE connections. This is interesting because it could allow further enumeration of IKE services and potential vulnerabilities.

## VPN/IKE

The UDP scan revealed port 500/udp (ISAKMP) open, indicating the target supports IKE Aggressive Mode with PSK authentication. Aggressive Mode leaks the PSK hash and user identity, allowing offline attacks.

Enumeration with ```ike-scan``` showed the identity ```ike@expressway.htb```:
```shell
sudo ike-scan -A 10.10.11.87
```
![enum](/assets/Expressway-htb/VPN-IKE.png)
Generating the PSK hash for offline cracking:
```shell
sudo ike-scan -A -P 10.10.11.87
```
![leaked](/assets/Expressway-htb/VPN-IKE-2.png)
Finally, the hash can be cracked using a dictionary attack:
```shell
psk-crack -d ../rockyou.txt psk.txt
```
![cracked](/assets/Expressway-htb/cracked.png)
This reveals the pre-shared key, allowing further access to the system.

## User.txt

With the recovered PSK, I was able to connect to the target via SSH:
```shell
ssh ike@10.10.11.87
```
This gave access to the user flag.
![user](/assets/Expressway-htb/user.png)


## Root.txt

For privilege escalation, I transferred `linpeas.sh` from Kali and ran it to enumerate potential vectors:
```shell
bash linpeas.sh
```
LinPEAS identified a Sudo vulnerability (**CVE-2021-3156**). The corresponding exploit script can be found [https://raw.githubusercontent.com/Maalfer/Sudo-CVE-2021-3156/refs/heads/main/CVE-2025-32463.sh](https://raw.githubusercontent.com/Maalfer/Sudo-CVE-2021-3156/refs/heads/main/CVE-2025-32463.sh):
![cve](/assets/Expressway-htb/cve.png)
After transferring and executing it on the target, I successfully obtained root access:

![root](/assets/Expressway-htb/root.png)