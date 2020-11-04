---
title: encodeURIComponent is both not safe enough, and overdone
date: 2020-07-15
tag:
  - webdev
  - javascript
  - security
  - dev.to
  - pinned
---

I have [tested](https://github.com/patarapolw/encodeuri-plus/blob/master/tests/url-constructor.ts) with `encodeURIComponent`, `decodeURIComponent` and `URL` constructor, and the results are

<!-- excerpt -->

```js
{
  "pathname": {
    "destroyed": " #.?",
    "encoded": "\"<>`{}",
    "error": {
      "Invalid URL: //": "/",
      "Invalid URL: /\\": "\\"
    }
  },
  "key": {
    "destroyed": "#&+="
  },
  "value": {
    "destroyed": " #&+"
  },
  "hash": {
    "destroyed": " ",
    "encoded": "\"<>`"
  },
  // /[A-Za-z0-9]/ are excluded.
  "notEncoded": {
    "encodeURI": "!#$&'()*+,-./:;=?@_~",
    "encodeURIComponent": "!'()*-._~",
    "escape": "*+-./@_"
  }
  // encoded with `%${x.charCodeAt(0).toString(16).toUpperCase()}`
  "notDecoded": {
    "decodeURI": "#$&+,/:;=?@"
  }
}
```

[The test](https://github.com/patarapolw/encodeuri-plus/blob/master/tests/url-constructor.ts) is here.

So,

- Reserved characters `;,/?:@&=+$` are not equal. Some are allowed in some scenarios, some are not. And it seems that `encodeURI` is never safe to encode a URI segment.
- Path params, e.g. `/:segment/*` on the server
  - `.`, `..` always [have wrong meanings](https://stackoverflow.com/questions/3856693/a-url-resource-that-is-a-dot-2e), **whether percent-encoded or not**. And `encodeURIComponent('.')` is indeed `.`. `/^\.{3,}$/` are ok, though.
    - It seems that escaping by prefixing with `~` is enough.
  - `/`, even when encoded, [may throw error on some server](https://stackoverflow.com/questions/3235219/urlencoded-forward-slash-is-breaking-url). Not sure about `\`, but it seems to throw error in my test.
- Luckily, these are always encoded. I have seen a recent post about the errors.

```txt
"<>`{}
```

<%- xCard({
  href: 'https://dev.to/antho1404/encoding-mess-with-javascript-oan',
  image: 'https://dev.to/social_previews/article/397520.png',
  title: 'Encoding mess with Javascript',
  description: 'Transfer data by URL by encoding them is harder than it looks and you need to '
    + 'be careful about evil characters.'
}) %>

- Not sure if non-ASCII (`/[^\x00-\x7F]/`) needs to be encoded. You can try it in my demo, and see if it breaks.

<https://encodeuri-plus.netlify.app/>

So, I created a library for this,

<%- xCard({
  href: 'https://github.com/patarapolw/encodeuri-plus',
  image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4',
  title: 'patarapolw/encodeuri-plus',
  description: "encodeURI that is safe, and doesn't do too much in a specific scenario - "
    + 'patarapolw/encodeuri-plus'
}) %>
