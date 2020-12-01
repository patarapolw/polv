---
title: My first experience creating and testing a PWA
date: 2020-07-06T00:00:00+07:00
tag:
  - nuxt
  - pwa
  - zhquiz
  - chinese
category:
  - pinned
---

Today, I have some experience regarding both creating a PWA, and testing it.

This website, actually.

<%- xCard({
  href: 'https://www.zhquiz.cc',
  title: 'ZhQuiz',
  description: 'Hanzi, Vocab and Sentences quizzing system'
}) %>

<!-- excerpt -->

Since this was creating using Nuxt.js, I did not create [`manifest.webmanifest`](https://web.dev/add-manifest/) directly. Instead, I use

<%- xCard({
  href: 'https://pwa.nuxtjs.org',
  title: '⚡ Nuxt PWA',
  description: 'Supercharge Nuxt with a heavily tested, updated and stable PWA solution'
}) %>

Upon opening the website in mobile (Android), it now prompted web to add to home screen, and I said no this time (because the name was wrong. `@nuxtjs/pwa`'s fault.)

After correcting the name, I tried to Add to Home Screen, but now the button is missing... It is hidden inside the `vertical three dots`.

Benefits I can see from Adding to Home Screen?

- Definitely a benefit on mobile, as the space is limited. No more annoying top bar or bottom bar (in case of Brave browser)
- Can still drag down to refresh. Which is still needed, as this app is still not perfect.
