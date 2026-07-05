# Vercel Blob Setup Instructions

## ⚠️ IMPORTANT: Environment Variable Needed

Vercel Blob requires an environment variable to work. This is automatically created when you enable Blob storage in your Vercel project.

## Setup Steps:

### 1. Enable Vercel Blob Storage
1. Go to https://vercel.com/dashboard
2. Select project: **cfv-content-engine**
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **Blob**
6. Click **Create**

This will automatically:
- Create a blob store
- Add `BLOB_READ_WRITE_TOKEN` environment variable to your project
- Connect it to all deployments

### 2. Verify Environment Variable
After creating the blob store:
1. Go to **Settings** > **Environment Variables**
2. Confirm `BLOB_READ_WRITE_TOKEN` exists
3. It should be set for Production, Preview, and Development

### 3. Redeploy (if needed)
If the blob store was just created:
- The next deployment will automatically pick up the token
- Or manually redeploy to use it immediately

## What Happens Now:

✅ **Images upload to Vercel Blob** (persistent cloud storage)  
✅ **URLs stored in database** instead of file paths  
✅ **Images never disappear** (no more ephemeral /tmp issues)  
✅ **Free tier:** 5GB storage, 100K operations/month  

## Testing:

1. Import a new Vision Session ZIP
2. Go to Visual Assets tab
3. Images should display immediately
4. Wait 24 hours and check again - images still there! ✨

## Cost Monitoring:

- Check usage: https://vercel.com/[team]/~/observability/blob
- Alerts sent at 75% and 90% of free tier
- Upgrade to Pro if needed (but you likely won't with current usage)
