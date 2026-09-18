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

The live public Airbnb listing reports 8 guests while the connected Hospitable property and existing house guide report 10. Owner confirmation is pending. The redesigned homepage shows verified room/bed/bath facts; the stay-request page asks the host to confirm group capacity and booking terms. It does not publish a new maximum occupancy claim. Existing operational guide content has not been silently changed.

## Publication

This work updates the existing public website PR. The upstream owner must merge it to update `staywhiteswan.com`; the active GitHub account has read-only upstream access. DNS, CNAME, WhatsApp numbers and the private app audience are unchanged. Form intake and analytics remain disabled pending public backend hosting, with contextual WhatsApp links available.

## Validation of this revision

Ten localized pages were checked at 320, 390, 768 and 1440 pixels. Browser checks cover mobile navigation, category filters, arrow-key navigation, Escape, a simulated touch swipe, full-size links without JavaScript, contextual WhatsApp fallback and no horizontal overflow. The retained form was separately tested with a mocked intake service for failed submission, retry, receipt and analytics consent. Static checks validate local assets, metadata, CNAME and JavaScript syntax.

The fully scrolled homepage transferred about 1 MB of image resources in a local desktop browser check, with no broken images. This is an observed asset-load measurement, not a field Core Web Vitals or Lighthouse score. Production performance and search results must be measured after the upstream release.

## Curated homepage sequence

The current art direction chooses photos for what each section needs to communicate, rather than repeating generic room views. Only existing, real property photography is used; no content is generated or removed from the photographs.

| Section | Selected photograph | Reason |
|---|---|---|
| Opening | Listing 2569961419, sunlit house, pool and palms | Makes the house the first impression. Copy sits beside the photograph on desktop; the full 3:2 image leads on mobile. |
| Villa introduction | Listing 2569961540, elevated exterior; 2569999123, poolside daybed inset | Shows the house, garden and pool as one property, with a closer relaxation detail. The main frame stays wide enough to show the architecture. |
| Bedroom | Listing 2580025730, bed facing the ocean | Makes the bedroom's view tangible and shows the bed, rather than leading with the sitting area. |
| Shared spaces | Listing 2569987642, living room; 2569961410, dining | Gives each card a different purpose: rest, gathering and meals. |
| A day at White Swan | Listing 1852230521 at first light; 2569998613, terrace; 1685140634 at dusk | A user-controlled, bilingual three-scene sequence. No autoplay, invented itinerary or time-specific service promise. Tabs support arrow keys, Home/End and native focus. |
| Experiences | Existing chef table, poolside massage/daybed setting and celebration place setting | Keeps service imagery relevant to the actual house without implying that a pictured meal or decoration is included. |
| Coast | Listing 1852230572, the beach below Xanadu | Shows the property's actual coastal setting instead of a generic destination image. The access-route FAQ remains visible. |
| Closing | Existing `transfer` aerial photograph of the illuminated house | Shows the whole private retreat at night. This file is house photography despite its legacy service-based filename. |

Homepage/social preview imagery follows the house-and-pool opening. The full 36-photo tour remains available, reordered to lead with the strongest views. Gallery completeness and homepage curation are intentionally separate. Desktop/mobile image crops are layout choices; they do not modify the original image content.

## House-first resort revision — September 16, 2026

The owner requested that the first impression show the architecture as well as the pool. The opening now uses listing photo **2569961419**: the sunlit house, private pool and palms. The previous ocean-only hero is retained in the gallery. A sand-toned copy panel sits beside the photograph on desktop; on mobile the complete 3:2 photograph appears first, followed by the copy. No headline covers the house. The social preview uses the same house photograph.

The visual direction uses restrained serif type, ivory/sand surfaces, pine buttons, fine bronze rules and natural property photography. It takes cues from luxury coastal hospitality without borrowing hotel branding or suggesting affiliation, resort staffing or unverified amenities.

## Editorial enhancement — September 18, 2026

The homepage now uses an owner-authorized editorial treatment of the house-and-pool photograph. The original photo tour and source image are unchanged. A visible caption identifies the enhanced opening photograph and links to the original gallery. The first generated treatment was discarded in favor of a subtler second version. As a generative edit it is not pixel-identical to the source; see `EDITORIAL_RETOUCH.md` for the exact prompt, asset paths and limitations. New CSS presentation and a bronze swan emblem complete the visual treatment.
