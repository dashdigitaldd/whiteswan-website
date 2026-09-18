# White Swan engineering rules

- This repository is public. Never add private guest data, tokens, internal staff contacts not already public, access codes or original operational attachments.
- Preserve CNAME, DNS and WhatsApp numbers unless the owner explicitly approves changes. Existing owner line is +503 7052-8003 and the guest guide also links the existing on-site line. Do not consolidate them silently.
- All door, Wi-Fi and safe codes go through Airbnb three days before arrival; never publish them here or in browser configuration.
- GitHub Pages serves the committed root. Regenerate static pages after editing the generator. Keep runtime dependency-free, bilingual URLs, no-JavaScript content and the existing visual language.
- Use real property photos. Never generate fictional rooms or amenities. The owner has authorized editorial photo enhancement; use the curated registry in content/editorial-assets.json and retain source provenance. Never reintroduce excluded poolside daybed photo 2569999123 or the legacy daybed/massage/early images. Responsive asset preparation only resizes/compresses selected edits.
- A click is not a lead, message, booking, payment, deposit or supplier acceptance. A server receipt establishes an enquiry only.
- Do not install GA4/GTM until the owner coordinates the one approved tag. Analytics is optional; never include form contents or personal identifiers in events.
- Keep public intake separate from private operations. Never embed service credentials or make the admin audience public.
- Use hosted payment fields/checkout once a processor is approved. Do not collect card numbers, CVVs or identity documents here.
- Run `python3 scripts/check.py`, browser checks of both languages and form success/failure/consent before publishing. Synthetic test data only; no live guest/vendor sends.
