# Release and traffic launch

## What can ship without DNS changes

The public pages continue at the existing GitHub Pages root. `CNAME` is unchanged. The public intake service has its own runtime origin and isolated database. Configure `assets/config.js` with that public origin only; do not add a private feed key to the website. The admin app receives the corresponding server-only read key.

The active GitHub account has read access to the upstream website, so this change is delivered from a fork. The upstream owner merges the reviewed PR to `main`; that triggers the existing GitHub Pages deployment. Do not enable a second Pages deployment with the production CNAME in the fork. Do not modify Namecheap records or WhatsApp numbers.

## Acceptance before increasing traffic

- Confirm the six routes, mobile CTA/form, language links, existing guest guide and both original WhatsApp contacts.
- Submit an explicitly labeled test enquiry, verify one receipt and one private lead, then remove test data using the approved operations procedure. Do not send test messages to guests or vendors.
- Check the visitor sees a recoverable form error if the intake service is unavailable. Retry should not duplicate the enquiry.
- Confirm guest capacity, prices, cancellation terms and operational instructions with the owner; imported old guide content is not current AI verification.
- Review contact/privacy ownership, the manual retention/deletion procedure and operator follow-up responsibility. Baseline signed sessions and rate limits are not a full bot-detection system.
- Coordinate one GA4 owner/property/tag. No GA4 tag is included in this release. Verify consent behavior and exclude private fields before enabling an adapter.
- Set up Search Console ownership and submit `https://staywhiteswan.com/sitemap.xml`. Use an approved URL-prefix verification method if DNS changes are not authorized. Indexing and rankings require observation after release.
- Connect WhatsApp Business Platform before promising an app-managed WhatsApp inbox. Existing links continue to work independently.
- Record the direct-payment provider decision and bank settlement checks before enabling checkout.

## Operating boundaries

Website feed sync is operator-triggered, with up to 50 records per batch and a Continue sync action. It is not a background service or live alert. Keep an operator sync/check routine during the pilot. Public submissions are durable even if the private app is temporarily unavailable. Add a durable scheduler, backlog/age alerts, automated retention, backups and stronger public abuse controls before high-volume acquisition.

## Rollback

The website owner can revert the release commit in the upstream repository without changing DNS or CNAME. Keep the intake service and saved data while diagnosing a frontend rollback. A private app rollback does not undo applied database migrations; use additive-compatible migrations. No checkout, bank, WhatsApp registration or provider-send changes are made by this release.
