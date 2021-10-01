---
title: `docker compose` (v2) vs `docker-compose` (v1) vs `podman-compose` - which one to choose?
date: 2021-09-30T12:00:00+07:00
tag:
  - docker
  - podman
  - devops
---

## Latest Docker Compose (v2)

<https://docs.docker.com/compose/cli-command/>

Now, the command is no longer `docker-compose` (although there is [compose-switch](https://github.com/docker/compose-switch)), but rather, a Docker plugin, `docker compose`.

For some reasons, it had to rebuild my Dockerfile image again, even though I have built (and tagged) it before.

I saw that there that are releases for Windows and macOS (darwin, including arm64) as well; [and it is already installed by default on Windows and macOS](https://docs.docker.com/compose/cli-command/#install-on-mac-and-windows).

## Legacy Docker Compose (v1)

<https://docs.docker.com/compose/install/>

This one has absolutely my expected behavior. Nothing special. No surprise dangers.

## [podman-compose](https://wiki.archlinux.org/title/Podman#Docker_Compose)

This one uses [podman](https://podman.io/), which is probably only available in Linux ([and macOS](https://podman.io/blogs/2021/09/06/podman-on-macs.html)), and requires `podman.service` user unit; so, probably cannot be started in Windows' WSL.

Goodies, other than can be **rootless** podman (i.e. no root privileges, nor `usermod -aG docker $USER`); is that it actually create a "pod" containing multiple containers.

So, what are unexpected behaviors I have found?

- Cannot attach to virtual volumes, nor attach to non-existent folders (will not create a new folder)
- `podman-compose up $SERVICE_NAME` does not work, unlike `docker-compose`
- `Ctrl+C` does not destroy pod, nor "down", so `podman-compose up` >> `Ctrl+C` >> `podman-compose up` will give some friendly(?) errors
  - In contrast, `docker-compose up` >> `Ctrl+C` >> `docker-compose up` throws no error; also noticeably, logs  continue (just like `Ctrl+X` >> `kill -CONT`)

## Conclusion

So, is Podman better than Docker, or is Docker itself getting better than alternatives?
