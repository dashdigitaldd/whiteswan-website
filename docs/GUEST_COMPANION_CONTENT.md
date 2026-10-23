# Guest companion content

Restored on 23 October 2026 from the owner's complete [White Swan Canva welcome book](https://whiteswan.my.canva.site/). The source has 18 pages. This release restores its welcome, home story, exact restaurant selection, original photographs, venue links and phones, local outings, guide prices, contacts, review explanation and thank-you. The guest companion is the only presentation changed. The admin application and its supplier or knowledge records are not changed by this content update.

## Source and privacy

[guest-companion.json](../content/guest-companion.json) contains bilingual guest guide content, published business/emergency contacts and original public source links. It must not contain guest data, credentials, personal host phone numbers or access tokens.

The owner explicitly requested Wi-Fi and the hosts' contact information inside the private guide. That request changes the previous decision to omit them from this guest experience. The network, password and personal host contacts are private runtime configuration, returned only after the existing private stay link is validated. They are not committed, bundled into JavaScript, included in public preview data, or sent to a third-party QR generator. No door or safe codes are added.

The source browser extraction and private configuration are working files outside this public repository. Do not commit them or place them in the static artifact.

## Schema and rendering

All authored text uses separate `en` and `es` fields. Render only the chosen language. Spanish uses clear, respectful Salvadoran wording with `usted`. Times are in `America/El_Salvador`. No em dashes are used.

- `sourceGuide`: provenance, original URL, page count and restoration date.
- `welcome`: personal welcome from Wendy and Sergio, subtitle, body, signature and original exterior photo. Use in the first-visit welcome and a reopenable welcome card.
- `aboutHome`: shortened but complete home and Tamanique introduction, four key facts, original living/dining and kitchen photos. `body.en` and `.es` are paragraph arrays; `images` has `src` and bilingual `alt`.
- `hostProfiles`: Wendy and Sergio's names and brief roles. Phone and WhatsApp destinations come only from protected runtime configuration.
- `arrival`: full address, original Google Maps link, standard check-in/out times, arrival steps and links. Stay-specific confirmed times take precedence.
- `houseTopics`: practical house instructions. Topics keep source facts and material guide fees visible, labelled as source guide details where confirmation is needed. `links` is optional.
- `faqs`: practical arrival, access, service and house questions. The Wi-Fi answer now points to the private guide; the door code continues through Airbnb.
- `checkout`: visible, local-only departure checklist. Checking it does not notify a host or establish checkout.
- `experiences`: the original four services, each with `priceLabel`, description, original source image and request action. The professional chef has four `menuChoices`. `menus` is an optional array of verified downloadable menus; an empty array must not render an unavailable document as if it existed.
- `transportRates`: six original transport/activity rows with title, description, group size, source price, original schedule and source page. `transportNote` preserves admission exclusions and payment arrangements.
- `restaurants`: seven original venues. Each has the source title, description, original photo, phone, address, distance, and `links` containing bilingual label and URL. Supplemental menus, when independently found on a venue's own website, use separate labelled links with provenance.
- `places`: the original eight outings, all with the source photograph, description and original recommendation link. Do not label an article, booking page or official venue website as a map. `mapUrl` is retained for old-renderer compatibility and may be a source article URL; render `links` in the new interface.
- `moreIdeas`: now empty because all original outings are complete cards.
- `essentialsNearby`: original fuel, supermarket, ATMs and fast-food mall recommendations and exact links.
- `contacts`: emergency, hospital, pharmacy and original non-urgent police entry. `phone`, `address`, `mapUrl`, `hours`, `links` and `verificationNote` are optional. The emergency path must remain prominent.
- `review`: a guest rating explanation presented as the hosts' perspective, not official Airbnb policy. It includes five rating descriptions and an invitation to honest feedback.
- `thankYou`: complete warm closing from Wendy and Sergio, original villa/pool photo, invitation to share a review and a return visit.
- `contentNotice`: source prices and recommendations are the welcome book's content. Confirmed booking arrangements take priority.

## Complete source coverage

| Source page | Source content | Companion placement |
| --- | --- | --- |
| 1 | White Swan cover and welcome | App brand, welcome experience |
| 2 | Contents | Five-tab navigation, house search and section entry points |
| 3 | Personal welcome, Wendy and Sergio | `welcome`, original exterior photograph |
| 4 | Home description, four bedrooms, 3.5 bathrooms, workspace, Tamanique and El Tunco story | `aboutHome`, original kitchen and living/dining photographs |
| 5 | Wi-Fi network and password | Protected private Wi-Fi view with locally rendered QR; no values in public content |
| 6 | Address, host contacts, emergency, hospital, pharmacy | `arrival`, `hostProfiles`, `contacts`, protected host phone configuration |
| 7 | 4 PM check-in, noon checkout, keyless-entry note, departure checklist | `arrival`, `checkout` |
| 8 | Quiet hours 10 PM to 8 AM, registration, no visitors, no parties, outdoor smoking, pets and $30 guide fee | House rules topic and relevant FAQs |
| 9 | 2 to 3 cars, possible $30/day street-parking fee, transport assistance, AC, Monday/Thursday trash pickup, first aid and outdoor video-only camera | House topics |
| 10 | Texaco, Super Selectos El Encuentro, El Tunco ATMs, El Encuentro fast food | Four nearby essentials with exact source links |
| 11 | Ola Beto's, Olor de Mar, Vikingos | Three full restaurant cards with original photos, distances, phones, addresses and source venue links |
| 12 | Captain Cook, Pelicanos, Beach Breakers, Coyote | Four full restaurant cards with original photos, distances, phones, addresses and source venue links |
| 13 | El Tunco, Tamanique Waterfalls, Sunset Park, Coatepeque/Santa Ana | Four full outing cards with original images and recommendation URLs |
| 14 | Ruta de las Flores/Ataco, Nawi, San Salvador/La Doña, coffee tour | Four full outing cards with original images and recommendation URLs |
| 15 | Airport, volcano/lake, Café Albania/hot springs, surf, waterfalls, Mayan ruins transport table | Six `transportRates` rows retaining source pricing and schedule qualifications |
| 16 | Breakfast, massage, airport transfer, six-course chef dinner and menu types | Four `experiences` cards with source prices and original photographs |
| 17 | Review rating explanation | `review`, preserving host perspective without misstating platform rules |
| 18 | Thank-you, feedback, review invitation, host signature | `thankYou`, original photograph |

## Prices and ambiguities retained visibly

The user specifically requested the source prices. They are restored as prices printed in the original guide, not a confirmed supplier quote or inventory reservation:

- Breakfast: $10 per plate, minimum 10 plates.
- Massage: 30 minutes $25, 60 minutes $35, 90 minutes $65.
- Airport transfer: $50 one way, $100 round trip, consistent across source pages 15 and 16.
- Six-course professional chef dinner: $50 per person. Source choices are seafood, Mexican, Salvadoran and BBQ.
- Volcano/Coatepeque: $80 per person; Café Albania/hot springs: $80; surf: $40; Tamanique Waterfalls: $35; Mayan ruins: $60. Transport table lists groups of 4 to 8 and excludes admission fees.
- Pets: $30 guide fee. Street parking may have a $30/day community charge.

The volcano row prints a 6:00 AM departure and 2:00 AM return. The waterfall and Mayan rows omit AM/PM. These ambiguities are explicitly flagged for host confirmation rather than silently changed. Current availability, payment method and the final quote are confirmed with Wendy, Sergio or the provider before booking.

The original Uber availability claim is retained as an option from the guide with an instruction to check the app. Pharmacy hours and driving estimates are source estimates, not a live promise.

## Corrections and boundaries

1. **Hospital identity:** the original text calls the hospital “Hospital Nacional de La Libertad”, but its phone and address correspond to **Hospital Nacional San Rafael in Santa Tecla**. The [Ministry of Health directory](https://www.salud.gob.sv/directorio/) confirms the name, +503 2594-4000 and 4ª Calle Oriente No. 9-2. The guide retains the original phone and address with the corrected name. A map search is explicitly generated for this corrected hospital because the original provided no hospital map link.
2. **Emergency:** [PNC's official 911 page](https://www.pnc.gob.sv/servicios/sistema-911/) confirms 911 is a free, 24-hour emergency contact. The separate non-urgent police number is retained as an unverified original-guide entry and never substitutes for 911.
3. **Restaurant template URLs:** several source address text boxes link to `jessiessupperclub.com`, unrelated to the named Salvadoran venue. Those are identified as leftover Canva template links and not presented as restaurant menus. The actual venue links are retained exactly.
4. **Menus:** the 18-page source has no downloadable chef menu or restaurant menu document. It names four chef menu styles and includes restaurant website/social links. Show these clearly and offer to request the current chef menu. Do not invent a menu PDF, dishes, a price or a restaurant URL. Verified supplemental menus are now included for Pelicanos (food and drinks, linked from its official website) and Beach Break (a nine-page PDF linked from its official dining page). These are labelled with verification provenance and date, not claimed to have appeared in the Canva source.
5. **Review explanation:** the source's unsupported assertion that every vacation-rental platform treats any score below 4.6 as a negative review is not presented as fact. The hosts' five-level explanation and five-star invitation remain, with honest feedback welcomed. The lowest-rating joke is rewritten respectfully. No review is conditional on contacting the host first.
6. **Guest privacy:** no private host phone, Wi-Fi value, guest identity, ID image, guest chat or booking data is present in this JSON.

## Original photographs

[guest-guide-assets.json](../content/guest-guide-assets.json) maps each source photograph to `/assets/guest-guide-source/`. These are the originals from the supplied Canva book, only resized/compressed for delivery. No generated replacement restaurants, massage setups, chef teams or sightseeing photographs are used in this guide restoration. Asset IDs `home-ocean` and `home-villa` are historical filenames; their alt text correctly identifies the kitchen and living/dining room respectively.

## Delivery boundaries

The content source is deliberately guest-facing and public-safe. Personal stay data, Wi-Fi and private host contacts require the server-validated private link. Public preview remains synthetic. Private responses and tokens must remain out of service-worker caches, analytics, query strings and third-party QR services.

This update does not change the admin app, supplier operations, public homepage generator, CNAME, DNS or the established public WhatsApp number. Selecting a service opens an enquiry; it does not send a message, charge a guest or confirm a supplier booking.
