---
title: Made a website for Chinese learners. Registered a domain name. But?
date: '2020-04-27 00:00 +07:00'
tag:
  - chinese
  - dev.to
  - domain
---

The website is <https://zhquiz.cc>.

```yaml link
description: 'Hanzi, Vocab and Sentences quizzing system'
icon: 'https://zhquiz.cc/favicon-32x32.png'
keywords:
  - chinese
  - mandarin
  - srs
  - quiz
title: 'ZhQuiz - Hanzi, Vocab and Sentences quizzing'
language: zh
url: 'https://zhquiz.cc/'
provider: zhquiz
```

Sorry, there is not landing page yet, just login and do the personalized quiz.

I hosted the container on Google Cloud Run, which the price seems much more reasonable than Heroku Hobby.

Domain name was purchased on Namecheap for $ 8 /year.

The stacks are

- Node.js (Fastify + firebase-admin)
- Vue + Firebase Auth
- MongoDB Atlas

Now the foremost, and most important is

- Sometimes the website is not accessible on mobile.
- Cannot access with `www.` (do you need one these days?)

A little less important, not pressing right now is

- MongoDB Atlas security

What do you recommend, as this is the first time hosting a container. It was much easier for static sites on Netlify (<https://polvcode.dev>).
