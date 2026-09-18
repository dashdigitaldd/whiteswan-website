# White Swan search foundation

Implemented 18 September 2026. This is the source-controlled SEO configuration for the public GitHub Pages site. It does not install analytics or activate booking/payment systems.

## Search intent and content

| Page pair | Main purpose |
| --- | --- |
| `/` and `/es/` | White Swan; private ocean-view villa / casa de playa in Xanadu, Tamanique, La Libertad, El Salvador; four bedrooms and an infinity pool |
| `/photos/` and `/es/fotos/` | Real villa photos: bedrooms, pool, kitchen, terrace and ocean views |
| `/stay/` and `/es/reservar/` | Plan a stay with the host; availability, pricing and payment remain subject to confirmation |
| `/guide/` and `/es/guia/` | Useful villa information, services, arrival, house rules and nearby coastal destinations |

The homepage introduction now states the property type and actual location naturally in each language. No hidden keyword lists, generated location pages, fictional facilities, review counts or prices were added. Keep the concise visual layout; future destination pages should add useful original information, not copy the same text to multiple keyword URLs.

## Metadata, indexing and structured data

- `scripts/seo.py` defines unique English/Spanish titles, descriptions, page pairs, visible breadcrumb names and modification dates.
- Each page has one self-referencing canonical and reciprocal `en`, `es`, and `x-default` links. Tracking/preview parameters and fragments never enter canonical URLs. Language URLs stay accessible without forced language redirection. This follows [Google's localized-page guidance](https://developers.google.com/search/docs/specialty/international/localized-versions).
- JSON-LD connects the website, the White Swan lodging business and each page. It includes verified address locality, phone, amenities, check-in/out and bedroom/bathroom facts. Interior pages have matching visible breadcrumbs and `BreadcrumbList`; gallery pages expose their 35 photographs as image objects.
- Capacity is deliberately omitted while the 8-versus-10 discrepancy remains unresolved. There are no fictional map coordinates, street addresses, live rates, availability, star classifications or aggregate ratings. Selected Airbnb reviews remain visible without self-serving rating markup.
- We use the ordinary `LodgingBusiness` entity; this does **not** enroll the property in Google Hotels. Google's vacation-rental rich presentation requires eligibility and additional integration: see [VacationRental documentation](https://developers.google.com/search/docs/appearance/structured-data/vacation-rental). No FAQ rich-result promise is made.
- Open Graph and Twitter metadata include localized descriptions, image dimensions and alt text.
- The image sitemap includes the eight indexable content URLs, their actual displayed curated photographs, and maintained modification dates. It excludes privacy and error pages. Image entries use the supported `image:loc` field; see [Google image sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps).
- Privacy pages are `noindex,follow` but remain accessible. `robots.txt` permits public pages and assets and discourages crawling source/docs/test directories. Robots rules are not a privacy or access-control mechanism.
- `404.html` provides English/Spanish recovery links and `noindex`. GitHub Pages serves it with a 404 status for missing routes; Python's local preview server has its own missing-route response.

Update a page's `updated` value only when that page materially changes. The generator never stamps all URLs with the current date on each build.

## Loading and usability

Fonts are self-hosted WOFF2 files with the upstream SIL Open Font Licenses and source URLs in `assets/fonts/`. Their Latin subsets support English and Spanish. The primary text fonts are preloaded; `font-display: swap` keeps text available. The privacy page now reflects local font hosting.

`assets/site.min.css` combines six source stylesheets in their original cascade order, using pinned `rcssmin` during the development build. Edit the original stylesheets and rebuild; do not hand-edit the bundle. The site has no runtime package dependencies.

The cover supports AVIF with the original WebP fallback and a matching responsive preload. At 960px, the daylight asset is 65,485 bytes versus 116,692 bytes for WebP (about 44% smaller); the night asset is 86,876 versus 140,708 bytes (about 38% smaller). These are mechanical encodings of the selected photographs, with no new retouching. `scripts/prepare_cover_formats.py` regenerates these six variants when the source cover photos change. Below-fold photographs retain lazy loading and dimensions; the first cover image is prioritized. This follows [LCP resource guidance](https://web.dev/articles/optimize-lcp).

Uncrawlable empty links now have safe WhatsApp fallback destinations before JavaScript attaches their contextual message. Supporting text contrast and brand-link accessibility have been corrected. All booking/service actions remain deliberate guest actions; no messages are sent in automated tests.

## Local validation, not live ranking evidence

Lighthouse 13.5.0 mobile simulations on the uncompressed local preview:

| Audit | Before (EN) | Final EN | Final ES |
| --- | ---: | ---: | ---: |
| SEO | 92 | 100 | 100 |
| Accessibility | 96 | 100 | 100 |
| Best practices | 100 | 100 | 100 |
| Performance | 82 | 85 | 84 |
| First contentful paint | 2.4 s | 1.7 s | 2.0 s |
| Largest contentful paint | 2.9 s | 4.3 s | 4.3 s |
| Layout shift | 0.001 | 0 | 0 |

The intermediate optimized WebP run scored 91 for performance; simulated LCP was 3.3s. The final AVIF run has smaller cover transfers but a slower simulated LCP. Do not claim a Core Web Vitals pass or a production speed improvement from these results. Local Python serving lacks GitHub Pages compression/cache behavior and the animated cover affects visual-completion measurements. Verify real mobile LCP/INP/CLS on the deployed domain and use field data when sufficient traffic exists. Ranking, indexing and rich-result appearance are not guaranteed by a Lighthouse score.

The raw reports are retained locally in `admin/artifacts/growth/seo-before.json`, `seo-after.json`, `seo-final-en.json` and `seo-final-es.json`; they are ignored, not published. Browser checks cover ten localized routes at 320/390/768/1440 pixels, font loading without Google font requests, AVIF selection, error-page recovery, hero motion/fallbacks and mocked form success/failure/consent. Seventeen committed tests include search metadata, schema facts, language pairs, sitemap URLs/images, source CSS parity and content preservation. CI installs development dependencies, runs checks/tests, regenerates and rejects stale committed output.

## Launch and ownership

1. Merge the reviewed release into `scalix09/whiteswan-website` `main`; the fork push alone does not update `staywhiteswan.com`. The live site observed during this audit still served the previous July HTML and a missing-page response for `/robots.txt`.
2. After Pages finishes, verify `/`, `/es/`, `/robots.txt`, `/sitemap.xml` and one intentionally missing URL. Confirm the new canonicals, headers, real 404 status and HTTPS redirects on the public domain. Keep CNAME, DNS and existing phone numbers unchanged.
3. In Google Search Console, create or use the URL-prefix property `https://staywhiteswan.com/`. Select HTML-tag verification and place only the supplied public token in `content/search-verification.json` under `google-site-verification`. Rebuild/publish, then click Verify. This avoids a DNS change. No token is prefilled or fabricated.
4. Submit `https://staywhiteswan.com/sitemap.xml`. Inspect the English and Spanish homepage, guide, photo and stay URLs. Request indexing of the main pages after the release; observe Google-selected canonicals and indexing reports rather than repeatedly resubmitting.
5. Validate the deployed structured data using Google's Rich Results Test / Schema Markup Validator. Valid schema does not by itself confer rich-result eligibility. Follow [Google's structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
6. Bing Webmaster Tools can use its public HTML verification token in `msvalidate.01`, then the same sitemap. This is optional and currently unconfigured.
7. Review search queries, impressions, clicks and landing pages by country/language once data arrives. Search Console does not require a GA4 tag. Coordinate the single approved GA4 property with the owner before adding analytics; do not double-tag.
8. Use actual guest questions and local expertise for future useful content. Reconfirm policies/prices before publishing changes. Do not create a Google Business Profile without separately checking vacation-rental eligibility.

No Search Console/Bing ownership, sitemap submission, DNS change or live deployment was performed by the code changes alone.
