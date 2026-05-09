// @ts-check
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AstroPWA from "@vite-pwa/astro";
import { defineConfig } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import { SITE } from "./src/site.config";
import { remarkLazyLoadImages } from "./src/utils/remarkLazyLoadImages.mjs";

const siteUrl = SITE.website.replace(/\/$/, "");

export default defineConfig({
  site: SITE.website,
  trailingSlash: "never",
  markdown: {
    remarkPlugins: [
      remarkToc,
      // @ts-ignore - TypeScript has issues with remark plugin tuple syntax
      [remarkCollapse, { test: "Table of contents" }],
      remarkLazyLoadImages,
    ],
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      wrap: true,
    },
  },
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        if (item.url.endsWith("/") && item.url !== `${siteUrl}/`) {
          item.url = item.url.slice(0, -1);
        }

        const url = item.url;
        item.changefreq = ChangeFreqEnum.MONTHLY;
        item.priority = 0.5;

        if (url === siteUrl || url === `${siteUrl}/`) {
          item.priority = 1.0;
          item.changefreq = ChangeFreqEnum.DAILY;
          item.lastmod = new Date().toISOString();
        } else if (url.endsWith("/posts") || url.endsWith("/about") || url.endsWith("/search")) {
          item.priority = 0.9;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (
          url.includes("/posts/2026") ||
          url.includes("/posts/2025") ||
          url.includes("/posts/2024")
        ) {
          item.priority = 0.8;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (
          url.includes("/posts/2023") ||
          url.includes("/posts/2022") ||
          url.includes("/posts/2021") ||
          url.includes("/posts/2020")
        ) {
          item.priority = 0.6;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        } else if (url.includes("/posts/201")) {
          item.priority = 0.4;
          item.changefreq = ChangeFreqEnum.YEARLY;
        } else if (url.includes("/tags/")) {
          item.priority = 0.1;
          item.changefreq = ChangeFreqEnum.YEARLY;
        }

        return item;
      },
    }),
    react(),
    AstroPWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "favicon.svg",
        "apple-touch-icon.png",
        "favicon-192.png",
        "favicon-512.png",
        "avatar.jpg",
      ],
      manifest: {
        name: "Joe Wong",
        short_name: "WS",
        description: "Building products, sharing notes, and shipping in public.",
        theme_color: "#2337ff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "favicon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "favicon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "favicon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "/404",
        globPatterns: ["**/*.{css,js,html,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true,
        navigateFallbackAllowlist: [/^\//],
      },
      experimental: {
        directoryAndTrailingSlashHandler: true,
      },
    }),
  ],
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});
