---
title: 'What is the true merit of Python, and why C/C++ plugins were made for it?'
date: '2020-05-30 00:00 +07:00'
tag:
  - python
  - quora
---

Of course, I did start much of my journey with Python, but now I started to prefer TypeScript and Kotlin to Python. Also, I am very critical with Python, so I asked on Quora. (Please read the chat in comment sections of the answer as well.)

<!-- excerpt_separator -->

```yaml link
icon: 'https://qsf.fs.quoracdn.net/-3-images.favicon.ico-26-ae77b637b1e7ed2c.ico'
title: Is Python only good for frameworks/libraries? - Quora
language: en
url: 'https://www.quora.com/Is-Python-only-good-for-frameworks-libraries'
provider: quora
```

```yaml link
icon: 'https://www.quora.com/favicon.ico'
title: Why do people like to write C/C++ bindings in Python? - Quora
language: en
url: 'https://www.quora.com/Why-do-people-like-to-write-C-C-bindings-in-Python'
provider: quora
```

> Python applications. so they arem’t C/C++ bindings (that implies the bindings are for C/C++ programs) - they are Python bindings for libraries written in C/C++.
>
> For computationally heavy functions such as numpy, then C/C++ is much better than Python - so people write computationally heavy functionality in C/C++ and then either write a Python layer as a binding wrapper, or write their C/C++ code so that it exposes a Python CAPI interface (allowing the library to be imported directly to a Python application).
>
> > Because Python is very easy to use, and a lot of developers are already using Python. Python has a massive choice of libraries and frameworks already developed. well over 200 in the standard library, and 200,000 in pypi ; all free of charge.
