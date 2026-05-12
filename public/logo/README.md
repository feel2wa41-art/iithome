# Logo files

Drop your company logo files here. The site will auto-detect and use them.

## Expected files

| File                  | Used where                                  | Recommended format         |
|-----------------------|---------------------------------------------|----------------------------|
| `logo.svg`            | Header (light backgrounds)                  | SVG (preferred) or PNG     |
| `logo-white.svg`      | Footer / dark hero sections                 | SVG with white fill        |
| `favicon.ico`         | Browser tab                                 | 32×32 ICO (or .png)        |
| `apple-touch-icon.png`| iOS home-screen icon                        | 180×180 PNG, square        |
| `og-image.png`        | Link previews (Twitter, WhatsApp, FB, etc.) | 1200×630 PNG, no transparency |

## How it works

If `logo.svg` exists, the `Logo` component (`src/components/layout/Logo.tsx`)
uses it automatically. If absent, it falls back to the built-in SVG fiber mark.

Tip: SVG is best because it scales perfectly on every screen. If you only
have a PNG, name it `logo.png` instead — the component supports both.

## Naming rules

- All lowercase, no spaces (`logo.svg` not `Logo.SVG`)
- Replace `favicon.ico` in `public/` root (not here) if you want to override
  the default browser icon
