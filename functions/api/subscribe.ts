import { neon, neonConfig } from "@neondatabase/serverless";

// Cache fetch connections on Cloudflare/edge for better performance
neonConfig.fetchConnectionCache = true;

// Simple email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubscribePayload = { email?: string; path?: string; source?: string };

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}

function safeRedirectPath(path: string | undefined) {
  if (!path) return "/";
  if (!path.startsWith("/")) return "/";
  // Prevent protocol-relative or weird paths
  if (path.startsWith("//")) return "/";
  return path;
}

export async function onRequestPost(context: any) {
  try {
    const request: Request = context?.request as Request;
    const url = new URL(request.url);
    const contentType = request.headers.get("content-type") || "";
    const accept = request.headers.get("accept") || "";

    let email: string | undefined;
    let path: string | undefined;
    let source: string | undefined;

    if (contentType.includes("application/json")) {
      const body = (await request.json().catch(() => ({}))) as Partial<SubscribePayload>;
      email = typeof body?.email === "string" ? body.email : undefined;
      path = typeof body?.path === "string" ? body.path : undefined;
      source = typeof body?.source === "string" ? body.source : undefined;
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await request.text();
      const params = new URLSearchParams(text);
      email = params.get("email") || undefined;
      path = params.get("path") || undefined;
      source = params.get("source") || undefined;
    } else {
      email = url.searchParams.get("email") || undefined;
      path = url.searchParams.get("path") || undefined;
      source = url.searchParams.get("source") || undefined;
    }

    const wantsJson =
      accept.includes("application/json") || contentType.includes("application/json");

    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!normalizedEmail || normalizedEmail.length > 254 || !emailRegex.test(normalizedEmail)) {
      if (!wantsJson) {
        const redirectTo = new URL(safeRedirectPath(path), url.origin);
        redirectTo.searchParams.set("subscribe_error", "invalid_email");
        return Response.redirect(redirectTo.toString(), 303);
      }
      return json({ ok: false, error: "Invalid email" }, 400);
    }

    const connectionString =
      context?.env?.NEON_DATABASE_URL ||
      context?.env?.DATABASE_URL ||
      (globalThis as any).process?.env?.NEON_DATABASE_URL ||
      (globalThis as any).process?.env?.DATABASE_URL;

    if (!connectionString) {
      if (!wantsJson) {
        const redirectTo = new URL(safeRedirectPath(path), url.origin);
        redirectTo.searchParams.set("subscribe_error", "db_not_configured");
        return Response.redirect(redirectTo.toString(), 303);
      }
      return json({ ok: false, error: "Database not configured" }, 500);
    }

    const sql = neon(connectionString as string);
    const userAgent = request.headers.get("user-agent") || null;
    const referer = request.headers.get("referer") || undefined;
    const refererPathname = (() => {
      if (!referer) return undefined;
      try {
        return new URL(referer).pathname;
      } catch {
        return undefined;
      }
    })();

    const safePath = safeRedirectPath((path || refererPathname || "/").slice(0, 512));
    const inferredSource = (source && source.trim()) || url.hostname || "unknown";

    // Assumes `email_subscriptions` table already exists in the database.
    // On re-subscribe, flip `subscribed` back to TRUE and refresh metadata.
    await sql`INSERT INTO email_subscriptions (email, source, path, user_agent)
              VALUES (${normalizedEmail}, ${inferredSource}, ${safePath}, ${userAgent})
              ON CONFLICT (email, source)
              DO UPDATE SET
                subscribed = TRUE,
                path = EXCLUDED.path,
                user_agent = EXCLUDED.user_agent`;

    if (!wantsJson) {
      const redirectTo = new URL(safePath, url.origin);
      redirectTo.searchParams.set("subscribed", "1");
      return Response.redirect(redirectTo.toString(), 303);
    }

    return json({ ok: true }, 200);
  } catch (err: any) {
    return json({ ok: false, error: "Server error", detail: String(err?.message || err) }, 500);
  }
}
