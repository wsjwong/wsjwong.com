interface SocialLink {
  href: string;
  label: string;
}

interface SiteConfig {
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

export const SITE: SiteConfig = {
  website: "https://wsjwong.com/",
  author: "Joe Wong",
  profile: "https://wsjwong.com/about",
  desc: "Building products, sharing notes, and shipping in public.",
  title: "Joe Wong",
  ogImage: "avatar.jpg",
  lightAndDarkMode: true,
  postPerIndex: 10,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000,
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

export const NAV_LINKS: SocialLink[] = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/about", label: "About" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { href: "https://github.com/wsjwong", label: "GitHub" },
  { href: "https://www.linkedin.com/in/wsjwong/", label: "LinkedIn" },
  { href: "/rss.xml", label: "RSS" },
];

export const SOCIALS = [
  {
    name: "Github",
    href: "https://github.com/wsjwong",
    linkTitle: `${SITE.title} on Github`,
    icon: "github",
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/wsjwong/",
    linkTitle: `${SITE.title} on LinkedIn`,
    icon: "linkedin",
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:hello@wsjwong.com",
    linkTitle: `Send an email to ${SITE.title}`,
    icon: "mail",
    active: false,
  },
] as const;

export const SHARE_LINKS = [
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: "Share this post on X",
    icon: "twitter",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/sharing/share-offsite/?url=",
    linkTitle: "Share this post on LinkedIn",
    icon: "linkedin",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/?text=",
    linkTitle: "Share this post via WhatsApp",
    icon: "whatsapp",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/sharer.php?u=",
    linkTitle: "Share this post on Facebook",
    icon: "facebook",
  },
  {
    name: "Telegram",
    href: "https://t.me/share/url?url=",
    linkTitle: "Share this post via Telegram",
    icon: "telegram",
  },
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: "Share this post via email",
    icon: "mail",
  },
] as const;

export const ICON_MAP: Record<string, string> = {
  GitHub: "github",
  LinkedIn: "linkedin",
  RSS: "rss",
  Email: "mail",
};
