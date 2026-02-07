# 🚀 Hermes Deployment - Vercel + Render (Like LedgerKnight)

## Deployment Strategy (Same as LedgerKnight)

- **Frontend** → Vercel (React only)
- **Backend** → Render (Express API)
- **Database** → MongoDB Atlas

This is the EXACT same approach as LedgerKnight.

---

## Step 1: MongoDB Atlas (5 min)

1. Go to https://mongodb.com/cloud/atlas
2. Create FREE M0 cluster
3. Create user: `hermes-admin` with password (SAVE IT!)
4. Network: Allow 0.0.0.0/0
5. Get connection string:
```
mongodb+srv://hermes-admin:PASSWORD@cluster.xxxxx.mongodb.net/
```

---

## Step 2: Deploy Backend on Render (10 min)

1. Go to https://render.com → Sign in with GitHub
2. **New +** → **Web Service**
3. Connect repository: `jeevapriyan10/Hermes`
4. **Configure:**

   - **Name**: `hermes-backend`
   - **Region**: Singapore
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance**: Free

5. **Environment Variables:**

```
PORT=4000
NODE_ENV=production
MONGO_URI=mongodb+srv://hermes-admin:YOUR_PASSWORD@cluster.xxxxx.mongodb.net/
MONGO_DB_NAME=hermes_ai
GEMINI_API_KEY=AIzaSyBUyiN9VAQDJjdq-l7KYaGp_OFbcpd1tkw
CORS_ORIGIN=*
```

6. Click **Create Web Service**
7. Wait ~5 min, note URL: `https://hermes-backend.onrender.com`
8. Test: Visit `https://hermes-backend.onrender.com/health`

---

## Step 3: Deploy Frontend on Vercel (5 min)

1. Go to https://vercel.com → Sign in with GitHub
2. **New Project** → Import `jeevapriyan10/Hermes`
3. **Configure:**

   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables:**

```
VITE_BACKEND_URL=https://hermes-backend.onrender.com
VITE_API_URL=https://hermes-backend.onrender.com/api
```

5. Click **Deploy**
6. Wait ~2 min, note URL: `https://hermes-xxx.vercel.app`

---

## Step 4: Update CORS (2 min)

1. Go to Render → `hermes-backend` → Environment
2. Update `CORS_ORIGIN` to: `https://hermes-xxx.vercel.app`
3. Save (auto-redeploys)

---

## ✅ Done!

**Frontend**: https://hermes-xxx.vercel.app
**Backend**: https://hermes-backend.onrender.com

Test all features:
- ✅ Fact-check
- ✅ Feed
- ✅ Trending
- ✅ CSV Export

---

## Auto-Deploy

Every `git push` triggers:
- Vercel: Frontend redeploy (~30 sec)
- Render: Backend redeploy (~5 min)

**EXACT same as LedgerKnight!**
