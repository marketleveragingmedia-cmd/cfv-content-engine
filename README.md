# 🎬 Cash Flow Visionaries Content Engine

Vision Session management, content production, and publishing workflow automation.

---

## 🌐 Production

**Live URL:** [cfv-content-engine.vercel.app](https://cfv-content-engine.vercel.app)

**Status:** 🟢 All Systems Operational

---

## 📚 Documentation

- **[QUICK-START.md](./QUICK-START.md)** - Common tasks and quick reference
- **[PROJECT-OVERVIEW.md](./PROJECT-OVERVIEW.md)** - Complete technical documentation
- **[SETUP-BLOB-STORAGE.txt](./SETUP-BLOB-STORAGE.txt)** - Vercel Blob setup guide

---

## ✨ Features

- 📥 **Import** Vision Session ZIP packages
- 🔄 **Replace** existing sessions with updated content
- 🖼️ **Visual Assets** with persistent cloud storage (Vercel Blob)
- ✅ **Checklists** for progress tracking
- 📊 **Publishing Matrix** for multi-platform management
- 💾 **Export** complete session packages
- 📱 **Responsive** mobile-friendly interface

---

## 🚀 Quick Start

### Import a Session:
1. Go to [/import](https://cfv-content-engine.vercel.app/import)
2. Upload ZIP package
3. View imported session

### View All Sessions:
[Dashboard](https://cfv-content-engine.vercel.app) | [All Sessions](https://cfv-content-engine.vercel.app/sessions)

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16.2.10 (App Router + Turbopack)
- **Database:** PostgreSQL (Vercel Postgres)
- **Storage:** Vercel Blob (persistent images)
- **Hosting:** Vercel
- **ORM:** Prisma 5.22.0

---

## 📦 Project Structure

```
cfv-content-engine/
├── app/              # Next.js App Router pages & API
├── lib/              # Business logic & utilities
├── prisma/           # Database schema
├── components/       # Shared React components
└── public/           # Static assets
```

---

## 💾 Data Storage

- **Database:** PostgreSQL (session metadata, checklists, publishing status)
- **Images:** Vercel Blob (persistent cloud storage, CDN-delivered)
- **Cost:** Free tier (5GB storage, 100K operations/month)

---

## 🔧 Maintenance

**Check system health:**
```bash
curl https://cfv-content-engine.vercel.app/api/sessions
```

**Deploy updates:**
```bash
npx vercel deploy --prod --yes
```

---

## 📊 Current Status

- **Sessions:** 1 active
- **Images:** Persistent storage operational
- **Deployments:** Auto-deploy enabled
- **Last Updated:** July 5, 2026

---

## 📞 Support

- **Vercel Dashboard:** [Project Settings](https://vercel.com/marketleveragingmedia-cmds-projects/cfv-content-engine)
- **Documentation:** See `PROJECT-OVERVIEW.md` for complete details

---

Built with ❤️ for Cash Flow Visionaries
# Auto-deployment test
