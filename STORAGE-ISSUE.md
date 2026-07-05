# CRITICAL: Image Storage Issue on Vercel

## Problem
Images are stored in `/tmp/cfv-storage/` which is **ephemeral** on Vercel serverless functions. When the function cold-starts or restarts, all images are lost.

## Current Behavior
1. Import ZIP → saves images to `/tmp/cfv-storage/{sessionId}/`
2. Database stores `filePath: /tmp/cfv-storage/{sessionId}/image.jpg`
3. Asset API tries to read from filePath
4. **After function restart:** File doesn't exist → images don't display

## Solutions

### Option A: Vercel Blob Storage (Recommended)
**Cost:** Free tier: 500MB, then $0.15/GB/month  
**Implementation:**
1. Install: `npm install @vercel/blob`
2. Update zip-processor.ts to upload to Blob
3. Store blob URL in database instead of filepath
4. Asset API fetches from blob URL

### Option B: Base64 in Database (Quick Fix)
**Pros:** No external service needed  
**Cons:** Database bloat, slower queries  
**Implementation:**
1. Read image file during import
2. Convert to base64
3. Store in `content` field
4. Asset API returns from content

### Option C: S3-Compatible Storage
**Options:** AWS S3, Cloudflare R2, Backblaze B2  
**Implementation:** Similar to Vercel Blob

## Recommended Action
Use **Vercel Blob** - it's designed for this use case and integrates seamlessly with Vercel deployments.

## Temporary Workaround
Until persistent storage is implemented:
- Images will disappear after ~15 minutes of inactivity (function cold start)
- User must re-import ZIP to restore images
- This is NOT a bug in the code - it's an architecture limitation
