---
title: WSL vs plain old VirtualBox
date: 2020-11-15
tag:
  - wsl
  - windows
  - linux
  - virtualbox
---

So, I have been using WSL2 on Windows 10 for a while; and I have made a few complaints. The latest one is.

<%- xCard({
  href: 'https://dev.to/patarapolw/can-t-get-fcitx-to-work-in-wsl2-also-win10-multilingual-input-method-sucks-169f',
  image: 'https://dev.to/social_previews/article/514796.png',
  title: "Can't get fcitx to work in WSL2. Also, Win10 multilingual input method sucks, nor does it work with WSL",
  description: "Problems should be solved if I use VirtualBox, I think; but I probably won't have that much access to..."
}) %>

<!-- excerpt -->

Another major complaint is

<%- xCard({
  href: 'https://github.com/microsoft/WSL/issues/4166',
  image: 'https://avatars2.githubusercontent.com/u/6154722?s=400&amp;v=4',
  title: "WSL 2 consumes massive amounts of RAM and doesn't return it · Issue #4166 · microsoft/WSL",
  description: 'Your Windows build number: 18917 What&amp;#39;s wrong / what should be happening instead: WSL 2 starts using huge amounts of RAM after a while, just using it like normal. At the moment I&amp;#39;m using ph...'
}) %>

Luckily, I upgrade my laptop from 8GB to 16GB in advance. It uses 8GB RAM at baseline. However, there is no real performance delay.

![RAM used](https://dev-to-uploads.s3.amazonaws.com/i/2ma7rxiqirbqh4iby8pk.jpg)

Compared to my real Linux-first laptop (Ubuntu GNOME 3), which uses less than 1GB RAM (total 8GB RAM - yes, [that triple-booted 8-year-old MacBook Pro](https://www.polv.cc/post/2020/09/mac-triple-boot)).

So, I decided to visit my old friend, VirtualBox.

## VirtualBox advantages (and cons)

- Graphics and input method engines are all decent and reliable. (Forgot to say that sound doesn't work in WSL2's X410, but does work in VirtualBox.)
- True sandboxing. Better security.
  - Of course, a big pro/con of WSL2, is that you can access filesystem, bidirectionally to-and-from Windows. (to-WSL: SSH; from-WSL: network drive)

WSL2 does have some unique cons.

- Web development in WSL2, when opening a server port - the port increases by one in Windows, e.g. 8080 => 8081. None of these shit in VirtualBox.
- systemd, and perhaps many other default daemons, does not run at all in WSL2. You cannot always expect things to work the same way as plain old Linux.
  - This also includes, how to install Docker in WSL2.
- GUI, even with the best xrdp or X410 (or VcXsrv), throws error often. Input method engines do not work.

Of course, VirtualBox comes with the same old cons.

- Harder to set up to be performant. Have to manually allocate not only RAM and hard disk space; but also CPU's and even BIOS settings sometimes.
  - Everything is automated and defaulted in WSL2. You don't have to set up anything to be performant. (You might want to limit RAM used, though.)
- I still cannot figure a way to access WSL2 from VirtualBox. Network drives cannot be accessed from VirtualBox shared folders.

## Conclusions

Why not install both?

I am starting to think that, if your PC is powerful enough, use VirtualBox first. But do install WSL2, for the sake of Docker.

Also, consider working at the level of Natively Windows.
