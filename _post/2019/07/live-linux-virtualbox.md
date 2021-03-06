---
title: Linux Live CD runs slowly in VirtualBox
date: 2019-07-18T00:00:00+07:00
image: >-
  https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRcYZ2nd_E3QdJB9eb6AHjKZOMfyWnJdovpEonB1A8Ge7r6p8Yn
tag:
  - live-linux
  - virtualbox
  - vm
category:
  - windows
---

So, I googled for solution, and found this <https://forums.virtualbox.org/viewtopic.php?f=3&t=59456>

Another problem is that there is no x64 enabled in VirtualBox, despite running Windows x64

<%- xCard({
  href: 'https://superuser.com/questions/866962/'
    + 'why-does-virtualbox-only-have-32-bit-option-no-64-bit-option-on-windows-7',
  image: 'https://cdn.sstatic.net/Sites/superuser/Img/apple-touch-icon@2.png?v=e869e4459439',
  title: 'Why does virtualbox only have 32-bit option, no 64-bit option on Windows 7?',
  description: 'I have downloaded and installed the newest virtualbox 4.3.20 for my Windows 7 '
    + '(64-bit OS), but when I want to install 64-bit Linux, the New->Create Virtual '
    + 'Machine only displays 32-bit option, no 6...'
}) %>

<!-- excerpt_separator -->

In short,

- Go to BIOS, and enable certain settings
- Create a virtual machine, with multiple cores and enable I/O APIC
