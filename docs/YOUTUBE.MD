# Using YouTube Embeds in Blog Posts

This document provides a quick guide on how to use YouTube embeds in blog posts.

## Using the YouTube Embed Tag

To embed a YouTube video, use this syntax:

```text
{% youtube VIDEO_ID %}
```

`VIDEO_ID` can be the YouTube video ID or the full URL.

### Examples

```text
{% youtube dQw4w9WgXcQ %}
{% youtube https://www.youtube.com/watch?v=dQw4w9WgXcQ %}
{% youtube https://youtu.be/dQw4w9WgXcQ %}
```

## How It Works

The site uses `MDXTwitterTransform.astro` to scan blog content for embed tags and replace them with responsive embeds.

## Best Practices

1. Prefer `{% youtube %}` over direct iframe embeds.
2. This keeps embeds responsive.
3. It works with full YouTube URLs, youtu.be short URLs, and plain video IDs.
