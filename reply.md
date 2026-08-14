# Reply to client — Google Ads landing page

## Message 1 — answering "what's the difference vs my existing page?"

Good question — they're built for two different jobs.

Your current page is a **website page**. It has to serve everyone (browsers, past clients, Google organic), so it has a full menu, links to other treatments, a long intro, and the booking action sits well down the page. That's correct for a website. But for paid traffic it leaks money in four places:

**1. Exits.** The header menu, "About Us", other treatments, social icons — every one is a way for a click you just paid for to wander off. An ads page has no menu. One goal: the form.

**2. Message match.** Someone searching "hydrafacial near me" should land on a page whose headline repeats those exact words plus the offer. Your current page opens with a general description, so the visitor has to work out they're in the right place. Google also scores this — better match means **higher Quality Score, which lowers your cost per click**.

**3. The form position.** Right now a visitor scrolls through several sections before there's anywhere to leave details. On the ads page the form sits on the first screen, on desktop and mobile, with a sticky "Call / Book" bar on phones — where most ad traffic comes from.

**4. Measurement.** Your current page has no conversion tracking, so Google Ads can't tell which keyword produced a booking and can't optimise. The ads page ships with Google Tag Manager, a `generate_lead` conversion event, phone-click tracking and scroll tracking, so from day one you'll see cost per lead per keyword.

Plus it's a single lightweight page — no site theme, no plugin bloat — so it loads in about a second on 4G. Slow pages burn ad budget before the page even paints.

The website page stays exactly as it is. This is a separate page that only ads traffic sees, which also means we can test a second version against it later without touching your site.

---

## Message 2 — samples

Here's a sample I built in your exact niche so you can see the structure rather than just imagine it:

**[paste live link here]**

Worth looking at on your phone as well as desktop — that's where the ad clicks come from.

What's in it:
- Bold headline + offer + booking form all on the first screen, no scrolling
- Zero navigation links — the only actions are Book or Call
- One core benefit expanded into three proof points, then before/after, process, reviews, FAQ
- Sticky call/book bar on mobile
- Google Tag Manager container, conversion event on form submit, phone-click and scroll tracking already wired
- Title/meta/H1, LocalBusiness + FAQ schema for on-page SEO
- One file, no external fonts or scripts — loads fast

Copy, colours, offer and photos all get swapped to your brand once you send them. $30 AUD per page as quoted, and I'll do a package rate if you need several (one per treatment or per city works best for ads).

---

## Hosting the sample (pick one, takes 2 minutes)

- **Netlify Drop** — netlify.com/drop, drag the folder in, get a link instantly. No account needed for a temp link.
- **GitHub Pages** — push `index.html` to a repo, Settings → Pages → deploy from main.
- **Cloudflare Pages** — same drag-and-drop flow, free.

Before sending, in `index.html`:
- Replace `GTM-XXXXXXX` if you want to demo a live container (fine to leave as-is for a sample).
- Replace the phone number `+61200000000` and `(02) 0000 0000`.
- Drop real before/after photos into the two `.shot` divs.
