# Personal Website: Mock Plan

Goal: a simple personal site in the style of thorstenball.com. On desktop it
should look like his site does on a phone: one narrow centered column, nav
links across the top, lots of white space.

## Design direction

- **Layout:** one centered column, about 600–680px wide at every screen size.
  Desktop gets wide empty margins and no sidebars or multi-column grids.
- **Top nav:** a row of text links under the name, for example
  `Home · Blog · Projects · About`. The current page is bold or underlined. On
  very small screens the links wrap instead of collapsing into a hamburger menu.
- **Typography:** readable body text, 17–19px with about 1.6 line height.
  Use a system font stack or one Google Font. Keep headings modest.
- **Color:** near-black text on an off-white background, and one accent color
  for links. Dark mode is optional.
- **Imagery:** at most a small round headshot on the home page.

## Pages / sections (mock v1)

| Nav item | Content |
|----------|---------|
| Home     | Name, headshot, 2–3 sentence intro, a short list of recent posts |
| Blog     | Post list: date and title, one per line, newest first |
| Projects | Short entries: title, one-line description, link |
| About    | Longer bio, contact and social links |

There is also a sample blog post page to test long-form reading.

## Tech approach

1. **Mock (now):** plain static HTML + one shared `style.css`, with no build
   step and placeholder text.
2. **Later, if you like it:** move to a static site generator (Hugo, Eleventy,
   or Jekyll) so posts can be written in Markdown.
3. **Hosting:** GitHub Pages, Netlify, or Cloudflare Pages, all free for static
   sites.

## File structure (mock)

```
index.html      # Home
blog.html       # Post list
post.html       # Sample post
projects.html
about.html
style.css
img/headshot.jpg (placeholder)
```

## Steps

1. Confirm the open questions below.
2. Build `style.css` (column width, type scale, nav, links).
3. Build the 5 HTML pages with placeholder content.
4. Check it at desktop width (~1440px) and phone width (~375px).
5. Review together, then swap in real content.

## Open questions

- Which nav sections do you want? The ones above are placeholders.
- Your name / site title, and a short bio (placeholder is fine for now)?
- Font preference: serif (bookish) or sans-serif (clean)?
- Accent color?
- Headshot on the home page: yes or no?
- Do you want a blog/newsletter section at all?
