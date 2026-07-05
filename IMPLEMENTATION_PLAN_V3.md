# CFV Content Engine v3.0 Implementation Plan
## Manifest-Driven Import & Accurate Asset Counting

### COMPLETED:
✅ Read all documentation from update package
✅ Created manifest-driven ZIP processor (zip-processor-v3.ts)
✅ Updated database schema with new Asset fields
✅ Created asset count utility functions
✅ Updated import API to use v3 processor

### IN PROGRESS - CRITICAL STEPS REMAINING:

#### 1. Update Executive Overview to Display Asset Counts
**File:** `app/session/[id]/ExecutiveOverview.tsx`
**Action:** Add asset count display showing:
- Text Assets: 15
- Visual Assets: 7  
- Primary Assets: 22
- Export Copies: 16 (separate)

#### 2. Delete Old CFV-VS-00001 Session
**Action:** Use existing delete endpoint at session detail page or via API
**URL:** `DELETE /api/session/[id]/delete`

#### 3. Push Database Schema Changes
**Command:** `npx prisma db push` (will push to production Postgres)
**Note:** Must happen before deployment

#### 4. Deploy to Vercel Production
**Command:** `npx vercel deploy --prod --yes`

#### 5. Import Replacement Package
**File:** `/root/.openclaw/workspace/cfv-replacement-session/CFV-VS-00001_Life_Is_Long_COMPLETE_REPLACEMENT_IMPORT_PACKAGE_v3_0.zip`
**Action:** Upload via /import page with "Update Existing" UNCHECKED (new record)

#### 6. Run Acceptance Tests
**Location:** `/root/.openclaw/workspace/cfv-update-package/06_ACCEPTANCE_TESTS.md`

### NEW FILES CREATED:
- `lib/zip-processor-v3.ts` - Manifest-driven importer
- `lib/asset-count-utils.ts` - Asset counting logic
- `prisma/schema.prisma` - Updated with manifest fields

### FILES MODIFIED:
- `app/api/import-zip/route.ts` - Uses v3 processor
- `prisma/schema.prisma` - Added Asset model fields:
  - importDestination (String?)
  - isPrimaryAsset (Boolean, default true)
  - isExportCopy (Boolean, default false)
  - countInPrimaryAssetReadiness (Boolean, default true)
  - fileName (String?)
  - fileSize (Int?)
  - sha256 (String?)
  - version (changed to String)

### EXPECTED FINAL STATE:
**After import of replacement package:**
- Session ID: CFV-VS-00001
- Display Title: "CFV-VS-00001 — Life Is Long"
- Final Title: "Life Is Long | Stop Being Taught to Be Confused"
- Theme: Movement Foundation
- Category: Mindset
- Content Type: Vision Session
- Founder Pathway Stage: Foundation
- **Text Assets: 15**
- **Visual Assets: 7**
- **Primary Assets Total: 22**
- **Export Copies: 16**
- Dashboard shows: 1 Total, 1 In Progress, 0 Ready, 0 Published

### CRITICAL REQUIREMENTS:
❌ Do NOT count files in 14_Exports/ as primary assets
❌ Do NOT use placeholder "Missing" states when manifest file exists
❌ Do NOT use lion logo or invent logos
✅ DO use manifest as source of truth
✅ DO respect is_primary_asset and count_in_primary_asset_readiness flags
✅ DO upload images to Vercel Blob for persistence
