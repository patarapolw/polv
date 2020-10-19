---
title: Pretty printing objects with multiline strings in terminal with colors
date: '2020-02-25 00:00 +07:00'
tag:
  - console
  - dev.to
  - node.js
  - terminal
---

If you have use JavaScript for some time, you should notice that pretty printing JSON in Node.js is as simple as `JSON.stringify(obj, null, 2)`.

(Also, if you need multiline strings, there is [js-yaml](https://github.com/nodeca/js-yaml).)

- But there is never coloring

An alternative is `console.log`, which in Node.js, it is not as interactive as web browsers with Chrome DevTools, and the depth in by default limited to 2.

- How do you maximize depths?
  - Easy, use `console.dir(obj, { depth: null })` -- [console.dir](https://nodejs.org/api/console.html#console_console_dir_obj_options)

<!-- excerpt_separator -->

BTW, in my test project, I got this,

![inspect-basic](https://raw.githubusercontent.com/patarapolw/prettyprint/master/screenshots/inspect-basic.png)

Even with proper options (`{ depth: null, breakLength: Infinity, compact: false }`), I still get this

![inspect-custom](https://raw.githubusercontent.com/patarapolw/prettyprint/master/screenshots/inspect-custom.png)

So, what's the solution?

You can customize `inspect` by providing your own class.

```ts
import util from 'util'

class MultilineString {
  // eslint-disable-next-line no-useless-constructor
  constructor (public s: string) {}

  [util.inspect.custom] (depth: number, options: util.InspectOptionsStylized) {
    return [
      '',
      ...this.s.split('\n').map((line) => {
        return '\x1b[2m|\x1b[0m ' + options.stylize(line, 'string')
      })
    ].join('\n')
  }
}
```

(BTW, worry about `\x1b[2m`? It is [How to change node.js's console font color?](https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color))

And, replace every instance of multiline string with the class.

```ts
function cloneAndReplace (obj: any) {
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj) && obj.constructor === Array) {
      const o = [] as any[]
      obj.map((el, i) => {
        o[i] = cloneAndReplace(el)
      })
      return o
    } else if (obj.constructor === Object) {
      const o = {} as any
      Object.entries(obj).map(([k, v]) => {
        o[k] = cloneAndReplace(v)
      })
      return o
    }
  } else if (typeof obj === 'string') {
    if (obj.includes('\n')) {
      return new MultilineString(obj)
    }
  }

  return obj
}

export function pp (obj: any, options: util.InspectOptions = {}) {
  console.log(util.inspect(cloneAndReplace(obj), {
    colors: true,
    depth: null,
    ...options
  }))
}
```

Now the pretty printing function is ready to go.

![pp](https://raw.githubusercontent.com/patarapolw/prettyprint/master/screenshots/pp.png)

If you only need the pretty printing function, I have provided it here.

```pug parsed
a(data-make-html="card" href="https://github.com/patarapolw/prettyprint")
  | https://github.com/patarapolw/prettyprint
  pre(data-template style="display: none;").
    image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&v=4'
    title: patarapolw/prettyprint
    description: >-
      prettyprint beyond `JSON.stringify(obj, null, 2)` -- Multiline strings and
      colors - patarapolw/prettyprint
```

I also made it accessible via CLI, and possibly other programming languages, such as Python (via JSON / safeEval, actually).
