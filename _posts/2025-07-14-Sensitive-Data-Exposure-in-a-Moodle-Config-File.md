---
title: "Sensitive Data Exposure in a Moodle Config File"
date: 2025-07-23
categories: [Bug Hunting]
tags: [Bug, Information_Disclosure]
---
## Process
Let’s say your target is example.com. You begin with some Google dorking using simple queries, but nothing interesting comes up.

After the initial Google Dorking yielded no interesting results, I moved on to subdomain enumeration using a reliable tool called ```subfinder```:
```shell
subfinder -all -silent -d example.com -o subfinder.txt
```
Next, I checked which subdomains were alive using ```httpx```:
```shell
cat subfinder.txt | httpx -silent -sc -probe -title -td -ip -t 90 -mc 200,404,403,302,301,303,304,305,306,307,302 -o live1.txt
```
To dig deeper, I performed subdomain enumeration on subdomains, a technique that often uncovers hidden gems. After repeating the last command, I found a few new subdomains to test, which could potentially have interesting vulnerabilities , and found this one ```https://x.x.example.com```

One of my favorite things to do is directory fuzzing. There are many great tools for this, like dirb, gobuster, or dirsearch. Personally, I prefer dirsearch because it offers valuable paths and is fast. I kicked it off with the following command:
```shell
dirsearch -u https://example.com/ -t 150 -x 403,404,500,429 -i 200,301,302 --random-agent 
```
and found many 200 OK, but there are most file interesting which called ```config.php.save```
![figure 01](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FCLBshr6rZnWtw5iC7FoS%252FScreenshot%25202024-10-16%2520020603.png%3Falt%3Dmedia%26token%3Dbea094fe-6ffd-4109-bb7f-cb894993fd24&width=768&dpr=1&quality=100&sign=2161e719&sv=2)

> **Warning:** This write-up dates back to when the ```config.php.save file``` was still present. However, since the bug was resolved, the file has now been removed from the results.

Accessing the ```config.php.save``` file revealed sensitive information, such as the database username (```dbuser```), password (```dbpass```), and other critical details. This type of exposure can lead to severe security risks if not addressed. 
![figure 02](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252Farl6YfKxkcogJdU6WMvS%252FScreenshot%25202024-10-16%2520021059.png%3Falt%3Dmedia%26token%3Df3bf6dac-297a-4fb9-8a55-0f44b4605e6f&width=768&dpr=1&quality=100&sign=70187272&sv=2)
Sometimes you won’t find anything right away, but don’t let that stop you. Every step gets you closer to a win. Keep learning, stay curious, and don’t give up—success comes to those who keep going! 🎉
![figure 03](https://cdn.iframe.ly/files/5296977da345d269ab8274436ebdb94a.mp4)
## Result
Update: Resolved 🎉🎉

![figure 03](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FHt28RuAAl5fU9L1mePdw%252FScreenshot%25202024-10-16%2520024132.png%3Falt%3Dmedia%26token%3D0751472c-5356-4f06-a13f-6e8f6c58c264&width=768&dpr=1&quality=100&sign=2afe901b&sv=2)