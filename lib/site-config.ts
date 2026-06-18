export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? 'IT Quest',
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE ?? 'Level Up Your Workload',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@itquest.local'
};
