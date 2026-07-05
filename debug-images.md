# Image Display Debug Checklist

## What to Check on the Live Site:

1. **Go to Visual Assets Tab**
   - URL: https://cfv-content-engine.vercel.app/session/cmr4bdrd500004cl0w21cspvf
   - Click on "Visual Assets" tab
   - What do you see?

2. **Check Browser Console**
   - Press F12 (DevTools)
   - Go to Console tab
   - Look for any errors related to images or API calls
   - Share any red error messages

3. **Check Network Tab**
   - Press F12 (DevTools)
   - Go to Network tab
   - Filter by "asset" or "api"
   - Try to load the Visual Assets tab
   - Do you see API calls to `/api/asset/...`?
   - What are their status codes? (200 = success, 404 = not found, 500 = error)

4. **Check Image Count**
   - On the session detail page, look at the stats
   - Does it say "41 assets" or similar?
   - How many of those should be images?

## Possible Issues:

A. **No images in ZIP** - The imported ZIP might not have image files
B. **Images not imported** - Import might have skipped images
C. **Wrong folder** - Images might be in wrong folder (not 12_Visual_Assets)
D. **File paths broken** - Images saved to /tmp might not exist after serverless restart
E. **API endpoint broken** - The /api/asset/[id] endpoint might be failing

## What I Need From You:

Please share:
1. What you see on Visual Assets tab (screenshot or description)
2. Any console errors (screenshot)
3. Do other tabs show content (like Transcript)?
