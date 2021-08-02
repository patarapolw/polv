---
title: Backing up and restoring $HOME folder (for Distro/DE hopping)
date: 2021-08-02T12:00:00+07:00
tag:
  - linux
  - backup
  - distro-hopping
category:
  - linux
---

If you want to fully backup home folder (or folder specified by `$HOME` environment variable or `~`), it's as simple as fully backuping everything in that folder, including hidden files and folders. (`cp -r $HOME/* $HOME/.* $TARGET/`); or better yet, creating a dedicated HOME partition.

However, you won't get a clean reinstall. Also, on changing desktop environments (DE), there may be some (undesirable) changes carried over from the old desktop environment. Not to mention that, there are some cached files and unimportant carried over to the backup, in case of external backup as well.

Therefore, in case of external backup, I recommend using [`rsync`](https://wiki.archlinux.org/title/Rsync), using commands similar to the following,

```sh
rsync -axXv --exclude={"/.cache/","/.local/share/Trash/","/Downloads/"} --exclude-from=excluded.txt $HOME/ $TARGET/ (--dry-run)
```

Noted that, the trailing slashes are needed, and omitting has a lot of effects.

In case of HOME partition, you might consider deleting some files and folders in `~/.local/share/`, if that interferes with desktop environment changing.

<!-- excerpt -->
