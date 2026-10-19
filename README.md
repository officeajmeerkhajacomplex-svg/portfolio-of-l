# LIYAQAT® — Digital, with feeling.

A responsive, multi-page personal portfolio for a multidisciplinary creative developer/designer. Built with React, Vite, React Router, Framer Motion, and Lucide icons.

## What's inside

- Home: expressive hero with pointer-responsive 3D-inspired artwork, selected work, manifesto, services, and contact CTA.
- Work: responsive project grid and clear concept-work disclaimer.
- Case study pages: individual pages for each editable project concept.
- About: creative philosophy, principles, and capability tags.
- Services: service descriptions and project process.
- Contact: inquiry form that opens a pre-filled email draft (no backend required).
- Shared navigation, responsive mobile menu, animated page transitions, a personalized full-screen Lottie intro, scroll-to-top behavior, hover interactions, and reduced-motion support.
- Kinetic line-by-line homepage headline, a spring-smoothed reading progress bar, and scroll-linked parallax across the hero artwork and manifesto.
- Subtle pointer-reactive project-card tilt and micro-interactions for links, buttons, service rows, and form fields; effects are toned down on touch devices.

## Run locally

Install Node.js 18 or newer, then from this folder run:

```bash
npm install
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`). To make a production build:

```bash
npm run build
npm run preview
```

The production-ready static bundle will be output to `dist/`. It can be hosted on Netlify, Vercel, Cloudflare Pages, or another static host. Since the site uses React Router history routes, configure the host to rewrite unknown paths to `/index.html` so direct links to `/work`, `/about`, `/services`, `/contact`, and `/work/:slug` work on refresh.

## Personalize before publishing

1. Open `src/data.js`.
2. Replace `your-email@example.com` with your real email address.
3. Update your location and availability copy.
4. Add your résumé PDF to `public/` and name the file exactly `resume.pdf`. The site includes a **Download résumé** link near the top of the About page and in the footer; both link to `/resume.pdf`. If you prefer a different file name, update both links in `src/pages/About.jsx` and `src/components/SiteLayout.jsx`.
5. Replace the concept explorations in `projects` with real portfolio projects when available. The four current projects are explicitly labelled concept explorations; they should not be represented as commissioned client work.
6. Adjust the service descriptions and capability tags to match your actual experience.

## Motion notes

Page and scroll motion use Framer Motion. The intro screen uses the locally bundled `src/assets/liyaqat-loader.json` Lottie animation with `lottie-react`; it does not rely on an external animation URL. The intro can be skipped with the button, Escape, or Enter; it temporarily makes the page behind it inert and respects reduced-motion settings. Scroll progress and parallax use motion values rather than per-frame React state. Use a device-level reduced-motion preference to tone down transitions and disable pointer-driven tilts.

## Design notes

The look is intentionally original: charcoal surfaces, coral-red `#ff5c47` accents, editorial typography, abstract generative artwork, and restrained movement. It takes inspiration from immersive creative portfolios without copying any specific website. Most artwork is drawn with CSS, so no stock images are required. Google Fonts are loaded remotely, with system fallbacks if unavailable.

## Contact form behavior

There is no form backend. Submission builds a message and opens the visitor's default email application with the recipient, subject, and body pre-filled. The visitor chooses whether to send it. Replace the placeholder email before launch.


## Customize the intro animation

The personalized loading screen is in `src/components/IntroLoader.jsx`, and its bundled Lottie JSON file is `src/assets/liyaqat-loader.json`. The component has a skip button, a short progress indicator, a reduced-motion path, and an automatic exit so it does not trap visitors. If you replace the Lottie file, keep the animation as a Bodymovin/Lottie JSON and preserve the import path or update it in the component.
