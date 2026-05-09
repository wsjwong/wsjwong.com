# Project Instructions

This repository powers Joe Wong's personal website at wsjwong.com.

## Critical Guidelines

### Blog Content

- Never create new blog posts without explicit consent from Joe.
- Only help with editing or fixing existing posts when asked.

### Development Server Limitation

- Do not run `npm run dev` in agent mode; it keeps running and can block automation.
- Use `npm run build` and `npm run check` to verify changes.

### Dependencies

- Do not downgrade dependencies as a quick fix.
- Use tooling to check versions before dependency work:

  ```bash
  npm outdated
  npm view astro version
  ```

## Common Commands

```bash
npm run check
npm run build
```

## Project Structure

- `src/content/blog/` — blog posts in Markdown/MDX, organized by year.
- `public/blog-images/` — images used by current wsjwong.com posts.
- `src/pages/` — Astro routes and page templates.
- `src/components/` — reusable UI components.
- `src/layouts/` — page layouts.
- `src/styles/` — global styling.

## Deployment

The production site is deployed through Cloudflare Pages from `wsjwong/wsjwong.com`.
