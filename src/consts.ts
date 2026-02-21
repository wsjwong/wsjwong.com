// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

interface SocialLink {
  href: string;
  label: string;
}

interface Site {
  website: string;
  author: string;
  profile: string;
  desc: string;
  title: string;
  ogImage: string;
  lightAndDarkMode: boolean;
  postPerIndex: number;
  postPerPage: number;
  scheduledPostMargin: number;
  showArchives: boolean;
  showBackButton: boolean;
  editPost: {
    enabled: boolean;
    text: string;
    url: string;
  };
  dynamicOgImage: boolean;
  lang: string;
  timezone: string;
}

// Site configuration
export const SITE: Site = {
  website: "https://wsjwong.com/",
  author: "Joe Wong",
  profile: "https://wsjwong.com/about",
  desc: "Building products, sharing notes, and shipping in public.",
  title: "Joe Wong",
  // Kept filename for theme compatibility (we overwrite the image asset)
  ogImage: "peter-avatar.jpg",
  lightAndDarkMode: true,
  postPerIndex: 10,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000,
  showArchives: false,
  showBackButton: false,
  editPost: {
    enabled: false,
    text: "Edit on GitHub",
    url: "https://github.com/wsjwong/wsjwong.com/edit/main/",
  },
  dynamicOgImage: true,
  lang: "en",
  timezone: "UTC",
};

export const SITE_TITLE = SITE.title;
export const SITE_DESCRIPTION = SITE.desc;

// Navigation links (used by the React mobile menu)
export const NAV_LINKS: SocialLink[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/posts",
    label: "Blog",
  },
  {
    href: "/about",
    label: "About",
  },
];

// Social media links (currently unused by default theme components)
export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://github.com/wsjwong",
    label: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/wsjwong/",
    label: "LinkedIn",
  },
  {
    href: "/rss.xml",
    label: "RSS",
  },
];

// Icon map for social media
export const ICON_MAP: Record<string, string> = {
  GitHub: "github",
  LinkedIn: "linkedin",
  RSS: "rss",
  Email: "mail",
};
