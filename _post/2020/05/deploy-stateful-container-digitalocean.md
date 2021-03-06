---
title: How to deploy STATEFUL container on DigitalOcean
date: 2020-05-25T00:00:00+07:00
tag:
  - digitalocean
  - docker
---

The examples of usage includes,

- When you want to use MongoDB Atlas beyond [free tier limits](https://docs.atlas.mongodb.com/reference/atlas-limits/); or other self-hosted database
- Self-hosted WordPress
- Self-hosted stateful docker container, such as [Remark42](https://remark42.com/) or [Isso](https://posativ.org/isso/).

(I have done all three.)

Actually, it's the answer to this question.

<%- xCard({
  href: 'https://dev.to/patarapolw/need-help-deploy-docker-that-needs-storage-on-google-2l7n',
  image: 'https://dev.to/social_previews/article/342038.png',
  title: 'Need help deploy Docker that needs storage on GCP',
  description: 'For example,    https://github.com/umputun/remark42   Internal BoltDB Uses '
    + 'docker-compose.yml       h...'
}) %>

<!-- excerpt_separator -->

The steps required are

- Create a droplet on DigitalOcean. An easy way is to be [preinstalled with Docker](https://marketplace.digitalocean.com/apps/docker/)
- Add non-root user to the droplet -- [How To Create a New Sudo-enabled User on Ubuntu 18.04 [Quickstart]](https://www.digitalocean.com/community/tutorials/how-to-create-a-new-sudo-enabled-user-on-ubuntu-18-04-quickstart)
- Add SSH tunneling to VSCode -- [How To Use Visual Studio Code for Remote Development via the Remote-SSH Plugin](https://www.digitalocean.com/community/tutorials/how-to-use-visual-studio-code-for-remote-development-via-the-remote-ssh-plugin)
- Add domain name (or subdomain) to the droplet -- [How do you point a subdomain to DigitalOcean without using or the original domain or changing nameservers?](https://www.digitalocean.com/community/questions/how-do-you-point-a-subdomain-to-digitalocean-without-using-or-the-original-domain-or-changing-nameservers)
- Add auto-renewing SSH certificate (for HTTPS) to the droplet.
  - [nginx-le](https://github.com/nginx-le/nginx-le)
  - For Remark42, you just need a right settings, because the author is the same person who created nginx-le

```dockerfile
    ports:
      - "80:8080"
      - "443:8443"

    environment:
      - SSL_TYPE=auto
      - SSL_ACME_EMAIL=<YOUR_EMAIL>
      - IMAGE_PROXY_HTTP2HTTPS=true
```

Don't know if this is just my experience. `docker-compose build` on DigitalOcean droplet failed due to not enough memory. I have to build on my development machine (macOS), then `push` to Docker Hub. (Yes, this is my first time pushing to Docker Hub.) For anyone curious, see this gist.

<%- xCard({
  href: 'https://gist.github.com/patarapolw/4c72fa4612c6e1c45474b82bac157f4a',
  image: 'https://github.githubassets.com/images/modules/gists/gist-og-image.png',
  title: 'Remark42 setup file that is Nuxt Universal-enabled',
  description: 'Remark42 setup file that is Nuxt Universal-enabled - .qovery.yml'
}) %>
