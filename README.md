# White Swan public website

Public discovery and guest experience for White Swan Villa / Xanadu Beach House, El Salvador. This repository is the **public marketing surface** of the platform. It must never contain app credentials, guest conversations, identity documents or door/Wi-Fi/safe codes.

## Live and proposed release

- Production: https://staywhiteswan.com — deployed by GitHub Pages from `scalix09/whiteswan-website`, branch `main`, root `/`.
- Proposed changes are in the `dashdigitaldd` fork. A fork push does **not** update the current domain. The upstream owner must merge the reviewed pull request.
- Preserve `CNAME`, DNS and both existing WhatsApp numbers. Coordinate with the owner before changing any of them.
- Accommodation checkout remains Airbnb listing `47911834` until direct-payment onboarding and inventory reconciliation are completed. Website enquiries do not reserve nights, suppliers or prices.

## Routes

| English | Spanish | Purpose |
|---|---|---|
| `/` | `/es/` | Villa discovery, experiences and enquiry |
| `/guide/` | `/es/guia/` | Existing guest guide |
| `/photos/` | `/es/fotos/` | Full photo tour with filters and accessible viewer |
| `/privacy/` | `/es/privacidad/` | Data and analytics choices |

The root remains English, with explicit language links and reciprocal hreflang. Both languages render without JavaScript. Legacy root links to arrival, house, rules and checkout redirect to the guest guide when JavaScript is available. The guest guide preserves the existing operational content and contacts; it is not automatically promoted to verified AI knowledge.

## Editing and local preview

GitHub Pages serves committed static HTML, CSS, JS and photographs. It still needs no server build, framework or runtime packages.

```sh
python3 -m http.server 8120 --bind 127.0.0.1
python3 scripts/check.py
```

The generated eight HTML pages are maintained by `scripts/build.py`. Edit its bilingual copy/template and `content/guide.html.template`, then regenerate with Python plus the dev-only packages in `requirements-dev.txt`. Generated output and responsive WebP images are committed, so GitHub Pages does not need these packages. Original photos remain intact. Do not edit generated HTML alone.

## Connected intake

`assets/config.js` contains only the public intake origin. The separate `whiteswan-intake` service validates and stores enquiries. A server-only read credential lets the private Xanadu app import them into **Website & growth**. No admin endpoint or integration secret is exposed to the browser.

An enquiry is accepted only after a successful server receipt. The form keeps entered details on failure and offers the original WhatsApp fallback. Repeated identical submissions use the same signed reference. Continuing on WhatsApp includes that reference; it does not prove that a message was sent. Full WhatsApp intake still requires Business Platform onboarding and verified webhooks.

## Analytics and SEO

First-party events are opt-in: `page_view`, `enquiry_open`, `whatsapp_click`, `airbnb_click`. They contain a bounded page/service/placement/language/campaign schema. Names, contact fields and message bodies are excluded. Declining analytics does not disable enquiries. There are no cross-page visitor IDs or conversion/revenue assumptions.

**No GA4 or GTM tag is installed.** Coordinate one property and one tag owner first, then implement the adapter described in [growth architecture](docs/GROWTH_ENGINE.md). A custom browser event is available for an approved adapter; it must not create duplicate page views or include personal fields.

Each page has its own title, description, canonical, hreflang, crawlable navigation and structured data. `sitemap.xml` and `robots.txt` are committed. Search Console ownership, sitemap submission, indexing and actual rankings are not configured or guaranteed by this code.

See [growth architecture](docs/GROWTH_ENGINE.md), [launch checklist](docs/LAUNCH.md), and [payment discovery](docs/PAYMENTS.md).

## Editorial design and current listing photos

The public homepage and photo tour use the 36-photo collection retrieved from the current Airbnb listing on September 15, 2026. See [photography provenance, asset preparation and design maintenance](docs/PHOTOGRAPHY.md). The homepage renderer is in `scripts/homepage.py`, separate from the original guest guide. The public deployment remains pending the upstream website PR merge.
