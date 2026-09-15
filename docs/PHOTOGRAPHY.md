# Listing photography and design

## Source and review

On September 15, 2026, the current public Airbnb listing for `47911834` exposed 36 property photographs in its photo-tour data. The connected Hospitable property confirmed the cover photograph but exposed only one picture, so the complete collection was obtained from the live public listing rather than an older search-engine snapshot. The collection includes newer interior/bedroom/exterior photographs alongside retained older listing images; retrieval date is not a claim about when each photograph was taken.

`content/listing-photos.json` contains only public photo IDs/URLs, reviewed English/Spanish descriptions, categories and the retrieval date. Raw provider responses, credentials, reviews, guest details and access information are excluded. These are the owner's existing listing photographs, not generated property imagery. Existing service/destination images remain from the supplied website.

The image pass preserves photographed rooms and amenities. It normalizes orientation, strips metadata and creates local 480/960/1600/1920-pixel WebP renditions without upscaling or inventing visual content. No live Airbnb request occurs when a visitor loads the site. Responsive `srcset` descriptors use actual dimensions, images reserve layout space, below-fold images load lazily and the hero has high fetch priority. No autoplay video or carousel delays the opening view.

## Maintaining the collection

1. Retrieve the owner's current listing photo collection and review it privately. Do not copy whole provider payloads into this public repository.
2. Update only reviewed photo IDs, public image URLs, categories and bilingual alternative text in the manifest. Keep the retrieval date accurate.
3. Run `python3 scripts/prepare-listing-photos.py` explicitly with the dev requirements installed. Originals remain under ignored `artifacts/listing-originals/`; only the optimized assets are committed.
4. Regenerate pages with `python3 scripts/build.py`. Home/photo-tour rendering lives in `scripts/homepage.py`; the existing guest guide remains a separate source template.
5. Check categories, image crops and captions visually, then run static/browser checks. The import script prepares the manifest's existing collection; it does not automatically discover new photos.

The full-screen viewer supports buttons, arrow keys, Escape, mobile swipe, and native modal focus containment. The gallery remains a set of full-image links without JavaScript. English and Spanish photo-tour URLs have canonical/hreflang metadata and sitemap entries.

## Capacity discrepancy

The live public Airbnb listing reports 8 guests while the connected Hospitable property and existing house guide report 10. Owner confirmation is pending. The redesigned homepage shows verified room/bed/bath facts and directs visitors to Airbnb for current capacity and booking terms. It does not publish a new maximum occupancy claim. Existing operational guide content has not been silently changed.

## Publication

This work updates the existing public website PR. The upstream owner must merge it to update `staywhiteswan.com`; the active GitHub account has read-only upstream access. DNS, CNAME, WhatsApp numbers and the private app audience are unchanged. Form intake and analytics remain disabled pending public backend hosting, with contextual WhatsApp links available.

## Validation of this revision

Eight localized pages were checked at 320, 390, 768 and 1440 pixels. Browser checks cover mobile navigation, category filters, arrow-key navigation, Escape, a simulated touch swipe, full-size links without JavaScript, contextual WhatsApp fallback and no horizontal overflow. The retained form was separately tested with a mocked intake service for failed submission, retry, receipt and analytics consent. Static checks validate local assets, metadata, CNAME and JavaScript syntax.

The fully scrolled homepage transferred about 1 MB of image resources in a local desktop browser check, with no broken images. This is an observed asset-load measurement, not a field Core Web Vitals or Lighthouse score. Production performance and search results must be measured after the upstream release.
