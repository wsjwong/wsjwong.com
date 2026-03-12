# Joe Wong's Personal Website

This is the source code for my personal website ([wsjwong.com](https://wsjwong.com)), built with [Astro](https://astro.build) and deployed on [Cloudflare Pages](https://pages.cloudflare.com).

## About

I'm Joe Wong (@wsjwong). This website hosts my personal blog and updates on products I'm building.

## Project Structure

```text
├── public/               # Static assets (images, fonts, favicon)
│   ├── assets/          # Images for blog posts
│   └── fonts/           # Web fonts
├── src/
│   ├── assets/          # Icons and images used in components
│   ├── components/      # Reusable UI components
│   │   └── ui/          # React components
│   ├── content/         # Content collections
│   │   └── blog/        # Blog posts in Markdown format (organized by year)
│   ├── layouts/         # Page layouts and templates
│   ├── pages/           # Routes and pages
│   ├── styles/          # Global styles and CSS
│   └── utils/           # Utility functions
├── astro.config.mjs     # Astro configuration
├── vercel.json          # Vercel deployment and CSP configuration
├── package.json         # Project dependencies and scripts
├── tailwind.config.mjs  # Tailwind CSS configuration
└── LICENSE              # Dual license (CC BY 4.0 + MIT)
```

## Commands

| Command                | Action                                      |
| :--------------------- | :------------------------------------------ |
| `npm install`          | Installs dependencies                       |
| `npm run dev`          | Starts local dev server at `localhost:4321` |
| `npm run build`        | Build the production site to `./dist/`      |
| `npm run preview`      | Preview the build locally, before deploying |

## Deployment

This site deploys to the Cloudflare Pages project `wsjwong-com`.
Pushes to `main` in `wsjwong/wsjwong.com` trigger the GitHub Actions workflow in [.github/workflows/cloudflare-pages.yml](.github/workflows/cloudflare-pages.yml), which builds the site and deploys `dist/` to production.

## Newsletter subscription

The newsletter form submits to the local endpoint `POST /api/subscribe` (Cloudflare Pages Function in `functions/api/subscribe.ts`).

Required env var (set in your Cloudflare Pages project or local env):

- `NEON_DATABASE_URL` (preferred) or `DATABASE_URL` (Postgres connection string)

## License

This repository uses dual licensing:

- **Documentation & Blog Posts**: Licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)
- **Code & Code Snippets**: Licensed under the [MIT License](LICENSE)

See the [LICENSE](LICENSE) file for full details.

## Special Thanks

Special thanks to [Sat Naing](https://github.com/satnaing) for creating the excellent [AstroPaper theme](https://astro-paper.pages.dev/) that served as the foundation for this website. Their thoughtful design and clean architecture made it a joy to build upon.
