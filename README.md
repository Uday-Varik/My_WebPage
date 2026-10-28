# Portfolio redesign v2 — the $1M version

A response to direct feedback: v1 looked AI-generated and cheap. This version
is built on the opposite principle — **restraint is the luxury**.

## Why v1 read as cheap

- Neon lime on black, a marquee, a grain overlay, a custom cursor, and a
  stats grid all competing at once — the standard AI-template starter kit.
- Everything was a pill button, a card, or a chip. Nothing had room to breathe.
- No real image, no caption, no editorial voice. It looked generated because
  every element was generic.

## What v2 does instead

- **One idea, stated quietly:** “Models that hold up in production.” The
  headline is a serif sentence, not a name in 10rem black type.
- **Paper, ink, bronze:** warm ivory `#F3EFE6`, ink `#161513`, bronze
  `#8A6D3B`. No neon, no gradients, no glow.
- **One artwork, captioned like a print:** an ink terrain drawing with a
  single bronze forecast line (Fig. 01), explicitly labelled illustrative —
  not client data. That honesty is itself a premium signal.
- **Editorial structure:** a magazine masthead, a contents index, case
  studies as spreads with metrics in the margin, experience as a ruled
  record, skills as a typeset stack — not chips.
- **Motion, barely there:** one slow hero fade/scale and a gentle scroll
  reveal. No cursor, no canvas animation, no marquee. Reduced-motion users
  get a static page.
- **Type:** Fraunces (serif, with italics) for headlines, Inter for body.
  Nothing is set in all-caps black sans at maximum weight.

## What was preserved

All live-site content: FedEx / Caliber / Novartis roles and outcomes,
the three case studies with their metrics, all skills, the Memphis degree
and both certifications, and the same LinkedIn, GitHub, and résumé link
destinations. The email link is still base64-encoded in `script.js` and
decoded at runtime, as on the live site.

## What changed on purpose

- **Contact form:** no backend is bundled, so a valid form opens a
  pre-filled email instead of pretending a submission succeeded. The old
  form provider key is deliberately not copied here.
- **Résumé file:** copy your PDF into `MyResumes/` next to `index.html`
  before deploying, or the Résumé link will 404 (same requirement as before).

## Preview & deploy

Preview locally with `python3 -m http.server 8000` in this folder, then open
`http://localhost:8000`. These files are a drop-in static replacement for
the live site's `index.html`, `styles.css`, and `script.js`, plus
`assets/hero-terrain.webp`.

Nothing live has changed. Pushing this still waits on confirming which
repo / Vercel project actually deploys udayvarikuppala.space — the three
portfolio repos checked earlier did not match the live site.
