import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const markdownContent = `# Joe Wong (@wsjwong)

Building products, sharing notes, and shipping in public.

## Navigation

- [About](./about.md)
- [All Posts](./posts.md)
- [RSS Feed](./rss.xml)

## Links

- LinkedIn: https://www.linkedin.com/in/wsjwong/
- GitHub: https://github.com/wsjwong

---

*This is a markdown-only view. Visit the HTML site for the full experience.*`;

  return new Response(markdownContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
