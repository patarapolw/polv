---
title: Backing up and restoring Linux filesystem (for Distro/DE hopping)
date: 2021-08-02T12:00:00+07:00
tag:
  - linux
  - backup
  - distro-hopping
category:
  - linux
---

If you want to fully backup home folder (or folder specified by `$HOME` environment variable, or `~`), it's as simple as fully backuping everything in that folder, including hidden files and folders. (`cp -r $HOME/* $HOME/.* $TARGET/`); or better yet, creating a dedicated HOME partition.

However, you won't get a clean reinstall. Also, on changing desktop environments (DE), there may be some (undesirable) changes carried over from the old desktop environment. Not to mention that, there are some cached files and unimportant carried over to the backup, in case of external backup as well.

Therefore, in case of external backup, I recommend using [`rsync`](https://wiki.archlinux.org/title/Rsync), using commands similar to the following,

```sh
rsync -axXv --exclude={"/.cache/","/.local/share/Trash/","/Downloads/"} --exclude-from=excluded.txt $HOME/ $TARGET/ (--dry-run)
```

Noted that, the trailing slashes are needed, and omitting has a lot of effects.

In case of HOME partition, you might consider deleting some files and folders in `~/.local/share/`, if that interferes with desktop environment changing.

<!-- excerpt -->

## How to restore from backup

Of course, you can just use `cp -r` or `rsync`, or even just mounting HOME partition correctly in `/etc/fstab`, but you can also be more specific and choose what to restore. So, which files and folders are amongst the most important?

```sh
~/.ssh/  # SSH keys (private and public) and known_hosts
~/.local/share/<APPNAME>  # This also includes several of DE's settings.
~/.config/<APPNAME>  # This also includes several of DE's settings.
~/snap/  # Canonical Snap Store
```

However, should list and hidden files and folders first, for example, with `ls -a ~`; because some user configuration aren't in the above mentioned folders, and may be hidden. These includes,

```sh
~/.mozilla/firefox  # For Mozilla Firefox
~/.*rc  # For many configuration files
```

## How to choose what to backup

You should take a peek on what to restore first, and consider excluding large files you won't reuse, anyway. Or, you might back up large files separately. I am using the old `rsync` command

```sh
rsync -axXv --exclude-from=$HOME/.rsync/excluded.txt $HOME/ $TARGET/ (--dry-run)
```

And the example `~/.rsync/excluded.txt` might be

```sh
/.cache/
/.local/share/Trash
/Downloads/
/Dropbox/
/NextCloud/
/go/
/R/
/.local/share/Steam/
/.local/share/container/  # For rootless podman
/.var/app/  # For `flatpak install --user`
*.iso
*.vdi
*.qcow2
```

## Things outside HOME folder worth backing up

Luckily, most of them are in `/etc/`, so you might just run

```sh
rsync -axXv /etc/ $TARGET/ (--dry-run)
# or cp -r /etc $TARGET/
```

You can also reuse it in another Linux distro.

But, more the sake of full restoration, you should consider [Timeshift](https://teejeetech.com/timeshift/) or [Snapper](https://wiki.archlinux.org/title/Rsync).
