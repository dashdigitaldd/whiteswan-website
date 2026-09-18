# White Swan photography

## Sources and treatment

The current public Airbnb listing (`47911834`) supplied 36 property photographs on September 15, 2026. Hospitable confirmed the cover photograph but exposed only one picture, so the complete set came from the public listing. The retrieval date is not a claim about when the photos were taken. Public source IDs, URLs and bilingual descriptions are recorded in `content/listing-photos.json`.

At the owner's request, the website now presents a consistent editorial treatment across **45 distinct photographs**: 35 listing images and 10 existing service/detail/destination images from the supplied website. The poolside daybed photograph **2569999123 is excluded**. Legacy `daybed`, `massage` and `early` photographs are replaced with appropriate terrace, bedroom and first-light views.

These are owner-authorized generative edits of existing photographs. They retain the recognizable property, rooms and amenities, but fine details and lighting may be re-rendered; do not call them untouched originals or pixel-exact color corrections. The homepage and gallery identify editorial photography. Full edit prompts and limitations are in [EDITORIAL_RETOUCH.md](EDITORIAL_RETOUCH.md).

## Selection

| Section | Photograph | Purpose |
|---|---|---|
| Opening, booking and social preview | 2569961419, sunlit house and private pool | Architecture is the first impression. |
| 01 — This is White Swan | 2569961540, elevated exterior; 2580025730, ocean-view bedroom inset | Connect the whole property with the experience of waking to the Pacific. |
| Bedrooms and shared spaces | 2580025730, 2569987642, 2569961410 | A distinct view of sleeping, relaxing and dining. |
| A day at White Swan | 1852230521, 2569998613, 1685140634 | First light, terrace lunch, illuminated house after sunset. |
| Experiences | Chef table, ocean-view bedroom 2569961498, celebration place setting | Real settings; no staged massage or included-service implication. |
| Coast | 1852230572 | The actual beach below Xanadu. |
| Closing | Existing `transfer` aerial photograph | Whole-property view after dusk; the legacy filename describes no vehicle. |
| Guest guide | Shared edited listing assets plus ten existing guide photos | Same finish throughout, including destination cards. |

## Rendering and maintenance

- `scripts/photography.py` is the shared selection and rendering layer. Its exclusion guard refuses the rejected listing photo; gallery order contains 35 images and starts with the house.
- `content/editorial-assets.json` records each selected source, description, method, actual dimensions and responsive asset URLs. It contains no credentials or guest records.
- Final files are under `assets/enhanced/`, plus the previously selected `assets/editorial/villa-light-*.webp` hero. Generation masters and local batch output mappings remain under ignored `artifacts/editorial/`.
- `scripts/prepare-editorial.py` only resizes/compresses selected image-tool outputs. It does not creatively alter the photos. Re-running a normal page build uses committed assets and requires no model API or live Airbnb requests.
- To replace an edit, save a reviewed master, regenerate its responsive variants and update the registry. Preserve original sources and review room layout, object placement, crops and captions before publication.
- Run `python3 scripts/build.py` with development dependencies, then `python3 scripts/check.py` and browser checks in both languages. The checker audits every rendered photo, responsive source and viewer link against the curated registry and rejects old daybed references.

The gallery supports filters, keyboard navigation, Escape, mobile swipe and full-image links without JavaScript. Responsive images reserve space, use real width descriptors and load lazily below the fold. The opening image receives high fetch priority. No autoplay media delays the first view.

## Operational boundaries

The Airbnb listing reports 8 guests while the existing operational sources report 10. The website continues to ask the host to confirm group capacity; this visual pass does not introduce a new occupancy claim. Booking requests and WhatsApp links remain unchanged.

The upstream owner must merge the website PR to update `staywhiteswan.com`; the current GitHub account has read-only upstream access. DNS, CNAME and WhatsApp numbers are unchanged. Local checks do not constitute production performance or search-ranking results.
