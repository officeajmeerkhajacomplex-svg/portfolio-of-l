# LIYAQAT design and interaction system

The visual language is warm, editorial and tactile. Neumorphic depth is used for useful surfaces, while glass is reserved for navigation and small floating details. Coral is an accent, not a background colour for every section.

## Foundations

- **Paper:** `#f7f6f1` and the deeper paper tone `#ede9e1`.
- **Ink:** `#20221e`; secondary text uses the muted and subtle tokens.
- **Accent:** `#ff624d`, with the darker coral used for small text on light surfaces.
- **Typography:** Space Grotesk for display and body; DM Mono for metadata.
- **Depth:** soft raised shadows for cards and panels; inset shadows for form controls.

Tailwind v4 tokens live in `src/tailwind.css` under `@theme`. Shared primitives are registered in its `@layer components` block. Existing art direction and page-specific composition remain in `src/styles.css` and `src/light-theme.css`; keep those bespoke rules where they communicate the design more clearly than utility classes.

## Interaction components

- **MagicCard** (`src/components/ui/MagicCard.jsx`) adds a pointer-tracked spotlight and a restrained highlighted edge to project cards. It is a local, brand-tuned implementation of the Magic UI Magic Card interaction pattern.
- **BorderBeam** (`src/components/ui/BorderBeam.jsx`) adds a single subtle moving highlight to the contact form edge, activated on hover or focus.
- **LottieMark** (`src/components/LottieMark.jsx`) lazy-loads the Lottie player only when the mark approaches the viewport, pauses it outside view, and uses a static mark when reduced motion is requested.

## Motion rules

1. Motion should explain hierarchy, feedback or personality; do not animate every surface.
2. Ambient loops stay slow and low amplitude.
3. Respect `prefers-reduced-motion` for transforms, Lottie and decorative loops.
4. The welcome intro runs once per browser tab session, lasts about 1.15 seconds before its exit, and can be skipped.
5. Keep touch interactions simple: no cursor-tracking tilt or spotlights on coarse pointers.

## GitHub Pages routes and performance

- Page modules are lazy-loaded in `src/App.jsx`.
- Vendor groups are separated in `vite.config.js`; Lottie is loaded as its own async chunk.
- `npm run build` runs `scripts/prepare-pages.mjs` after Vite. It creates a directory index for each real route and derives project detail routes from `src/data.js`, allowing GitHub Pages to serve those paths with HTTP 200.
- The Pages workflow builds pull requests but deploys only pushes to `main`.
