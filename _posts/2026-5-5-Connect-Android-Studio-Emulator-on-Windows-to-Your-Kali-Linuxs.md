---
title: "Connect Android Studio Emulator on Windows to Your Kali Linux"
date: 2026-5-5
categories: [Android Penetration Testing]
tags: [Android, ADB, Kali Linux, Pentesting]
image:
  path: /assets/Connect-Android-Studio-Emulator-on-Windows-to-Your-Kali-Linux/3.jpg
  lqip: data:image/webp;base64,UklGRpoAAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSDIAAAARL0AmbZurmr57yyIiqE8oiG0bejIYEQTgqiDA9vqnsUSI6H+oAERp2HZ65qP/VIAWAFZQOCBCAAAA8AEAnQEqEAAIAAVAfCWkAALp8sF8rgRgAP7o9FDvMCkMde9PK7euH5M1m6VWoDXf2FkP3BqV0ZYbO6NA/VFIAAAA
  alt: "Connect Android Studio Emulator on Windows to Your Kali Linux"
---

This guide will help you establish a connection between your Android Studio Emulator running on Windows and your Kali Linux environment. This setup is ideal for mobile penetration testing, especially when running Android Studio directly on Linux is not feasible due to CPU virtualization issues or resource constraints.

## Introduction

Many researchers face issues running Android emulators inside a Virtual Machine (like VMware or VirtualBox) because of nested virtualization limitations. A better approach is to run the emulator natively on Windows and connect it to your Kali Linux guest. 

I assume you already have Android Studio installed on Windows and a Kali Linux VM ready. In this guide, I will use a **Pixel 5** emulator and **Kali on VMware**.

## Step 1: Run Android Emulator from CMD (Optional)

To launch your emulator directly from the command line without opening Android Studio:

1.  Navigate to the SDK emulator directory: `C:\Users\<your_username>\AppData\Local\Android\Sdk\emulator\`.
2.  Add this path to your System Environment Variables (Path) so you can run `emulator` from anywhere.

![System Environment Variables](/assets/Connect-Windows-to-Your-kali-Linux/1.png "System Environment Variables")

3.  List your available emulators:
    ```bash
    emulator -list-avds
    ```
    ![list-avds](/assets/Connect-Windows-to-Your-kali-Linux/2.png "list-avds")

4.  Run your emulator:
    ```bash
    emulator @Pixel_5
    ```
    ![emulator](/assets/Connect-Windows-to-Your-kali-Linux/3.png "emulator")

## Step 2: Configure Network Settings

For the two systems to communicate, your Kali Linux VM must be able to reach your Windows host IP.

1.  In VMware/VirtualBox settings, change the Network Adapter for Kali Linux to **Bridged**.
![VMware Bridged Network Setting](/assets/Connect-Windows-to-Your-kali-Linux/4.png)

2.  Identify your Windows Host IP address (e.g., `192.168.1.4`) using `ipconfig` in CMD.

![VMware Bridged Network Setting](/assets/Connect-Windows-to-Your-kali-Linux/6.png)

## Step 3: Configure ADB on Kali Linux

Now, we need to tell the ADB client in Kali to look for the server on your Windows host.

1.  Open the terminal in Kali Linux.
2.  Edit your shell configuration file:
    ```bash
    nano ~/.zshrc
    ```
3.  Add the following line at the end of the file (replace with your Windows IP):
    ```bash
    export ADB_SERVER_SOCKET="tcp:192.168.1.4:5037"
    ```
    ![zshrc configuration](/assets/Connect-Windows-to-Your-kali-Linux/5.png)

4.  Apply the changes:
    ```bash
    source ~/.zshrc
    ```
5.  Verify the variable is set:
    ```bash
    echo $ADB_SERVER_SOCKET
    ```
    ![Verify ADB Socket](/assets/Connect-Windows-to-Your-kali-Linux/7.png)

## Step 4: Fix Connection Issues (Windows Firewall)

By default, Windows might block the incoming connection from Kali to the ADB port (5037). 

1.  Open **Command Prompt as Administrator** on Windows.
2.  Add a firewall rule to allow port 5037:
    ```bash
    netsh advfirewall firewall add rule name="ADB Server" dir=in action=allow protocol=TCP localport=5037
    ```
3.  Restart the ADB server on Windows and force it to listen on all interfaces:
    ```bash
    adb kill-server
    adb -a -P 5037 start-server
    ```
    > The `-a` flag is critical as it allows the server to accept connections from other IP addresses.

![Administrator CMD Setup](/assets/Connect-Windows-to-Your-kali-Linux/9.png)

## Step 5: Verify the Connection

Finally, go back to your Kali Linux terminal and run:

```bash
adb devices
```

If everything is configured correctly, your Windows emulator will appear in the list!

![ADB Devices Success](/assets/Connect-Windows-to-Your-kali-Linux/10.png)

Now you can start your mobile pentesting session seamlessly.