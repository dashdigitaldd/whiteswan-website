# Independent hosted preview

The Cloudflare preview is a separate release from `staywhiteswan.com`. It does not change DNS, the committed CNAME, WhatsApp numbers or the upstream GitHub Pages deployment.

Run the existing content checks and tests, then `python3 scripts/prepare-staging.py`. This copies only public website routes/assets into ignored `artifacts/cloudflare-staging/public`. It excludes source scripts, repository metadata and development artifacts. The generated preview has a disallow-all robots file and `X-Robots-Tag: noindex, nofollow`; production canonical links remain intact.

From an authenticated Cloudflare CLI, deploy with `wrangler deploy --config artifacts/cloudflare-staging/wrangler.json`. Verify EN/ES navigation, mobile layout, date validation, booking-request semantics, consent and failure handling on the hosted origin. Configure a staging intake origin in the **generated asset copy** only when its separate service is deployed and tested. Keep analytics disabled until the owner coordinates the approved tag.

The booking planner now reads calendar availability from the isolated intake facade and saves host-reviewed stay requests. It does not create an inventory hold, process payment or confirm a booking. See BOOKING.md. The staging packager writes the existing pilot intake origin into the generated public config; production config remains disabled.
