# Client / partner logos

Drop the logos of clients and partners here. They render in the
**Our Clients** section on the homepage.

## How to add a new client

1. Save the logo file here, e.g. `telkom.svg` or `telkom.png`
2. Open `src/lib/clients.ts` and add an entry:
   ```ts
   { name: 'Telkom Indonesia', logo: '/clients/telkom.svg' }
   ```
3. Commit & push — Vercel will redeploy automatically.

## File guidelines

- **Format**: SVG is best (sharp on every screen). PNG with transparent
  background is fine too.
- **Color**: Single-color (black or dark grey) works best because the site
  renders them grayscale by default and colorizes on hover.
  If your client's brand requires a full-color logo, that's also fine —
  just be aware they'll all desaturate to grayscale until hovered.
- **Size**: Aim for ~200px wide. The grid will scale them down automatically.
- **File names**: lowercase, no spaces. Use the company's short name —
  `bni.svg`, `pln.svg`, `telkom.svg`.

## Don't have permission?

Only include logos of clients who have agreed to be listed publicly,
or whose logo use is covered by your contract.
