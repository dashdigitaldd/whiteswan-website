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
- The original four service enquiries: breakfast, massage, airport transport and a professional chef, plus six transport/activity rate options. These open a prepared WhatsApp message to the existing host line. A click never confirms availability, an order, a price or payment.
- Seven original restaurants with venue contacts and three verified menu links, eight original outings, and four everyday essentials. Original Canva photographs and the hosts’ welcome, home story, review explanation and thank-you are restored.
- Host contact, FAQs and a departure checklist. Checklist ticks stay on the screen and do not tell the host that the guest has left.

At the owner's request, Wi-Fi connection details and a locally generated Wi-Fi QR can now be shown after a valid private stay link is verified. They are never included in the sample preview, static content or source repository. Door and safe codes remain in the existing Airbnb arrival message. The guide accepts no identity uploads and includes no private guest history, guest contact details, internal notes or payment records.

The experience is an online web app. It does not claim offline availability, installed-app behavior, automatic messaging or an AI conversation. Private state is not cached by a service worker.

## Content and maintenance

`content/guest-companion.json` is a curated, versioned, public-safe bilingual projection. See [content audit and provenance](GUEST_COMPANION_CONTENT.md). It is not a raw export of the operational knowledge base. Private Wi-Fi details and host contacts come from the separate protected payload described below. Routine public-content updates require editing both languages, reviewing current property truth and redeploying the website. A future publishing workflow can project only approved guest-facing knowledge versions into this format.

`assets/companion.js`, `assets/companion.css` and `guest/index.html` implement the browser experience without a build-time framework. A pinned, self-hosted MIT-licensed QR encoder supplies local Wi-Fi QR generation. The logo retains its established artwork, and the restored guide uses 23 original Canva photographs. Self-hosted Dubai fonts match the admin identity. The existing marketing generator does not overwrite this standalone page.

The [guest surface brief](../.impeccable/surfaces/guest-index-html.md) records its visual and interaction boundaries. Companion changes preserve the separate marketing site's existing typography, composition and stylesheet bundle.

## Private data boundary

The link carries a random token in its URL fragment. The browser removes the fragment and retains the capability in session storage for that tab. It posts only the token to the same-origin `/api/guest-companion` facade. The facade validates origin, method, content type, shape and size, then calls the private service binding. It never forwards arbitrary admin endpoints or exposes credentials.

The private service stores only a SHA-256 token hash and returns a strict minimal stay projection from the fixed property scope. The website validates the complete returned stay shape, limits the response to 16 KiB and constructs a fresh allowlisted response. Unknown service fields never pass through. Only this verified response may receive the private guide projection. Unknown, revoked and expired links have the same unavailable response, with no guide details. The browser rechecks on return to a visible tab and periodically while open; a rejected or unavailable check hides the private view. This is bounded refresh, not instant revocation of a screen already open.

The guest shell and private responses use no-store, no-referrer and noindex. The shell restricts scripts, fonts, images and connections to its own origin. Public house content and existing villa photos remain public-safe assets. No external analytics, fonts, provider or model calls are made by the companion.

### Protected guide configuration

The public website Worker can read an encrypted secret named `GUEST_GUIDE_PRIVATE_JSON`. This change is isolated to the website; the admin and private stay verification service do not receive or store this configuration. Set it through Cloudflare's Worker secret mechanism, never a checked-in `vars` section, static JSON, build argument or frontend environment variable.

Its allowlisted JSON shape is:

```json
{
  "wifi": {
    "network": "Example guest network",
    "password": "Synthetic example only",
    "security": "WPA"
  },
  "hosts": [
    {
      "id": "example-host",
      "name": "Example host",
      "phone": "+15555550100",
      "whatsapp": "15555550100"
    }
  ]
}
```

These examples are synthetic. Use the owner's source guide for the actual private values. A private local JSON file can be piped to `wrangler secret put GUEST_GUIDE_PRIVATE_JSON --config artifacts/cloudflare-staging/wrangler.json` without echoing its contents. Do not commit that local file, include it in deployment artifacts, log it or show it in screenshots.

The total configuration is limited to 8 KiB. Wi-Fi names are at most 32 UTF-8 bytes, passwords at most 128 characters, and security must be `WPA`, `WEP` or `nopass`. Host names are at most 80 characters; at most eight hosts are allowed. Each host has a unique lowercase slug, an E.164 phone number and the matching digits-only WhatsApp number. URLs, unknown fields and malformed sections are not forwarded. Missing or invalid configuration leaves the existing stay experience working without those details.

The client contract adds `privateGuide.wifi` and/or `privateGuide.hosts` to a successful `/api/guest-companion` response. A host entry contains exactly `id`, `name`, `phone` and `whatsapp`. The Wi-Fi entry contains exactly `network`, `password` and `security`. The client must render text safely and create the Wi-Fi QR locally. It must never send the password to a QR website or store it in local/session storage, public page HTML, URL parameters or analytics. The access token remains the only private value retained in tab session storage.

Private links are shareable capabilities. These details are visible to anyone holding an active link for that stay, not only the owner. Creating this guide does not turn `/guest/?preview=1` into a private owner preview. The sample page continues to show public-safe content and no connection password or private host number.

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


## Complete-guide restoration, October 23, 2026

Website version `8c273995-bb2a-4ada-835e-7539de9a6336` restores the original 18-page Canva guide, including 23 original photographs, seven restaurants, eight outings, source service prices, six transport rows, host welcome, home story, important contacts, departure, review guidance and thank-you. The first-visit welcome can be reopened from Your stay. Three independently verified restaurant menu links supplement the original source.

The website secret `GUEST_GUIDE_PRIVATE_JSON` is configured through encrypted Worker storage. It supplies Wi-Fi and two private host contacts only after the existing stay service validates access. No secret is in the published assets, GitHub or screenshots. Public preview deliberately omits these details. QR generation uses a locally vendored MIT encoder with full attribution.

Validation passed: 11 companion tests, four calendar tests, 16 Python tests and static-site checks. Mobile checks at 390px and 320px and desktop at 1280px covered EN/ES, all five destinations, welcome, menu links, QR/copy-password, host contacts and overflow. An isolated actual Worker runtime and synthetic browser stay verified private rendering; an independent QR decoder recovered the synthetic payload with Unicode and escaped punctuation. The live preview has seven restaurant cards, three menu links, no broken photographs, no horizontal overflow and no console errors. The deployed facade rejects an unknown token with a generic no-store 404.

The bounded finish review found no material blocker. The design detector's single shadow warning was reviewed against the actual light canvas: the navigation shadow has a vertical offset and is an elevation treatment, not a zero-offset glow.

Rollback for this website-only release is `aeb76ca4-fa57-4260-8bf5-1e6f2d29cfd1`. The existing admin, private stay service, databases, DNS and CNAME were not modified by this restoration. The prior website safely ignores the new secret if rolled back.
