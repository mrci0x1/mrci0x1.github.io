---
title: "Exposed Sensitive Logs and SQL Queries Revealing User Data"
date: 2025-07-14
categories: [Bug Hunting]
tags: [Bug, bounty, tips]
---

## Process
One evening, I was exploring the internet like a digital detective, using a Shodan to hunt for hidden clues. 
Suddenly, I found an open window into a system—a website spilling sensitive info like logs and fax records, free for anyone to see. No password, no lock, just wide open!

I used a Chrome extension called Hash Extractor to get the favicon hash of the target website. Then, I searched the hash on 
Favicon Hash Search  to find other sites using the same favicon. Finally, I used Shodan to look for potential internal URLs associated with these sites.

It was like finding a secret journal left on a bus, full of private details like emails. 
I checked just enough to know it was serious, then stepped back to keep things safe. 

This leak could’ve let hackers steal data or cause big trouble, so I quickly reported it to HackerOne, urging them to seal it shut.

![The flow of data](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FnUEkfgsek6G2L5bXRRal%252FScreenshot_2025-01-11_115241.png%3Falt%3Dmedia%26token%3D42e54e1c-1c99-48fc-a2a9-b28058995718&width=768&dpr=4&quality=100&sign=7a56d403&sv=2)

![Internal flow](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252F8UnjUEZ4H4LAYhAlpqTo%252FScreenshot_2025-01-11_115300.png%3Falt%3Dmedia%26token%3Dd2bbe728-32ca-42af-b688-5f5d2aa2234f&width=768&dpr=4&quality=100&sign=7ae29a1f&sv=2)

## Resolved
![result](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252F7Pfd1yxsimHBCHUYDdXX%252FScreenshot%25202025-05-22%2520014407.png%3Falt%3Dmedia%26token%3Dcc17eb8d-172b-4c98-bb97-30103c2fccbb&width=768&dpr=1&quality=100&sign=4c5ed1d8&sv=2)