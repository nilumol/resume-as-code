# Assets Directory

This directory contains assets for your resume.

## Headshot Image

To add your professional headshot:

1. **Add your photo** as `headshot.jpg` in this directory
2. **Recommended specifications:**
   - Format: JPG or PNG
   - Size: 400x400 pixels (square)
   - File size: Under 100KB
   - Professional appearance
   - Good lighting and clear background

3. **Update resume.json** to reference the image:
   ```json
   {
     "basics": {
       "image": "assets/headshot.jpg"
     }
   }
   ```

## Alternative: No Headshot

If you prefer not to include a headshot:

1. **Remove the image field** from `resume.json`
2. **Or set it to null:**
   ```json
   {
     "basics": {
       "image": null
     }
   }
   ```

## Image Guidelines

- **Professional appearance** - business attire, neutral background
- **High quality** - clear, well-lit, good resolution
- **Appropriate size** - not too large for web/PDF display
- **Consistent branding** - matches your professional image

## File Formats Supported

- JPG/JPEG (recommended for photos)
- PNG (good for graphics with transparency)
- WebP (modern format, good compression)
- SVG (vector format, scales perfectly)

Remember: Your headshot is often the first impression employers have of you, so choose wisely!
