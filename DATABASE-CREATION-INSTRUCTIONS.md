# CFV Content Engine - Database Setup (Required)

**Current Status:** Application deployed but non-functional without database.

---

## Why Application Is Not Loading

The CFV Content Engine needs its own dedicated PostgreSQL database. The application is deployed but returns 500 errors because no database is connected.

---

## Create Database (Via Vercel Dashboard)

### Step 1: Access Vercel Dashboard
Go to: https://vercel.com/marketleveragingmedia-cmds-projects/cfv-content-engine

### Step 2: Create Postgres Database
1. Click **Storage** tab
2. Click **Create Database**
3. Select **Postgres**
4. Database name: `cfv-content-engine`
5. Region: **US East (iad1)**
6. Click **Create**

### Step 3: Connect to Project
1. After creation, click **Connect to Project**
2. Select project: `cfv-content-engine`
3. Environment: **All** (Production, Preview, Development)
4. Click **Connect**

This automatically adds these environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `DATABASE_URL`

### Step 4: Initialize Database
After database is connected, visit:
```
https://cfv-content-engine.vercel.app/api/init-db
```

This creates the 5 required tables:
- VisionSession
- Asset
- ChecklistItem
- PublishingMatrixItem
- ImportLog

### Step 5: Verify Application
Visit: https://cfv-content-engine.vercel.app

You should see the empty dashboard (no 500 error).

---

## Alternative: Manual SQL Execution

If the API route fails, run this SQL directly in Vercel Postgres dashboard:

```sql
-- Located at: /root/.openclaw/workspace/cfv-content-engine/scripts/init-db.sql
```

Copy the entire contents of that file and execute in the Postgres query interface.

---

## Why This Wasn't Automated

Vercel Storage API does not support programmatic Postgres database creation. It requires:
1. Manual dashboard interaction to create the database
2. Manual connection to the project

This is a Vercel platform limitation, not a deployment failure.

---

## After Database Is Connected

The application will be fully functional:
1. Dashboard displays (empty state)
2. Import page accepts ZIP uploads
3. Sessions are created and stored
4. All 15 tabs render properly
5. Checklist tracks progress
6. Publishing matrix operational

---

## Estimated Time

- Database creation: 2 minutes
- Connection to project: 30 seconds
- Table initialization: 10 seconds
- **Total: ~3 minutes**

---

## Notes

- CFV Content Engine has its OWN database (not shared with Citizen Activation)
- This prevents table name conflicts
- Each app scales independently
- Clean separation of concerns

---

**Once database is created and connected, notify me and I will verify the application is fully operational.**
