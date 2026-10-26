# Public site editorial refinement

26 October 2026

The public website uses a larger photographic cover and a quieter page structure. The reference was ERA Residence, https://www.era-residence.com/, particularly its condensed serif headings, script location name and architectural photography.

## Type and photography

Instrument Serif is the public display face. Pinyon Script appears only in the El Salvador signature. Both are self-hosted under the SIL Open Font License; the license files and download sources are in `assets/fonts/`. Inter remains the body and form font. No ERA font files or photographs were copied.

The cover retains the existing daylight and evening photographs, manual day/night controls, pause control, reduced-motion handling and low-data behavior. The hero preload and image sizes now agree on the full-width cover. The existing White Swan logo, photo sources and excluded-image rules remain in effect.

## Scope

The homepage has a new masthead, wider cover, date-search presentation, paired villa photographs and lighter service panels. Shared typography and header adjustments carry through the public photo tour, booking, handbook and privacy pages. Every original destination and FAQ remains available. English and Spanish use the same renderer.

Booking still uses the existing availability and stay-request flow. Rates, fees, tax treatment and confirmation language are unchanged. The admin, private guest companion, WhatsApp destinations, DNS and CNAME are unchanged.

Source styling is in `assets/brand.css` and `assets/residence.css`. The latter is scoped to the homepage, apart from its new cover components. Regenerate HTML and the versioned CSS bundle with `scripts/build.py`.

## Validation

- Public route, metadata, local asset and excluded-photo checks passed.
- All 16 Python tests and 15 Node tests passed.
- English desktop and Spanish 390px mobile layout reviewed in Chrome. Mobile menu and manual photo controls worked without horizontal page overflow.
- Both booking languages were exercised with synthetic local responses. Required contact consent prevented submission; the first simulated server failure retained the details; retry displayed a receipt and the existing unconfirmed-reservation notice. No live enquiry was sent.
- The design checker reported two warnings: the retained Inter body font and the existing gallery dialog image whose source is assigned when opened. These are intentional and were not changed.
- New English and Spanish copy passed the humaniser checker with no hard findings.

The deployment target is `white-swan-website-staging`. The custom-domain GitHub Pages release remains a separate review step on the protected main branch.
