---
title: Maximize (not fullscreen) your cross-platform desktop application
date: 2020-09-11T00:00:00+07:00
tag:
  - go
  - c
  - desktop
  - crossplatform
---

If not for macOS "fullscreen" (and some Linux), it wouldn't be a pain.

I have realize the solution for a while, with Golang and [Lorca](https://github.com/zserge/lorca). Nonetheless, it uses `cgo`.

<!-- excerpt_separator -->

```go
package main

import (
  "fmt"
  "log"

  /*
    #cgo darwin LDFLAGS: -framework CoreGraphics

    #if defined(__APPLE__)
    #include <CoreGraphics/CGDisplayConfiguration.h>
    int display_width() {
    return CGDisplayPixelsWide(CGMainDisplayID());
    }
    int display_height() {
    return CGDisplayPixelsHigh(CGMainDisplayID());
    }
    #else
    int display_width() {
    return 0;
    }
    int display_height() {
    return 0;
    }
    #endif
  */
  "C"

  "github.com/zserge/lorca"
)

func main() {
  if lorca.LocateChrome() == "" {
    lorca.PromptDownload()
    log.Fatal(fmt.Errorf("cannot open outside Chrome desktop application"))
  } else {
    width := int(C.display_width())
    height := int(C.display_height())

    if width == 0 || height == 0 {
      width = 1024
      height = 768
    }

    w, err := lorca.New("https://example.com", "", width, height)
    if err != nil {
      log.Fatal(err)
    }

    defer w.Close()

    // This does nothing in macOS, BTW.
    w.SetBounds(lorca.Bounds{
      WindowState: lorca.WindowStateMaximized,
    })

    <-w.Done()
  }
}
```

Then, you can cross-compile for all major platforms using [xgo](https://github.com/karalabe/xgo).

<%- xCard({
  href: 'https://github.com/karalabe/xgo',
  image: 'https://avatars3.githubusercontent.com/u/129561?s=400&amp;v=4',
  title: 'karalabe/xgo',
  description: 'Go CGO cross compiler. Contribute to karalabe/xgo development by creating an account on GitHub.'
}) %>

```sh
BRANCH=${<BRANCH_NAME>:-"master"}
REPO=<REPO_NAME>

$(go env GOPATH)/bin/xgo \
  -ldflags="-H windowsgui" \
  -branch=BRANCH \
  -targets=windows/* \
  REPO

if [[ $(go env GOOS) == 'darwin' ]]; then
  go build "${PWD##*/}.app"
  $(go env GOPATH)/bin/xgo \
    -branch=BRANCH \
    -targets=linux/* \
    REPO
else
  $(go env GOPATH)/bin/xgo \
    -branch=BRANCH \
    -targets=linux/*,darwin/amd64 \
    REPO

  rm *-darwin*.app
  for f in *-darwin*; do mv "$f" "$f.app"; done
fi
```

The question still remains. What if I don't use Lorca, Chrome DevTools Protocol, or any other frameworks with built-in maximize, so what should I do? (BTW, Electron has built-in maximization, but [webview/webview](https://github.com/webview/webview) and Neutralino.js don't have one...)

I have an approximate answer in `cgo`.

```go
import (
  "runtime"

  /*
     #cgo darwin LDFLAGS: -framework CoreGraphics
     #cgo linux pkg-config: x11

     #if defined(__APPLE__)
     #include <CoreGraphics/CGDisplayConfiguration.h>
     int display_width() {
       return CGDisplayPixelsWide(CGMainDisplayID());
     }
     int display_height() {
       return CGDisplayPixelsHigh(CGMainDisplayID());
     }
     #elif defined(_WIN32)
     #include <wtypes.h>
     int display_width() {
       RECT desktop;
       const HWND hDesktop = GetDesktopWindow();
       GetWindowRect(hDesktop, &desktop);
       return desktop.right;
     }
     int display_height() {
       RECT desktop;
       const HWND hDesktop = GetDesktopWindow();
       GetWindowRect(hDesktop, &desktop);
       return desktop.bottom;
     }
     #else
     #include <X11/Xlib.h>
     int display_width() {
       Display* d = XOpenDisplay(NULL);
       Screen*  s = DefaultScreenOfDisplay(d);
       return s->width;
     }
     int display_height() {
       Display* d = XOpenDisplay(NULL);
       Screen*  s = DefaultScreenOfDisplay(d);
       return s->height;
     }
     #endif
  */
  "C"
)

func getFullscreenSize() (int, int) {
  width := int(C.display_width())
  height := int(C.display_height())

  // Current method of getting screen size in linux and windows makes it fall offscreen
  if runtime.GOOS == "linux" || runtime.GOOS == "windows" {
    width = width - 50
    height = height - 100
  }

  if width == 0 || height == 0 {
    width = 1024
    height = 768
  }

  return width, height
}
```

Not really fullscreen in Windows and Linux. Also, when compiling for Linux, you cannot use `xgo` -- I use Docker instead.

```dockerfile
ARG ARCH=""
FROM ${ARCH}debian
RUN apt-get update
RUN apt-get install -y --no-install-recommends build-essential 
RUN apt-get install -y xorg-dev
RUN apt-get install -y golang git
```

And,

```sh
for arch in amd64 i386
  do
    docker build --build-arg ARCH=$arch/ -t ${PWD##*/}-$arch .
  done

for arch in amd64 i386
  do
    docker run --rm -v \
      "$PWD":/usr/app \
      -w /usr/app \
      ${PWD##*/}-$arch \
      go build -o "${PWD##*/}-$arch"
  done
```

BTW, I've just found [docker xbuild](https://www.docker.com/blog/multi-arch-build-and-images-the-simple-way/).

<%- xCard({
  href: 'https://www.docker.com/blog/multi-arch-build-and-images-the-simple-way/',
  image: 'https://lh5.googleusercontent.com/q1AJpajRWZxIXzi2Y7JTP__dhhc14ya4L0-lj26kziFkR7GlTTJkg4-cI26hCGe55XdLfjHdJbFX7RcHb8a1Zd_bmRaWFiJYXhK691m5zAnEjZ6MBld-YtGjrSEVoRAn5fA3yB1a',
  title: 'Multi-arch build and images, the simple way - Docker Blog',
  description: '"Build once, deploy anywhere" is really nice on the paper but if you want to use ARM targets to reduce your bill, such as Raspberry Pis and AWS A1 instances, or even keep using your old i386 servers, deploying everywhere can become a tricky problem as you need to build your software for these platforms. To fix this problem, Docker introduced the principle of multi-arch builds and we’ll see how to use this and put it into production.'
}) %>
