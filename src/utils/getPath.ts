import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";

/**
 * Get path of a blog post.
 *
 * - includeBase=true  => returns a site-absolute href (BASE_URL aware), e.g. /posts/2025/my-post
 * - includeBase=false => returns the slug path (no leading slash), e.g. 2025/my-post
 */
export function getPath(id: string, filePath: string | undefined, includeBase = true) {
  const pathSegments = filePath
    ?.replace(BLOG_PATH, "")
    .split("/")
    .filter((path) => path !== "")
    .filter((path) => !path.startsWith("_"))
    .slice(0, -1)
    .map((segment) => slugifyStr(segment));

  // Making sure `id` does not contain the directory
  const blogId = id.split("/");
  const slug = blogId.length > 0 ? blogId.slice(-1) : blogId;

  if (!includeBase) {
    // Used for route params (no leading slash)
    return pathSegments && pathSegments.length > 0
      ? [...pathSegments, slug].join("/")
      : slug.join("/");
  }

  const baseUrl = import.meta.env.BASE_URL;
  const basePrefix = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const postsPrefix = `${basePrefix}/posts`;

  // If not inside the sub-dir, simply return the file path
  if (!pathSegments || pathSegments.length < 1) {
    return [postsPrefix, slug].join("/");
  }

  return [postsPrefix, ...pathSegments, slug].join("/");
}
