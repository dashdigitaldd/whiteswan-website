---
version: 1
slug: "guest-index-html"
primary_target: "guest/index.html"
related_targets: ["assets/companion.css","assets/companion.js","content/guest-companion.json"]
---

# White Swan guest companion

Recorded from the implemented companion on 23 October 2026. This is an ordinary extension of the owner's established White Swan identity, scoped to `/guest/`.

## Scope and mode

**Mode: Operate.** A guest opens a private stay link on a phone to understand arrival, find house instructions, ask about a service, explore nearby places or contact the host. The five destinations are Your stay, The house, Experiences, Explore and Help. The companion is a separate surface from the marketing website and booking planner.

The implementation lives in `guest/index.html`, `assets/companion.css`, `assets/companion.js` and the public-safe bilingual `content/guest-companion.json`. Functional behavior, access boundaries and release checks belong to `docs/GUEST_COMPANION.md`; content authority and exclusions belong to `docs/GUEST_COMPANION_CONTENT.md`.

## Inherited identity and boundaries

The current admin identity supplies self-hosted Dubai in light, regular, medium and bold weights, navy primary actions, a cool-white reading canvas and restrained gold details. `assets/companion.css` is the source of truth for this surface's values. The original White Swan artwork stays on white; villa and destination photography comes from existing approved assets. The font provenance is recorded in `assets/fonts/DUBAI.md`.

The public marketing pages retain their own Inter/Cormorant typography, editorial composition, stylesheet bundle, generator and bilingual routes. Companion styles are loaded only by its standalone shell. Extending the companion does not authorize a marketing redesign, a global token migration or a replacement of the owner's logo.

## Composition and responsive behavior

The opening view pairs a real villa photograph and personal welcome with a readable stay itinerary. Wi-Fi, restaurants and host-contact actions follow immediately. A first-visit welcome popup from Wendy and Sergio opens once per tab/stay, with the original photograph and letter; guests can reopen it from the home view. On phones the photograph, itinerary and actions form one vertical reading order; the five labelled destinations remain fixed at the bottom with safe-area spacing. Desktop uses a centred content frame and a compact floating navigation bar.

The house area is a searchable directory with concise summaries. Selecting a topic opens a native dialog, presented as a bottom sheet on phones. Experiences restores four original service photographs, their source prices and chef menu choices, followed by six transport rows. Explore separates seven restaurants, eight outings and four nearby essentials, retaining the original images and correctly labelled venue, menu, article and map links. Help puts hosts, address and emergency contacts ahead of FAQs, departure, review guidance and the original thank-you. White panels, thin separators and rounded corners group related information; photographic welcome content and the navy contact panels provide emphasis.

The primary responsive transition is at 700px, with narrower adjustments at 360px and intermediate layout changes at 1000px. The current styles also adapt the opening view above 1500px. Preserve the phone reading order, navigation clearance, visible focus and reduced-motion treatment when editing.

## Interaction and content constraints

Show one selected language at a time, remembering the guest's EN/ES preference independently from the admin. Dates and stay times use El Salvador context. Missing stay details remain unknown. Keep the sample-preview notice and missing, expired and temporarily unavailable link states distinct from an authenticated stay.

A service action prepares a WhatsApp message that the guest sends. It does not book, charge, confirm a provider or create a receipt. Checklist ticks do not notify the host. Door and safe instructions refer guests to the existing Airbnb arrival message. The owner explicitly permits Wi-Fi credentials, a locally generated QR and personal host contacts after private stay verification. These values must come from the protected Worker secret and never enter static content, preview data, browser storage or third-party QR services. Other private operational knowledge stays excluded.

## Evidence checked

Compared the companion shell, stylesheet, rendering/navigation functions and content structure against the marketing shell, `assets/site.css`, `assets/fonts.css`, current admin font definitions and the current admin visual-system summary. The shared logo reference and existing photo paths were retained. The admin document explicitly supersedes its historical palette/type notes with the current owner-directed refresh.

No root `PRODUCT.md` or `DESIGN.md` existed during this handoff. Their absence was not treated as permission to invent a global system. This brief records the local boundary; browser validation and the finish review remain separate evidence.
