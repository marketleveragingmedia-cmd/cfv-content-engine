# CFV Content Engine - Complete Project Overview
**Last Updated:** July 5, 2026 18:25 UTC  
**Status:** ✅ PRODUCTION READY & OPERATIONAL

---

## 🎯 What This Is

**Cash Flow Visionaries Content Engine** - A Next.js application for managing Vision Session content packages, including transcripts, video scripts, visual assets, checklists, and publishing workflows.

---

## 🌐 Live Deployment

- **Production URL:** https://cfv-content-engine.vercel.app
- **Platform:** Vercel
- **Region:** US East (iad1)
- **Framework:** Next.js 16.2.10 (App Router + Turbopack)
- **Database:** PostgreSQL (Vercel Postgres)
- **Storage:** Vercel Blob (persistent image storage)

---

## ✅ Current Status

### What's Working:
- ✅ **Dashboard** - Overview of all sessions, stats, and Founder Pathway progress
- ✅ **Import System** - Upload Vision Session ZIP packages
- ✅ **Replace Package** - Update existing sessions with new ZIP
- ✅ **Session Management** - View, edit, and organize sessions
- ✅ **Visual Assets** - Images stored in Vercel Blob (persistent forever)
- ✅ **Checklists** - Track progress on required and optional tasks
- ✅ **Publishing Matrix** - Manage platform publishing status
- ✅ **Export** - Download complete session packages as ZIP
- ✅ **Responsive Design** - Mobile-friendly UI

### Recent Major Fixes:
1. **Image Persistence** - Migrated from ephemeral `/tmp` to Vercel Blob storage
2. **Import/Replace** - Fixed duplicate session creation
3. **Asset Display** - Fixed case-sensitive filtering (Image vs image)
4. **Navigation** - Fixed "View Session" button after import

---

## 📁 Project Structure

```
cfv-content-engine/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── import-zip/           # ZIP import handler
│   │   ├── asset/[id]/           # Asset viewer/download
│   │   ├── session/[id]/         # Session operations
│   │   │   ├── export/           # Export to ZIP
│   │   │   ├── replace-zip/      # Replace package
│   │   │   ├── update-field/     # Edit session metadata
│   │   │   └── delete/           # Delete session
│   │   └── sessions/             # List all sessions
│   ├── import/                   # Import page
│   ├── session/[id]/             # Session detail page
│   │   ├── page.tsx              # Main session view
│   │   ├── SessionTabs.tsx       # Tab navigation
│   │   ├── ExecutiveOverview.tsx # Overview tab
│   │   ├── VisualAssets.tsx      # Image gallery
│   │   ├── ChecklistEditor.tsx   # Progress tracking
│   │   ├── PublishingEditor.tsx  # Publishing matrix
│   │   └── ...                   # Other components
│   ├── sessions/                 # All sessions list
│   └── page.tsx                  # Dashboard homepage
├── lib/
│   ├── prisma.ts                 # Database client
│   ├── zip-processor.ts          # ZIP import logic (w/ Blob upload)
│   ├── zip-exporter.ts           # ZIP export logic
│   └── checklist-template.ts     # Default checklist items
├── prisma/
│   └── schema.prisma             # Database schema
├── public/                       # Static assets
└── components/                   # Shared React components
```

---

## 🗄️ Database Schema

### Key Models:
- **VisionSession** - Main session record (metadata, status, pathway stage)
- **Asset** - Individual files (transcripts, images, scripts)
- **ChecklistItem** - Task tracking (required/optional, categories)
- **PublishingMatrixItem** - Platform publishing status
- **ImportLog** - History of ZIP imports

### Asset Types:
- `transcript` - Session transcript
- `core_message` - Core message content
- `image` - Visual assets (stored in Vercel Blob)
- `notebooklm_source` - NotebookLM source files
- `notebooklm_instructions` - NotebookLM instructions
- `file` - Other files

---

## 📦 ZIP Package Format

Expected structure for import:
```
CFV_VS_00001_SessionName.zip
├── 00_Manifest/
│   └── manifest.json          # Metadata (sessionId, theme, title, etc.)
├── 01_Overview/
│   └── overview.md            # Session overview
├── 02_Transcript/
│   └── transcript.txt         # Full transcript
├── 03_Core_Message/
│   └── core-message.md        # Core message
├── 04_YouTube_Long_Form/
│   └── script.md              # Long-form script
├── 05_Shorts/
│   ├── short-1.md
│   └── short-2.md
├── 11_NotebookLM/
│   ├── source.txt
│   └── instructions.md
└── 12_Visual_Assets/
    ├── image1.jpg             # Uploaded to Vercel Blob
    └── image2.png             # Persistent storage
```

---

## 🔑 Environment Variables

**Required (Auto-configured by Vercel):**
- `POSTGRES_URL` - Database connection string
- `POSTGRES_PRISMA_URL` - Prisma-specific URL
- `POSTGRES_URL_NON_POOLING` - Direct connection
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token (auto-added when Blob store created)

**Optional:**
- `NODE_ENV` - Environment (production/development)

---

## 🚀 Deployment Process

### Automatic (Current Setup):
1. Code pushed to repo (or deployed via CLI)
2. Vercel auto-builds and deploys
3. Production URL updated automatically
4. Zero downtime deployment

### Manual Deploy:
```bash
cd /root/.openclaw/workspace/cfv-content-engine
export VERCEL_TOKEN=<token>
npx vercel deploy --prod --yes
```

---

## 💾 Vercel Blob Storage

### Current Configuration:
- **Store Name:** cfv-images
- **Store ID:** store_AeHO6D62HIgJ4CGr
- **Access:** Public
- **Region:** iad1 (US East)
- **Connected to:** cfv-content-engine project

### Usage (Free Tier):
- **Storage:** 5 GB included (currently using ~0 GB)
- **Operations:** 100K reads/month
- **Uploads:** 10K writes/month
- **Cost:** $0/month (well within free tier)

### How It Works:
1. Image uploaded during ZIP import
2. Uploaded to Vercel Blob via `@vercel/blob` SDK
3. Returns permanent URL (e.g., `https://[random].public.blob.vercel-storage.com/...`)
4. URL stored in database `filePath` field
5. Images served directly from Blob CDN
6. No ephemeral storage issues - **images persist forever**

---

## 📊 Current Data

- **Total Sessions:** 1
- **Session ID:** CFV-VS-00001
- **Title:** "Life Is Long | Stop Being Taught to Be Confused"
- **Assets:** 41 total
- **Images:** Working and persistent in Vercel Blob
- **Status:** Draft (2% complete)

---

## 🛠️ Key Technologies

- **Next.js 16.2.10** - React framework with App Router
- **Turbopack** - Fast bundler
- **Prisma 5.22.0** - Database ORM
- **PostgreSQL** - Vercel Postgres database
- **@vercel/blob** - Persistent cloud storage for images
- **AdmZip** - ZIP file processing
- **TypeScript** - Type-safe development

---

## 🔧 Maintenance Commands

### Check Deployment Status:
```bash
cd /root/.openclaw/workspace/cfv-content-engine
curl -s "https://cfv-content-engine.vercel.app/api/sessions" | python3 -m json.tool
```

### List Blob Stores:
```bash
export VERCEL_TOKEN=<token>
npx vercel blob list-stores
```

### View Recent Deployments:
```bash
# Via Vercel dashboard
https://vercel.com/marketleveragingmedia-cmds-projects/cfv-content-engine/deployments
```

---

## 📝 Git Repository

**Local Path:** `/root/.openclaw/workspace/cfv-content-engine`

**Recent Commits:**
- `f367b6a` - Add session delete API endpoint
- `453ea80` - Fix Buffer to ArrayBuffer conversion
- `2f0e213` - Implement Vercel Blob storage for persistent images
- `7ba33c8` - Fix case-sensitive assetType filter
- `23cac7c` - Fix: Images now display, View Image works

---

## 🐛 Known Limitations

1. **No Git Remote** - Project has local git but no remote repository configured
2. **No Authentication** - Public access (add auth if needed)
3. **No Batch Delete** - Can only delete sessions one at a time
4. **No Search** - Dashboard has filter UI but search not implemented

---

## 🎯 Future Enhancements (Optional)

- [ ] Add authentication (NextAuth or similar)
- [ ] Implement search/filtering on sessions page
- [ ] Add batch operations (delete multiple sessions)
- [ ] Export analytics/reports
- [ ] Email notifications for publishing deadlines
- [ ] Connect GitHub repository for version control
- [ ] Add session collaboration features
- [ ] Integrate with publishing platforms (YouTube API, etc.)

---

## 📞 Support & Documentation

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Project Settings:** https://vercel.com/marketleveragingmedia-cmds-projects/cfv-content-engine
- **Vercel Blob Docs:** https://vercel.com/docs/storage/vercel-blob
- **Next.js Docs:** https://nextjs.org/docs

---

## ✅ Health Check

**Last Verified:** July 5, 2026 18:25 UTC

- ✅ Production deployment: LIVE
- ✅ Database connection: WORKING
- ✅ Blob storage: CONNECTED
- ✅ Image uploads: FUNCTIONAL
- ✅ Import/Export: OPERATIONAL
- ✅ Session management: WORKING

**Status:** 🟢 ALL SYSTEMS OPERATIONAL
