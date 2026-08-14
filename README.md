# Google Ads Landing Pages — Sample Builds

Three complete, working landing pages built for paid traffic — plus an index page that presents them.

**Live:** https://anummuzaffar.github.io/landing-page-samples/

| Page | Niche | Structure |
|------|-------|-----------|
| `samples/aesthetics.html` | Skin clinic — facial treatment | Split hero, booking form beside the headline |
| `samples/dental.html` | Dental implants — high ticket | Centred hero, transparent pricing, payment plans |
| `samples/solar.html` | Solar installer — quote request | Dark hero, one-tap quiz form, savings table |

## In every page

- **One goal, no exits** — no navigation menu, no outbound links
- **Form on the first screen** — desktop and mobile, plus a sticky call/book bar on phones
- **Google Tag Manager** container + `generate_lead` conversion event with value
- **Event tracking** — CTA clicks, phone clicks, form start, form errors, scroll depth
- **Fast** — single file, inline CSS, system fonts, no external libraries or requests
- **On-page SEO** — title, meta description, single H1, LocalBusiness + FAQ schema
- **Spam handling** — honeypot field plus client-side validation

## Before going live

1. Replace `GTM-XXXXXXX` with the real container ID.
2. Uncomment the `gtag('event','conversion', …)` lines and add the Google Ads `AW-` ID and label.
3. Point the form at the destination CRM/endpoint (marked `// POST to CRM here`).
4. Replace phone numbers, brand name, colours and images.

Brands, copy and figures shown are illustrative samples, not client work.
