---
title: "Bypass of Username Policy Breaking the Rules with a Simple Trick"
date: 2025-06-5
categories: [Bug Hunting]
tags: [Bug, trick]
image:
  path: /assets/dup.png
  lqip: data:image/webp;base64,UklGRpoAAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSDIAAAARL0AmbZurmr57yyIiqE8oiG0bejIYEQTgqiDA9vqnsUSI6H+oAERp2HZ65qP/VIAWAFZQOCBCAAAA8AEAnQEqEAAIAAVAfCWkAALp8sF8rgRgAP7o9FDvMCkMde9PK7euH5M1m6VWoDXf2FkP3BqV0ZYbO6NA/VFIAAAA
  alt: "Bypass-of-Username-Policy-Breaking-the-Rules-with-a-Simple-Trick — blog writeup cover"
---

# Bypass of Username Policy — *Breaking the Rules with a Simple Trick*

Late one evening, I decided to dive into some bug hunting for a quick session. I noticed the application had strict username rules during registration — special characters like `@@` or `...` or numeric-only usernames like `123` were not allowed. Also, I couldn't change my username after signing up. It seemed solid.  

![Registration Rules](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FtTpKz6XKyyqjPmis9dLg%252FScreenshot%25202024-10-31%2520235138.png%3Falt%3Dmedia%26token%3D6e20ed1f-5938-4e30-8c0b-9cd1cc76c9bb&width=768&dpr=1&quality=100&sign=dfbbb00&sv=2)

---

## Process

I registered normally and went to my profile settings. However, the option to change my username was disabled.  

![Profile Disabled 1](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FEz8IDhsGj5ATFEiiA482%252FScreenshot%25202024-10-31%2520235739.png%3Falt%3Dmedia%26token%3Da0cbc099-33d4-41f4-a838-3b46863e2056&width=768&dpr=1&quality=100&sign=39d3ba30&sv=2)  

![Profile Disabled 2](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FTmWjOWTmXznm1yWVCyaB%252FScreenshot%25202024-11-01%2520000030.png%3Falt%3Dmedia%26token%3D74d06d70-01f2-4a8f-b04e-51e757074a05&width=768&dpr=1&quality=100&sign=d9eaf792&sv=2)  

![Profile Disabled 3](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FxtUHOzl0VoLd8xq3dFEP%252FScreenshot%25202024-11-01%2520000257.png%3Falt%3Dmedia%26token%3Da2858ac8-e464-4bf8-9297-14ad22aa5c0b&width=768&dpr=1&quality=100&sign=b4678743&sv=2)  

---

## Exploit

I didn’t stop there. I decided to change my bio and intercepted the request using **Burp Suite**.  

While reviewing the request, I spotted that I could add a parameter that doesn't exist in the normal request — and it allowed me to **modify my username**.  

After I added the parameter, I sent the request again, and it just worked!  

![Modified Request Worked](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FF1A2FRWaZL6KsmnEmzmV%252FScreenshot%25202024-11-01%2520000639.png%3Falt%3Dmedia%26token%3D1e601867-5ba9-4662-9a09-c427b2a0a283&width=768&dpr=1&quality=100&sign=62301306&sv=2)  

---

##  Conversation

**Me:** Sending the bug.  
**Triage Team:** Waiting for duplicate me.  

![Triage Meme](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FV5TDYdgRNcBHRdRAZRwu%252FGYmL0WmXIAA4wEE.jpeg%3Falt%3Dmedia%26token%3D060af396-7907-442e-b7c9-2bddd507703f&width=768&dpr=1&quality=100&sign=a153d17&sv=2)

---

## Result

My profile was successfully updated with a username format that was supposed to be blocked.  

![Final Result](https://mrci0x1.gitbook.io/home/~gitbook/image?url=https%3A%2F%2F2226553737-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FGuulzzy1AvWrJMh0trBB%252Fuploads%252FHpYoTRYAdmM0CizV2OlC%252Fimage.png%3Falt%3Dmedia%26token%3D823c96e3-c132-402d-8d9f-f8f3e4d0b56c&width=768&dpr=1&quality=100&sign=25c9e5f0&sv=2)
