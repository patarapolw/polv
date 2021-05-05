---
title: How to Install Arch Linux, with desktop environment (KDE, Xfce)
date: 2021-04-27T00:00:00+07:00
tag:
  - linux
  - archlinux
  - kde
  - xfce
---

So, I happened to [vanilla installed Arch Linux](https://wiki.archlinux.org/index.php/Installation_guide) + incomplete KDE and several eye candies.

## Caveat to installing

- Remove [secure boot](https://wiki.archlinux.org/index.php/Unified_Extensible_Firmware_Interface/Secure_Boot)
- You need Internet Connection
  - If you don't have Wifi driver, you might need an Android device, with USB cable
  - `rfkill unblock wifi` is required in my case, even if there is Wifi driver bundled with the kernel
  - You might need `git` to clone AUR repo to [install Wifi drivers](https://wiki.archlinux.org/title/Network_configuration/Wireless).
- Install [btrfs](https://wiki.archlinux.org/index.php/Btrfs), i.e. "better fs"
- Install `networkmanager`. No, there won't be [iwctl](https://wiki.archlinux.org/index.php/Iwd#iwctl) or `networkmanager`, if you don't install it.
  - KDE will need `networkmanager`
  - Xfce will need `networkmanager` and `network-manager-applet` (yes, with hyphen between `network` and `manager`)
- User management and install `sudo`
- Install GRUB, but switch to [rEFInd](https://wiki.archlinux.org/index.php/REFInd) later, with `cp /etc/os-release /boot/etc/os-release`
- Install [yay](https://github.com/Jguer/yay). I know that Ubuntu / Debian do have `apt search`, but `yay -Ss`, `yay -Qs` searches the whole [AUR](https://wiki.archlinux.org/index.php/Arch_User_Repository) and looks more powerful
- [Install missing drivers](https://wiki.archlinux.org/index.php/Mkinitcpio#Possibly_missing_firmware_for_module_XXXX)
- Install not only [`plasma`](https://wiki.archlinux.org/index.php/KDE#Plasma), but also `kde-applications`, just to uninstall many later. (Also installed `sddm`. Liked better than `lightdm`)

<!-- excerpt -->

```sh
yay -Rc $(pacman -Qsq kde game) konsole dolphin konquerer kmail
yay -S terminator thunar chromium vscodium-bin vscodium-bin-marketplace
```

- Does anyone really use Konquerer / [Epiphany](https://wiki.archlinux.org/index.php/GNOME/Web), BTW?
- Editing Plasma desktop (KDE) to look like GNOME / Xfce.
- Edit SDDM with Arch theme
- Edit icons as deem fit, by editing `~/.local/share/application/**/*.desktop` and finding the icons

```sh
find /usr/share/icons -iname '*.png'
```

- Change Mail application to

```toml
[Desktop Entry]
Comment[en_US]=
Comment=
Exec=xdg-open https://mail.zoho.com/zm/#compose
GenericName[en_US]=
GenericName=
Icon=internet-mail
MimeType=
Name[en_US]=Email in browser
Name=Email in browser
Path=
StartupNotify=true
Terminal=false
TerminalOptions=
Type=Application
X-DBUS-ServiceName=
X-DBUS-StartupType=
X-KDE-SubstituteUID=false
X-KDE-Username=
```

## What about your desktop?

Doesn't have to be Arch. Might be i3wm or Openbox or something else. Care to share your customization?

(BTW, I don't know if I will survive if I tried non-`systemd`, like Artix.)

![Arch desktop](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1u2h4rstna7d5owat9zh.png)

![Arch icons](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fs0wad3kmrvvz6frqnsd.png)
