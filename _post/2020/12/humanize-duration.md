---
title: How to humanize duration accurately in JavaScript, including months and years
date: 2020-12-06T00:00:00+07:00
tag:
  - javascript
  - typescript
  - date
---

It is very simple, that you might not need a library, although there are cautions.

That is, using `Date` object. Be aware of months and leap years. Don't try to use straight simple approximation of raw milliseconds.

<!-- excerpt -->

## Natively adding numbers, e.g. days, months, to Date object

```ts
type Unit = "ms" | "s" | "min" | "h" | "d" | "w" | "mo" | "y";

const addDate: Record<Unit, (d: Date, n: number) => Date> = {
  ms: (d, n) => {
    d.setMilliseconds(d.getMilliseconds() + n);
    return new Date(d);
  },
  s: (d, n) => {
    d.setSeconds(d.getSeconds() + n);
    return new Date(d);
  },
  min: (d, n) => {
    d.setMinutes(d.getMinutes() + n);
    return new Date(d);
  },
  h: (d, n) => {
    d.setHours(d.getHours() + n);
    return new Date(d);
  },
  d: (d, n) => {
    d.setDate(d.getDate() + n);
    return new Date(d);
  },
  w: (d, n) => {
    d.setDate(d.getDate() + n * 7);
    return new Date(d);
  },
  mo: (d, n) => {
    d.setMonth(d.getMonth() + n);
    return new Date(d);
  },
  y: (d, n) => {
    d.setFullYear(d.getFullYear() + n);
    return new Date(d);
  },
};
```

Adding number to Date is not that hard. Just remember to refresh the Date object, by cloning `new Date(d)`.

## Principles of calculating Duration

- First, plan for appropriate Date component mapping - `Record<Unit, number>`
- Second, mitigate negatives

```ts
    parse(
      current: (d: Date) => number,
      upper?: {
        get: (d: Date) => number;
        set: (d: Date, v: number) => void;
        inc: (d: Date) => number;
      }
    ) {
      let a = current(this.dates[1]) - current(this.dates[0]);

      if (upper) {
        while (a < 0) {
          a += upper.inc(this.dates[0]);

          upper.set(this.dates[1], upper.get(this.dates[1]) - 1);
          this.dates[1] = new Date(this.dates[1]);
        }
      }

      return a;
    }
```

Now, the problem here is that you will need to account for leap years.

```ts
    inc: (d) => {
      const y = d.getFullYear();
      let isLeapYear = true;
      if (y % 4) {
        isLeapYear = false;
      } else if (y % 100) {
        isLeapYear = true;
      } else if (y % 400) {
        isLeapYear = false;
      }

      return [
        31, // Jan
        isLeapYear ? 29 : 28, // Feb
        31, // Mar
        30, // Apr
        31, // May
        30, // Jun
        31, // Jul
        31, // Aug
        30, // Sep
        31, // Oct
        30, // Nov
        31, // Dec
      ][d.getMonth()];
    },
```

Note that `.getMonth()` is zero-indexed, i.e. January is 0, December is 11.

Weeks need to be calculated separately.

```ts
  const w = Math.floor(d / 7);
  d = d % 7;
```

## Constructing an ordered Record, removing unnecessity, and joining to a useful string

```ts
  const m = durationToRecord(from, to);
  const str = Object.entries(m.d)
    .filter(([, v]) => v)
    .reverse()
    .slice(0, trim)
    .map(([k, v]) => `${v.toLocaleString()}${unit[k as Unit] || k}`)
    .join(" ");
```

## Testing

I made it cursorly, so I don't even bother installing `ts-mocha` or `jest-ts`.

```ts
const maxAcceptable: Partial<Record<Unit, number>> = {
  ms: 1000,
  s: 60,
  min: 60,
  h: 24,
  d: 31,
  w: 4,
  mo: 12,
};

const now = new Date();

/**
 * 10k repeats
 */
Array(10000)
  .fill(null)
  .map(() => {
    /**
     * From minutes to about 20 years' duration
     */
    Array.from(Array(8), (_, i) => (Math.random() + 0.1) * 10 ** (i + 5)).map((n) => {
      const to = new Date(+now + n);
      console.log(
        durationToString(now, to, {
          sign: false,
          trim: 2,
        })
      );

      const map = durationToRecord(now, to);

      Object.entries(map.d).map(([k, v]) => {
        const max = maxAcceptable[k as Unit];
        if (max && v > max) {
          console.error({ k, v, map });
          throw new Error("Some value exceeded the limit");
        }
      });

      const calculated = Object.entries(map.d).reduce(
        (prev, [k, v]) => addDate[k as Unit](prev, v),
        new Date(now)
      );

      const ratio = (+calculated - +now) / n;

      if (ratio < 0.95 || ratio > 1.05) {
        console.error({ now, to, calculated, map });
        throw new Error("Duration might be miscalculated (CI 95%)");
      }
    });
  });
```

Indeed, a more correct way would be to use ISO date-time string, and remove smallest parts. I have tried it, and sometimes I missed by 1 day.

## Fine tuning

```ts
export function humanizeDurationToNow(epoch: number) {
  const now = new Date();
  const msec = +now - epoch;

  if (msec < 5000) {
    return 'Just posted';
  }

  return durationToString(new Date(epoch), now, { trim: 2 }) + ' ago';
}
```

## Real code

[The real code can be found on GitHub and NPM.](https://github.com/patarapolw/native-duration) It uses absolutely zero dependencies.

<%- xCard({
  href: 'https://github.com/patarapolw/native-duration',
  image: 'https://avatars3.githubusercontent.com/u/21255931?s=400&amp;v=4',
  title: 'patarapolw/native-duration',
  description: '[JS/TS] Calculate duration between two dates with zero dependencies (via Date object) - patarapolw/native-duration'
}) %>
