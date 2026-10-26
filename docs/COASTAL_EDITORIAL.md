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

## Coastal motion

27 October 2026

The opening now pairs a short title reveal with a photographic aperture that opens to the full cover. The El Salvador signature follows the title. A small sun travels along a dotted horizon in the photo controls; it becomes a moon when the evening photograph appears. The marker shows progress through the photo sequence.

Each photograph holds for 16 seconds, including the existing dissolve. Manual selection stops autoplay. Pausing, scrolling away, hiding the tab and leaving the page preserve the remaining hold. Keyboard focus also pauses the sequence. Reduced motion and data saving disable autoplay and the opening sequence; visitors can still choose either photograph.

The paired terrace and pool photographs have one coordinated entrance. The closing evening image has a short reveal. Other homepage sections remain still. All content is visible if JavaScript fails. An unavailable evening image leaves the daylight image and gallery link intact.

There is no new runtime dependency, scroll listener or per-frame JavaScript loop. The changes add about 1.6 KB compressed across the two scripts and stylesheet. The horizon moves through the Web Animations API; the image dissolve and slow zoom use the existing CSS animation.

Desktop English and 390px Spanish mobile were checked in Chrome. The photo controls have 44px touch targets. The page had no horizontal overflow or console errors. Both booking languages passed the local consent, failure and retry checks using synthetic responses. All 16 Python and 20 Node tests passed, including five new photo-clock tests. The design checker reported only the two previously documented warnings.

## Mobile refinement

27 October 2026

The phone layout has a shorter masthead, a taller villa photograph and larger photo controls. Dates and concierge help remain available in a bottom bar with safe-area padding. The concierge opens above that bar in a scrollable panel. Services use compact rows with a photograph beside each description.

The mobile menu fills the available screen and locks background scrolling. It keeps keyboard focus inside the navigation and returns focus to the menu button on Escape. Background elements regain their previous interaction state when the menu closes.

Room photographs use native horizontal scrolling with a visible next card, previous/next controls and a position count. IntersectionObserver keeps the count in step with scrolling. Reduced-motion preferences disable smooth scrolling for the buttons. Without JavaScript, the photographs and links remain available. Corrected image sizes avoid downloading desktop-sized photographs for phone cards.

The changes are in `assets/mobile-public.css`, `assets/gallery.js` and the public page generators. There are no new dependencies or per-frame JavaScript loops. The booking page has wider usable calendar space and 16px form fields to avoid input zoom on iPhones.

Chrome checks covered 320px and 390px portrait layouts, 844px landscape navigation and the desktop layout. Menu focus, dismissal, room controls, concierge bounds and FAQ filtering passed. There was no horizontal page overflow. English and Spanish booking forms passed consent, simulated failure and retry checks. No live enquiry was sent. All 36 existing tests passed. Physical iPhone and Safari checks remain outstanding.

The design checker flagged the existing photo-viewer image with no initial source. The viewer assigns that source when opened; this warning is unchanged. New interface labels passed the humaniser checker with no hard or soft findings.

The hosted check found that rotating the viewport during image loading could interrupt decoding and permanently hide the day/night controls. The photo loader now waits for the replacement image. A regression test covers both an already-loaded replacement and one still loading; all 37 tests pass.
