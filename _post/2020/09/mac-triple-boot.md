---
title: I triple-booted on an 8-years-old MacBook Pro
date: 2020-09-16
tag:
  - macos
  - windows
  - linux
  - ubuntu
---

So, I got my hands on an 8-years-old MacBook Pro (mid 2012), with 4GB RAM, 500GB SATA HD, and Core i5 CPU.

Good thing about this, is 500GB is very large. (Compared to nowadays usual small (but faster SSD) 128GB - too small to dual boot.)

<!-- excerpt_separator -->

## My MacBook Pro is too old to reformat, and start from scratch, but there is a way out

The first thing I do when I received an old MacBook Pro from my sister, knowing that free Apple support is long gone, I `Command+R` into Recovery mode, and format the hard disk.

However, I cannot install macOS -- reason is internet connection is required, and Apple Inc won't allow it. It's too old, therefore no more support.

After some hopelessness (because I can no longer boot into anything), I found a solution - [How to install macOS Big Sur or Catalina on an older Mac or MacBook](https://www.macworld.co.uk/how-to/mac-software/install-catalina-old-mac-3654960/). (Catalina is already latest, Big Sur is beta.)

- BE WARNED! You are running macOS only low hardware. You should consider do everything to make macOS faster, including disabling FileVault.

## Installing only one of Windows or Linux is easy, but not both

Installing Windows is easy, via [Boot Camp](https://support.apple.com/boot-camp), but this has to be done from inside properly installed macOS only, and latest Windows only (that Boot Camp supports).

If you try to install Windows via any other ways, you will get a GPT error.

[Best solution](https://robpickering.com/triple-boot-macbook-pro-macos-windows-10-linux/) I have found, is to

0. DO NOT pre-partition disk space for Windows and Linux, even if you know how to.
1. Install Windows first, via Boot Camp. If you have any other partitions, you will have to "uninstall Windows" (i.e. delete partitions via Boot Camp) first.
    - Prepare enough disk space in Windows partition to install Linux as well.
2. Install [rEFInd](https://www.rodsbooks.com/refind/). I had to use USB boot into macOS recovery mode. (`Command+R` hangs for some reasons), and open Terminal prompt, then `csrutil disable`; then install rEFInd inside macOS.
3. Install Linux. Shrink Windows partition using GParted inside Linux Live CD (Xubuntu, in my case).
4. You might have to boot into macOS, and reinstall rEFInd, then reinstall Windows; just to restore Windows bootloader.

![rEFInd theme Regular](https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/a0bb119c-973b-4db8-a589-a27c75e57b9c/d8gvwo8-c60dbd9c-6d8e-4758-9cf5-2756f1c2b5f1.png/v1/fill/w_854,h_480,q_80,strp/refind_theme_by_munlik_d8gvwo8-fullview.jpg)

As for rEFInd theming, I use this [Regular theme](https://github.com/bobafetthotmail/refind-theme-regular). (With a little tweak, actually.)

- There will be too many choices in the boot menu. Press `-` (minus) to delete choices.

## Comparison of macOS, Windows and Xubuntu on low and old hardwares

- macOS is unsurprisingly slow on low hardwares.
    - Disabling FileVault helps speeding up a lot.
    - Another reason I consider Linux, rather than macOS is [Docker is slow on macOS](https://stackoverflow.com/questions/55951014/docker-in-macos-is-very-slow).
- Windows 10 is surprisingly fast and less demanding.
    - However, I hate Windows Update. It might be good for security, but it is blocking at unpredictable times. When that happens, it delays rebooting cycle; both on starting up and shutting down.
- Xubuntu is without doubt fast, but hardware support is never perfect.
    - I made three-finger-drag with [`mtrack` and successfully](https://int3ractive.com/blog/2018/make-the-best-of-macbook-touchpad-on-ubuntu/).

![My Xubuntu](https://dev-to-uploads.s3.amazonaws.com/i/qyeajowmys7q2u293ks3.png)
