import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const markdownContent = `# Joe Wong (@wsjwong)

Building products, sharing notes, and shipping in public.

## Navigation

- [About](/about.md)
- [Recent Posts](/posts.md)
- [Archives](/archives.md)
- [RSS Feed](/rss.xml)

## Links

- GitHub: [@wsjwong](https://github.com/wsjwong)
- LinkedIn: [Joe Wong](https://www.linkedin.com/in/wsjwong/)
- Email: hello@wsjwong.com

---

*This is the markdown-only version of wsjwong.com. Visit [wsjwong.com](https://wsjwong.com) for the full experience.*`;

  return new Response(markdownContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
