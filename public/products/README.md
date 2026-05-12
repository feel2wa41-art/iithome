# Product category images

Drop one image per product category here. They appear on the homepage
"Products" section and on the Products page.

## Expected files (one per category)

| File              | Category                |
|-------------------|-------------------------|
| `cable.jpg`       | Fiber Cables            |
| `ftth.jpg`        | FTTH Equipment          |
| `splice.jpg`      | Splice & Tools          |
| `active.jpg`      | Active Equipment        |
| `accessory.jpg`   | Accessories             |

If an image is missing, the section falls back to an icon — the site
keeps working either way.

## File guidelines

- **Format**: JPG (smaller) or PNG (lossless). WebP also supported.
- **Aspect ratio**: 4:3 looks best (e.g. 800×600)
- **Size**: Around 800-1200 px wide. Larger is fine — Next.js will
  optimize automatically.
- **File names**: must match the category slug exactly:
  `cable`, `ftth`, `splice`, `active`, `accessory`

## Individual product images

For per-product images (catalogue detail), use Supabase Storage instead
of this folder. Then store the public URL in the `products.image_url`
column. This keeps the git repo small while letting you swap product
photos without redeploying.
