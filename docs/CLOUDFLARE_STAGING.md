# Independent hosted preview

The Cloudflare preview is a separate release from `staywhiteswan.com`. It does not change DNS, the committed CNAME, WhatsApp numbers or the upstream GitHub Pages deployment.

Run the existing content checks and tests, then `python3 scripts/prepare-staging.py`. This copies only public website routes/assets into ignored `artifacts/cloudflare-staging/public`. It excludes source scripts, repository metadata and development artifacts. The generated preview has a disallow-all robots file and `X-Robots-Tag: noindex, nofollow`; production canonical links remain intact.

From an authenticated Cloudflare CLI, deploy with `wrangler deploy --config artifacts/cloudflare-staging/wrangler.json`. Verify EN/ES navigation, mobile layout, date validation, booking-request semantics, consent and failure handling on the hosted origin. Configure a staging intake origin in the **generated asset copy** only when its separate service is deployed and tested. Keep analytics disabled until the owner coordinates the approved tag.

The current booking form sends a request via WhatsApp. It is not a live inventory hold, payment or confirmed booking. For an official Hospitable widget, obtain the exact property's current embed code and follow the existing widget template/generator workflow. Do not derive widget URLs from API property IDs. Online payment launch still requires an eligible processor and settlement approval for the owner's Salvadoran account.
