# CFV Content Engine - Quick Start

## 🚀 Production URL
**https://cfv-content-engine.vercel.app**

---

## 📥 Import a Vision Session

1. Go to: https://cfv-content-engine.vercel.app/import
2. Upload a ZIP file (format: `CFV_VS_00001_Title.zip`)
3. Wait for import to complete
4. Click "View Session"

**Expected ZIP structure:**
- `00_Manifest/manifest.json`
- `01_Overview/` 
- `02_Transcript/`
- `12_Visual_Assets/` (images auto-upload to Vercel Blob)

---

## 📊 Dashboard

**URL:** https://cfv-content-engine.vercel.app

Shows:
- Total sessions count
- Status breakdown (Draft, In Progress, Published)
- Founder Pathway progress
- Recent sessions

---

## 🔧 Common Tasks

### Replace a Session Package:
1. Go to session detail page
2. Click "🔄 Replace Package" button
3. Upload new ZIP
4. Existing session updated (keeps same ID)

### Edit Session Details:
1. Go to session detail page
2. Click "📝 Edit Session Details"
3. Modify fields
4. Changes save automatically

### Export Session:
1. Go to session detail page
2. Click "💾 Export ZIP"
3. Downloads complete package

### Delete Session:
```bash
curl -X DELETE https://cfv-content-engine.vercel.app/api/session/{SESSION_ID}/delete
```

---

## 🖼️ Image Storage

**How it works:**
- Images upload to Vercel Blob during import
- Stored permanently (not ephemeral)
- Served from CDN
- Free tier: 5GB storage, 100K operations/month

**Check blob store:**
```bash
npx vercel blob list-stores
```

---

## 🛠️ Deployment

**Deploy changes:**
```bash
cd /root/.openclaw/workspace/cfv-content-engine
git add -A
git commit -m "Your changes"
export VERCEL_TOKEN=<token>
npx vercel deploy --prod --yes
```

---

## 📍 Key URLs

- **Dashboard:** https://cfv-content-engine.vercel.app
- **Import:** https://cfv-content-engine.vercel.app/import
- **All Sessions:** https://cfv-content-engine.vercel.app/sessions
- **Vercel Dashboard:** https://vercel.com/marketleveragingmedia-cmds-projects/cfv-content-engine

---

## 📞 Quick Help

**Check if system is working:**
```bash
curl https://cfv-content-engine.vercel.app/api/sessions
```

**View full documentation:**
- `PROJECT-OVERVIEW.md` (complete technical docs)
- `SETUP-BLOB-STORAGE.txt` (Blob storage setup)

---

## ✅ Health Check

**All systems operational:**
- ✅ Production deployment
- ✅ Database connection
- ✅ Blob storage
- ✅ Image uploads
- ✅ Import/Export

**Last verified:** July 5, 2026
