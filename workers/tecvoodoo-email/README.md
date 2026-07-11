# tecvoodoo-email Worker

Standalone Cloudflare Worker that sends transactional email via Resend for the
TecVooDoo site:

- **Game invites** -- the Dots and Boxes "Email a friend" flow
- **Beta-reader signup** notifications (legacy branch; no live caller in `site/`)

It is **not** deployed by Cloudflare Pages -- Pages only serves `site/`. This
Worker is deployed manually with wrangler. It was previously un-versioned (lived
only on Cloudflare); this folder is the source of truth as of 2026-07-10.

Live URL: `https://tecvoodoo-email.runeduvall.workers.dev`

## Bot protection (added 2026-07-10)

Every request must carry a valid **Cloudflare Turnstile** token in the JSON body
as `turnstileToken`. The Worker verifies it server-side (siteverify) before
sending, so a direct POST from curl/a script -- without a real token -- is
rejected (400 if missing, 403 if invalid) and never reaches Resend. This closed
an open-relay exposure (the endpoint used to accept any POST).

The DAB invite form renders the Turnstile widget and sends its token:

- Widget name: `TVD Email Worker`, Managed mode, domain `tecvoodoo.com`
- Sitekey (public): `0x4AAAAAADzh2M6i0_cI0xm0`

## Secrets (set on the Worker, never committed here)

- `RESEND_API_KEY` -- Resend API key
- `TURNSTILE_SECRET_KEY` -- secret for the "TVD Email Worker" Turnstile widget

Set with: `echo "<value>" | wrangler secret put <NAME> --name tecvoodoo-email`

## Deploy

```
export CLOUDFLARE_API_TOKEN=<token with Account.Workers Scripts:Edit>
# set CLOUDFLARE_ACCOUNT_ID too if the token covers more than one account
wrangler deploy
```

`wrangler deploy` preserves existing secrets; you do not need to re-set them on
each deploy.
