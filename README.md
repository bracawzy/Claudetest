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

js/lib/                 Pure logic (math, formatting). No DOM, unit tested.
js/tools/               One script per tool page; connects a form to js/lib.
tests/                  Tests for js/lib (Node's built-in test runner)
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
