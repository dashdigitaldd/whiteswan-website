# Private guest companion

The companion at `/guest/` is a mobile-first White Swan guide, separate from the marketing website and booking planner. Its five destinations are Your stay, The house, Experiences, Explore and Help. English and Spanish are complete alternatives, with a remembered language choice and El Salvador stay times.

## Host workflow

1. In the admin, open Guests and select the customer and intended stay.
2. Choose Guest link, then Create private link.
3. Copy the link shown once and share it privately with that stay's guest. The app does not send it automatically.
4. To replace or stop access, return to Guest link. Replacing a link immediately revokes previous active links for the stay. Revocation also has a separate confirmation.

The link expires 24 hours after the recorded checkout, with a maximum lifetime of 366 days. Cancelled bookings are denied once the saved booking sync reflects cancellation. Stale or unhealthy booking evidence cannot unlock the page. A changed earlier checkout shortens access; extending a stay does not silently extend an old token.

Anyone given the private link can use it, so hosts and guests should share it only with that travel group. This is a scoped capability link, not a guest identity verification service. No link is placed in the sitemap, analytics or public navigation.

## Guest experience

- Personalised first name, arrival/departure, known stay times and guest count. Missing details stay unknown.
- Arrival directions and searchable house instructions, including pool, beach, kitchen, water, parking and house rules.
- Service enquiries for chef, massage, transport, tours, car rental and celebrations. These open a prepared WhatsApp message to the existing host line. A click never confirms availability, an order, a price or payment.
- Local places, maps and everyday essentials from the reviewed guide.
- Host contact, FAQs and a departure checklist. Checklist ticks stay on the screen and do not tell the host that the guest has left.

Door, Wi-Fi and safe credentials are deliberately absent. The guide directs guests to their existing Airbnb arrival message, sent three days before arrival. It accepts no identity uploads and includes no private guest history, contact details, internal notes or payment records.

The experience is an online web app. It does not claim offline availability, installed-app behavior, automatic messaging or an AI conversation. Private state is not cached by a service worker.

## Content and maintenance

`content/guest-companion.json` is a curated, versioned, public-safe bilingual projection. See [content audit and provenance](GUEST_COMPANION_CONTENT.md). It is not a raw export of the operational knowledge base. Disputed historical prices, exceptions, capacity claims and private staff contacts are excluded. Routine updates require editing both languages, reviewing current property truth and redeploying the website. A future publishing workflow can project only approved guest-facing knowledge versions into this format.

`assets/companion.js`, `assets/companion.css` and `guest/index.html` implement the dependency-free browser experience. The logo and photographs reuse existing approved assets. Self-hosted Dubai fonts match the admin identity. The existing marketing generator does not overwrite this standalone page.

The [guest surface brief](../.impeccable/surfaces/guest-index-html.md) records its visual and interaction boundaries. Companion changes preserve the separate marketing site's existing typography, composition and stylesheet bundle.

## Private data boundary

The link carries a random token in its URL fragment. The browser removes the fragment and retains the capability in session storage for that tab. It posts only the token to the same-origin `/api/guest-companion` facade. The facade validates origin, method, content type, shape and size, then calls the private service binding. It never forwards arbitrary admin endpoints or exposes credentials.

The private service stores only a SHA-256 token hash and returns a strict minimal stay projection from the fixed property scope. Unknown, revoked and expired links have the same unavailable response. The browser rechecks on return to a visible tab and periodically while open; a rejected or unavailable check hides the private view. This is bounded refresh, not instant revocation of a screen already open.

The guest shell and private responses use no-store, no-referrer and noindex. The shell restricts scripts, fonts, images and connections to its own origin. Public house content and existing villa photos remain public-safe assets. No external analytics, fonts, provider or model calls are made by the companion.

## Preview and validation

`/guest/?preview=1` is a clearly labelled sample stay with synthetic dates and counts, no real guest identity and no backend request. A static local preview works with `python3 -m http.server 8122 --bind 127.0.0.1`. Actual private links require the Cloudflare proxy and service binding.

Run:

```sh
python3 scripts/check.py
python3 -m unittest discover -s tests
node --test tests/calendar.test.cjs tests/guest-companion.test.mjs
python3 scripts/prepare-staging.py
```

The release was checked on desktop, 390px and 320px phone viewports, including EN/ES switching, search, topic sheets, image loading and horizontal overflow. Synthetic backend tests cover link creation, rotation, revocation, expiry, cancellation, cross-stay isolation and stale reads. No real guest or supplier message is part of validation. See [Cloudflare deployment](CLOUDFLARE_STAGING.md) for release ordering.

## Hosted release, October 23, 2026

The companion is live on the independent [Cloudflare preview](https://white-swan-website-staging.dashdigitaldd.workers.dev/guest/?preview=1), website version `aeb76ca4-fa57-4260-8bf5-1e6f2d29cfd1`. The private service and admin controls are deployed alongside additive migration 0018. Hosted checks confirmed the guide's restrictive privacy headers and the actual service binding's generic rejection of a synthetic invalid token. The browser loaded the sample app without console errors, broken photographs or horizontal overflow.

Previous website version: `eaeda2e0-21ae-4d37-81ca-204db6847b58`. Coordinate rollback with the admin controls. The custom-domain GitHub Pages site, CNAME and DNS were not changed; actual private links must use the Cloudflare origin until a future domain cutover is explicitly completed.
