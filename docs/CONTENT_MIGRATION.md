# Complete guest-content audit

Audited 18 September 2026 against the HTML downloaded directly from https://staywhiteswan.com/. All ten substantive source sections matched `content/guide.html.template` after whitespace normalization. The live snapshot is retained locally in ignored `artifacts/editorial/live-source-audit.html`; no private operations material was used.

The template is the retained bilingual content source. Its old page shell, styles and scripts are never rendered. `scripts/guestguide.py` publishes the complete handbook inside the shared site; `scripts/hospitality.py` brings practical details and every original FAQ onto the homepage.

| Original section | Content retained | Where guests find it now |
| --- | --- | --- |
| Arrival | Three-stage registration timeline, arrival instructions, welcome gift, early check-in options/prices, directions | Homepage Your stay and arrival FAQs; `/guide/#arrive` |
| Services | Chef, massage, airport transfer/driver, tours, celebrations, late checkout; original prices and notice periods | Three concise homepage cards with service-specific WhatsApp buttons; all original prices/notice periods at `/guide/#services` |
| Also available | Car rental, extra guests, complimentary housekeeping, crib | Homepage all-services link, FAQs, full services chapter |
| Villa | Bedroom/bathroom/capacity summary, interior and outdoor spaces | Homepage villa/spaces, 35-photo tour, `/guide/#villa` |
| House guide | All ten topics: pool, beach, AC, Wi-Fi, laundry, TV, water, BBQ/outdoors, housekeeping, help | Homepage combined stay/FAQ chapter and house-guide link; `/guide/#house` with individual topic anchors |
| Rules | All eight community essentials, including noise, capacity, visitors, smoking, pets, parking, damage reporting | Homepage Your stay, relevant FAQs, `/guide/#rules` |
| Checkout | Noon departure, five checklist items, late-checkout price/availability | Homepage Your stay and departure FAQs; `/guide/#checkout` |
| Explore | All six destinations, descriptions, travel estimates and activity information | Full destination cards on homepage and `/guide/#explore`, sharing one content source |
| FAQ | All six original questions and complete answers, plus twelve practical questions based on the retained guide and current request flow | Homepage `#faq`, linked in main/mobile navigation, page index and footer; original six also in `/guide/#faq` |
| Booking | A first or return stay and a path to the listing | Current on-site `/stay/` planning flow; `/guide/#book`; Airbnb remains an optional footer/booking link |
| Contact | Host and on-site numbers, response/urgent availability copy, optional Airbnb messaging | Shared WhatsApp concierge; `/guide/#contact` and footer link |

Spanish uses `/es/` and `/es/guia/` with matching anchors. Language switching retains homepage and guide sections. Legacy arrival/house/rules/checkout homepage anchors reach the equivalent integrated handbook in either language; `#faq`, `#book` and `#contact` work on the homepage. The guide’s ten house topics have stable anchors that open the appropriate native accordion with JavaScript; without it, guests can open the same visible summary themselves.

## Deliberate changes rather than omissions

- The original hero invitation is replaced by the new villa story.
- The old “200+ groups” promotional claim and static aggregate rating are not repeated; selected source-backed public guest reviews remain on the homepage.
- The old Airbnb-only booking/instant-confirmation copy is replaced by the truthful request flow. No online availability, payment or confirmation is claimed by the date-request form.
- Early/late checkout can be discussed through the shared WhatsApp concierge. All original price and availability conditions remain; optional Airbnb messaging is restored in the contact chapter.
- The rejected daybed photograph remains excluded; all property photographs use the curated enhancement registry. The generated service scenes are retired; section 03 uses existing villa photographs.
- Old emoji ornamentation and duplicate navigation are superseded by the new design. The underlying service and operational information remains.

This audit verifies migration completeness, not current operational policy. Existing owner-supplied prices, transit estimates, terms and instructions still need the normal owner review before a public release. No access credentials are published.

## Regression coverage

`tests/test_guestguide.py` checks retained paragraphs, rules, prices, lead times, checkout steps, every original FAQ on both homepages, shared destination parity, directions, both contacts, stable anchors and unique IDs. Browser QA covers EN/ES, 320–1440 px layouts, FAQ search/filter/empty states, keyboard interactions, section language links, topic deep links and no-JavaScript answers. Form receipt/failure and analytics-consent tests remain separate. Runtime search is local to the page: question searches are not sent to a server or analytics.

## Shorter homepage, 18 September 2026

Section 01 pairs the owner-selected covered dining terrace photograph (listing 2569998613) with the infinity pool and Pacific view. The separate day-at-the-villa panel was removed; the 35-photo tour retains every accepted listing image. Section 03 has three clear service cards (private chef, in-villa massage, celebrations), short descriptions, prominent service-specific WhatsApp buttons and existing villa photographs; its single all-services link preserves access to all original prices, notice periods and smaller extras. Section 04 combines the former coast introduction with all six discovery cards. Section 05 combines arrival, departure, quiet hours and the house guide with all 18 searchable FAQs. Both `#local-discoveries` and `#stay-details` remain valid. No original handbook content was removed.
