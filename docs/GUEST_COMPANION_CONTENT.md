# Guest companion content

Curated on 23 October 2026 for the private-link White Swan guest companion. The content source is [guest-companion.json](../content/guest-companion.json). It contains only guest-safe property information, bilingual editorial copy and references to existing public photographs. It contains no reservation data, guest identity, access credentials, internal contacts, supplier prices or private operating instructions.

## Source and authority

The owner supplied [the Canva welcome book](https://whiteswan.my.canva.site/). All 18 pages were inspected in the browser on 23 October 2026. The inspection text is a private working artifact and is not committed, because the source includes credentials and older contact details.

Additional sources are the existing [bilingual handbook template](../content/guide.html.template), [shared guest details](../scripts/hospitality.py), [content migration record](CONTENT_MIGRATION.md) and the admin project's operations reconciliation and knowledge seed. The admin material was consulted to identify contradictions, not copied into the public repository.

This JSON is a curated guide, not proof that an operational fact was recently verified. A booking-specific arrangement confirmed by the host takes priority. If the private guest API supplies current published guest knowledge, its eligibility, audience and property scope must be checked server-side. Never expose host-only policies, draft articles or learning candidates simply because they discuss the same topic.

## Schema

- `version`, `updatedAt`, `propertyName`, `timeZone`: content identity and property-local time zone.
- `welcome`: bilingual title, body and host signature, plus one existing property image.
- `arrival`: title, introduction, public directions URL and address, standard times, and three bilingual preparation steps.
- `houseTopics`: up to twelve records with `id`, `icon`, bilingual `title` and `summary`, paragraph arrays in `body.en` and `body.es`, and a suggested action (`host` or `airbnb`). Icon names are presentation hints; unknown icons must fall back gracefully.
- `faqs`: records with `id`, bilingual `question` and `answer`.
- `checkout`: short checklist records with `id`, `en` and `es`.
- `experiences`: six service introductions with bilingual title/description, existing image URL, `service` topic and action label. These are request topics, not supplier availability or accepted orders.
- `serviceNote`: describes direct provider introductions and optional host coordination.
- `places`: six main destination cards with bilingual title/description, existing image and map-search link.
- `moreIdeas`: four additional outings from the Canva source, without current prices or availability promises.
- `essentialsNearby`: grocery, ATM and fuel references. The two shortened Maps links are retained from the inspected Canva source. The fuel link is an explicitly generic Maps search.
- `help`: bilingual assistance, escalation and neutral feedback copy.
- `contentNotice`: explains the priority of the booking and confirmed host arrangements.

The locale fields are separate. Show one selected language, not both languages concatenated. Preserve the guest's selection independently from the admin language. The Spanish uses clear, respectful Salvadoran phrasing with `usted`.

## Coverage and provenance

| Companion area | Source | Editorial treatment |
| --- | --- | --- |
| Welcome and house introduction | Canva pages 3 and 4 | Short welcome; removed broad superlatives and unsupported claims. |
| Arrival and departure time | Canva page 7; handbook arrival and checkout | Standard 4 PM / noon, always El Salvador time. Booking-specific confirmation can override. |
| Registration and directions | Handbook arrival; verified public directions link | Ask guests to confirm their group and vehicles. No ID upload form or promise that registration is already complete. |
| Pool and beach | Handbook house topics | Retained private, unheated pool and downhill beach route with steps. Removed pump-room operation instructions, fixed walking estimates and unverified facility-access promises. |
| AC and parking | Canva page 9; handbook | Retained bedroom remotes and living-room units. Parking capacity, extra-car charges and transport availability require host confirmation. |
| Kitchen, BBQ, water and laundry | Handbook house topics | Retained physical locations and practical help. Laundry entitlement, minimum stay and private access instructions are not published. |
| TV | Handbook house topics | Retained TV availability. Do not promise active subscriptions, sporting rights or current app behavior. |
| Trash and property visits | Canva page 9; handbook | Retained bin location and host coordination. Removed fixed pickup and included-cleaning schedules. |
| House rules | Canva page 8; handbook; operations conflict check | Quiet hours start at 10 PM. No parties, loud music, daily visitors or indoor smoking. Do not infer a verified quiet-hour end, fee schedule or occupancy exception. |
| First aid and outdoor camera | Canva page 9 | Retained kitchen drawer location and video-only outdoor parking camera disclosure. This is not a substitute for the booking channel's required camera disclosure. |
| Departure checklist | Canva page 7; handbook; operations checkout article | Retained AC/lights, towels, trash, belongings and departure message; no bed stripping or dishwashing. |
| Services | Canva pages 15 and 16; handbook; owner-supplied vendor workflow | Broad service offerings only. Direct provider introduction is the default; host coordination is available on request. |
| Local places | Canva pages 10 to 14; handbook exploration | Retained names and concise descriptions. Current hours, prices, travel times and dietary suitability are not guaranteed. |
| Feedback | Canva page 18 | Replaced rating pressure with a neutral invitation to share feedback. |

## Intentionally excluded

- All door, Wi-Fi, laundry and safe credentials. The app points to the private Airbnb arrival message. Even a private URL is not an exception to the owner's Airbnb-only credential rule.
- The Canva page containing Wi-Fi credentials, older private phone numbers, emergency-directory numbers and copied hospital addresses. Contact routing comes from approved application configuration, not this content file.
- Fixed chef, transport, massage, rental, pet, parking or additional-guest prices. The source documents conflict or require supplier confirmation; this guide is not a quote.
- Guaranteed early arrival, prior-night fixed-price offers, automatic late checkout and unsupported infant exemptions.
- Automatic identity-photo collection, unconfirmed welcome gifts, included housekeeping entitlements and laundry minimum-stay promises.
- Unverified breaker-panel locations, electrical repair procedures, appliance manuals, safety certifications and step-free accessibility claims. Ask the host about a specific need.
- Five-star review requests, inaccurate rating-scale claims and requests to withhold negative feedback.
- Legacy irrelevant restaurant links: some Canva address blocks linked to an unrelated restaurant domain. Those were not reused.

## Images and delivery

Images reference the existing editorial asset registry and accepted property photographs. Service images show the villa or an outing; they do not depict a specific supplier, invent equipment or claim to show an actual treatment. The rejected poolside daybed and retired generated service imagery remain excluded.

The file is safe as public source, but it does not make a guest experience private. Stay data and access to a private companion must be protected by the guest-link service. Do not store private responses or link tokens in a service-worker cache, analytics events or third-party URLs. The content itself performs no external runtime calls; the guest chooses whether to follow directions or contact links.

Changing this JSON does not regenerate the existing public homepage or handbook. They still use their existing generator and content source. Any reconciliation of that older public guide is a separate change and must retain its own validation.
