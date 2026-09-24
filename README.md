# Personal website

A small static site: plain HTML, CSS and JavaScript with no build step.

## Layout

```
index.html              Home
about/index.html        About
blog/index.html         Post list
blog/<post>.html        One file per post
projects/index.html     Projects
tools/index.html        List of tools
tools/<tool>.html       One page per tool

css/base.css            Colors, fonts, reset, typography
css/layout.css          Page column, header/nav, footer
css/components.css      Post lists, item lists, calculator forms

js/lib/                 Pure logic (math, formatting) plus the reusable
                        line chart. Math files have no DOM and are unit tested.
js/tools/               One script per tool page; connects a form to js/lib.
js/analytics.js         Loads visit counting on every page; trackEvent()
tests/                  Tests for js/lib (Node's built-in test runner)
404.html                Shown for any address that doesn't exist
.github/workflows/      Runs tests, then publishes to GitHub Pages
```

## Preview locally

The pages load JavaScript modules, which browsers block on `file://`, so run
a tiny local server:

```
npm start        # then open http://localhost:8000
```

(`npm start` just runs `python3 -m http.server 8000`.)

## Tests

```
npm test
```

## Adding things

- **Blog post:** copy `blog/sample-post.html`, edit it, and add a line to
  `blog/index.html` (and the home page's recent posts).
- **Tool:** put the math in `js/lib/<name>.js` with tests in
  `tests/<name>.test.js`, the form wiring in `js/tools/<name>.js`, and the page
  in `tools/<name>.html`. Link it from `tools/index.html`.
- **Nav link:** the header is repeated in every page, so update each one.

## Publishing (GitHub Pages, free)

Every push to `main` runs the tests, and if they pass, publishes the site.

One-time setup: in the GitHub repo go to **Settings → Pages** and set
**Source** to **GitHub Actions**. On a free GitHub plan the repo must be public
for Pages to work.

## Visitor stats (GoatCounter, free)

1. Sign up at https://www.goatcounter.com/signup and pick a site code, e.g.
   `yourname`. Your dashboard will be at `https://yourname.goatcounter.com`.
2. Put that code in `js/lib/analytics-config.js` (`GOATCOUNTER_CODE`).

With no code set, nothing is tracked. Visits from `localhost` are never
counted. GoatCounter uses no cookies, so no cookie banner is needed; the
About page has a short privacy note.

The dashboard shows visitors and page views over time, top pages, where
visitors came from (referrers and `?ref=` / `utm_` campaign links), countries,
browsers, operating systems and screen sizes. Calculator use shows up as
events named `price-calculator/discount` and `price-calculator/increase`.
