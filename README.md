# Ferretería — storefront template

A blueprint-sharp catalog for hardware stores, building supplies, plumbing,
electrical and paint shops: search first, departments as drawer labels, a
dense list with quick quantities, and a 3D bolt whose nut screws up the thread
as you scroll. Design plan: [`DESIGN.md`](DESIGN.md).

## How it works

React 18 + Vite + Tailwind. Everything the store shows is data — branding,
CMS copy (`home`, `about`, `products`, `contact`), products and services,
categories, contact and hours — read through `src/core/`, vendored from the
monorepo's `templates/_core` (do not edit it here). Template code is the
design: `src/components`, `src/pages`, `src/scenes`, `src/theme`, `src/i18n`.

`/config.json`: `{ "mode": "demo", "templateId": … }` shows the template's demo
rows; a provisioned store gets `{ "mode": "live", "orgId": … }`.

## Pages

`/` · `/products` (`?type=`, `?category=`, `?sale=1`, `?q=`, `?sort=`; list or
grid, remembered per browser) · `/products/:id` · `/about` · `/contact` ·
`/trueque` · `/account` · 404. Old URLs (`/deals`, `/services`,
`/category/:slug`…) redirect into the catalog.

## Effects

`src/scenes/bolt.ts` is three.js in its own lazy chunk; it loads only when the
hero is near the viewport, motion is allowed and the device can take it.
`prefers-reduced-motion`, `?motion=reduce` and `?webgl=0` show the line drawing
instead; nothing depends on the scene.

## Development

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # tsc + vite build → dist/
```

Against a local management-be: `TSURU_DEV_API=http://localhost:5000
VITE_PUBLIC_API_URL=http://localhost:5173 pnpm dev`.

## Deployment

`.github/workflows/deploy.yml`: `develop` → GitHub Pages
(`ferreteria.examples.tsuru.jcampos.dev`, staging); `main` → production
example hosting (`ferreteria.examples.tsuru.lat`); each deploy notifies the
provisioner to refresh stores using this template.
