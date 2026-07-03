# Cash Flow Visionaries Content Engine

**Version:** 1.0  
**Created:** July 2, 2026  
**Purpose:** Vision Session management, content production, and publishing workflow

---

## Features Implemented

### ✅ Core System
- **Vision Session Records** with unique CFV-VS-##### IDs
- **15 Standard Tabs** per session
- **ZIP Package Import** with original preservation
- **Database Storage** (PostgreSQL + Prisma)

### ✅ Content Management
- **Overview Tab** - Session metadata
- **Transcript Tab** - Clean transcripts
- **Core Message Tab** - Session essence
- **YouTube Long-Form Tab** - Full video package
- **Shorts Tab** - Short-form content
- **YouTube Community Tab** - Community posts
- **YouTube Podcast Tab** - Podcast episodes
- **HeyGen Tab** - Avatar scripts
- **SKOOL Tab** - Community content
- **Founder Pathway Tab** - Founder positioning

### ✅ Publishing Workflow
- **Interactive Publishing Checklist** (58 default items across 11 categories)
- **Publishing Matrix** tracking (YouTube, SKOOL, Facebook, Instagram)
- **Progress Tracking** (Required vs. Overall completion)
- **Status Management** (Draft → In Progress → Ready to Publish → Published)

### ✅ Special Features
- **NotebookLM Tab** - Separate source & generation instructions
- **Visual Assets Tab** - Image management
- **Links & Versions Tab** - Original ZIP + publishing links
- **Import/Audit Log** - Full import history

---

## Installation & Deployment

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Vercel account (for deployment)

### Local Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure database:**
Edit `.env` and set your `DATABASE_URL`:
```
DATABASE_URL="postgresql://user:password@host:5432/cfv_content_engine"
```

3. **Run migrations:**
```bash
npx prisma migrate deploy
npx prisma generate
```

4. **Start development server:**
```bash
npm run dev
```

Access at: http://localhost:3000

---

## Vercel Deployment

### Step 1: Create Vercel Project
```bash
vercel
```

### Step 2: Add Database
In Vercel dashboard:
1. Go to Storage → Create Database → Postgres
2. Copy `DATABASE_URL` to environment variables

### Step 3: Deploy
```bash
vercel --prod
```

---

## First Import

1. Navigate to **Import Package** tab
2. Upload your CFV Vision Session ZIP file
3. System will:
   - Preserve original ZIP
   - Generate unique session ID (CFV-VS-00001)
   - Create default 58-item checklist
   - Initialize publishing matrix
   - Create import log

4. View session in Dashboard or All Sessions

---

## Usage

### Dashboard
- View stats (Total, In Progress, Ready to Publish, Published)
- See recent sessions
- Quick access to any session

### Import Package
- Drag & drop ZIP files
- Automatic processing
- Import status & results

### Session Detail View
- 15 tabs for complete content management
- Interactive checklist
- Publishing matrix tracking
- Asset view/copy/download

---

## File Structure

```
cfv-content-engine/
├── app/
│   ├── page.tsx                    # Dashboard
│   ├── import/page.tsx             # Import interface
│   ├── sessions/page.tsx           # All sessions list
│   ├── session/[id]/
│   │   ├── page.tsx                # Session detail
│   │   └── SessionTabs.tsx         # 15-tab interface
│   └── api/
│       └── import/route.ts         # ZIP import API
├── lib/
│   ├── prisma.ts                   # Database client
│   └── checklist-template.ts      # Default 58-item checklist
├── prisma/
│   └── schema.prisma               # Database schema
├── uploads/                        # Original ZIPs (preserved)
└── package.json
```

---

## Integration with MLM Command Center

Add this link to your MLM Command Center navigation:

```html
<a href="https://cfv-content-engine.vercel.app" target="_blank">
  🎬 CFV Content Engine
</a>
```

---

## Support

For issues or questions, check:
- Implementation handoff docs (in `/content-engine-temp/`)
- Database schema (`prisma/schema.prisma`)
- Default checklist (`lib/checklist-template.ts`)
