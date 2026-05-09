# Joe Wong's Personal Website

Source code for [wsjwong.com](https://wsjwong.com), Joe Wong's personal website and blog.

Built with [Astro](https://astro.build) and deployed on [Cloudflare Pages](https://pages.cloudflare.com).

## Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run check` | Run Biome checks |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the built site locally |

## Project Structure

```text
public/              Static assets
  blog-images/       Images used by current posts
src/
  components/        Reusable UI components
  content/blog/      Blog posts
  layouts/           Page layouts
  pages/             Astro routes
  styles/            Global styles
  utils/             Utility functions
astro.config.mjs     Astro configuration
package.json         Dependencies and scripts
```

## Deployment

Pushes to `main` in `wsjwong/wsjwong.com` deploy through Cloudflare Pages.

## License

- Documentation and blog posts: CC BY 4.0
- Code: MIT

See [LICENSE](LICENSE) for details.
