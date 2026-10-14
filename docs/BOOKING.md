# Public availability and stay requests

Updated 14 October 2026. The website owns the booking journey. Hospitable provides channel calendar data through a private service; no provider credentials belong in this repository.

The hosted Cloudflare pilot supports EN/ES calendar browsing, current date checks and an inline, consented stay request with a persistent reference. Public availability contains no guest details or private notes. Calendar browsing caches for up to 60 seconds and shows its check time in El Salvador. Date checks and request submission re-read the provider. Unknown coverage never appears available. Arrival/minimum-stay/checkout restrictions are enforced; checkout night is not an occupied night.

This release saves an enquiry for host review, not a reservation or payment. It does not hold inventory. Group capacity, full price, taxes, fees and cancellation/payment terms still need host confirmation. Requests reuse the existing private intake feed and its idempotency. WhatsApp remains an alternative, with unchanged contact numbers.

The previous optional Hospitable widget insertion is retired from the active renderer. Direct checkout will use a merchant-approved hosted payment page owned by our booking workflow. n1coBusiness is the first onboarding candidate, pending confirmation for the owner's personal-name Promerica account and lodging business. No card form or fake confirmation is published.

Production GitHub Pages keeps intake disabled until the production service and origin are approved. `scripts/prepare-staging.py` sets the existing pilot intake origin only in the generated preview package. The live domain and CNAME remain unchanged. The admin repository's `docs/PUBLIC_BOOKING.md` records the integration contract and the quote/hold/payment/reconciliation activation requirements.

Validate with `python3 scripts/build.py`, `python3 scripts/check.py`, `python3 -m unittest discover -s tests`, and browser EN/ES desktop/mobile checks. Only synthetic personal information may be used for form testing.
