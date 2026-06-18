export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? 'IT Quest',
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE ?? 'Level Up Your Workload',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api',
  brandLogoUrl:
    process.env.NEXT_PUBLIC_BRAND_LOGO_URL ??
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC-_wxnwop3bqfwULyAstIm9RxrqvfED6SfKribFWvzH8boE8qmFdNGpc29VFgVXGdr6rFKdSdhCumzgEfmx_WMES6VJyj5f5wU9QAhCWLpr9NuS1efMqm5qJiXHkXDHJn2EU-FXIJAg5i87gqiWu9oYGa_DdfFa7WXGaeeOwDEqkWQVDAnHt2wD1yiFW_ohElJJbyL5FofAKHkfJrJB8fLlXDgSXa-uj23GZBLaMsJjA-rD_xervdjdbwjAv3Iefn7QLIlWeKt9L4',
  loginLogoUrl:
    process.env.NEXT_PUBLIC_LOGIN_LOGO_URL ??
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAgjQD3m2GvXZadgHupCzZaX3mH_ldor2KLE1wTY7Wh6gWbSKW0jiKop6XFA_zW6TSFBx9Req2LNb7aVsfzAWViPuES17M5GgwNVxyPvV19hCDxGBpr-9E3E0SqxlJ4ynqZtod2VXCOBZoPusC6jVnqnKBcS1Zg6vUcivSwTGRn9utCVCEbnSO47jGeXODnWpUaG6sXAwvVkgnTN1Y-Pwz3DO2hGrd2mvcBALWCiEqe7ewKijkwQbif5huVzOc87LioEcbu4DVSQRY',
  dashboardHeroAvatarUrl:
    process.env.NEXT_PUBLIC_DASHBOARD_HERO_AVATAR_URL ??
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBIQj1Y61H_-v7Qj_LbpYfxLLCFgSBqgsbNO2LUrQptF60XBHitoVwjMeum9yPTngbEBBxf4vKxOEcIVBM5MhwmKP8B-Mn86PvKpE-vJbMSK4AE5ElW-fdJIpwcZ9usHDtdyiVh5mga0NuQH_bVKvugrwayBUfLdr2h0x7pcpAiV6d6-vmr2CYq4amk9UoQGunGVbAc--w9YPEGLZIpqddG89XMG8LBJd03oXqFS1AGMeByEHlgTbsdYFosTl2G278Bgubz0yIhnCM',
  dashboardProfileUrl:
    process.env.NEXT_PUBLIC_DASHBOARD_PROFILE_URL ??
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCLvWsRPDARudZOYRGsI3dOLxsuzKpFbOiL7o1giBQw_gXUUloBXfhjJHaNgKIxxoLxoXs-J47okyA3uN5F9qYMtrE-Iu-pkrx7dcXgR5CSh0le3lALteim3yN6WRKWSpnSUFaLqmhEUmdCBj-X_yqYagVcgMAl3nNi0fMLQ8eTsric_R6RtjO3v9v19QY6ldJAbbgsMgELF0LeSDcBYqvHI-GWsvzGtrJ1HB4O7hiWbQB-34MXiHUQtZr_wocWqNSCAX_MmDXRKI0',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@itquest.local'
};