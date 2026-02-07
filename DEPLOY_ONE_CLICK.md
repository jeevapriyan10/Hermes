# 🚀 ONE-CLICK Vercel Deployment (Like LedgerKnight)

Deploy the entire app (frontend + backend) on Vercel with ONE click!

---

## 📋 Prerequisites

1. MongoDB Atlas account (free) - https://mongodb.com/cloud/atlas
2. Gemini API key - https://aistudio.google.com/apikey
3. Vercel account - https://vercel.com

---

## ⚡ Quick Deploy (5 minutes)

### Step 1: MongoDB Atlas (2 min)
1. Create FREE cluster
2. Create user: `hermes-admin` + password
3. Network Access: Allow 0.0.0.0/0
4. Copy connection string: `mongodb+srv://hermes-admin:PASSWORD@...`

### Step 2: Deploy on Vercel (3 min)
1. Go to https://vercel.com
2. Click **"Import Project"**
3. Import: `https://github.com/jeevapriyan10/Hermes`
4. **Root Directory**: Leave as `./` (monorepo)
5. Click **"Deploy"** 

### Step 3: Add Environment Variables
In Vercel deployment page, add:

```
PORT=4000
NODE_ENV=production
MONGO_URI=mongodb+srv://hermes-admin:YOUR_PASSWORD@cluster.xxxxx.mongodb.net/
MONGO_DB_NAME=hermes_ai
GEMINI_API_KEY=AIzaSyBUyiN9VAQDJjdq-l7KYaGp_OFbcpd1tkw
CORS_ORIGIN=*
VITE_BACKEND_URL=
VITE_API_URL=/api
```

**Important**: Leave `VITE_BACKEND_URL` EMPTY!

### Step 4: Redeploy
Click "Redeploy" to apply environment variables.

---

## ✅ Done!

Your app is live at: `https://hermes-xxx.vercel.app`

- Frontend: `https://hermes-xxx.vercel.app`
- API: `https://hermes-xxx.vercel.app/api`
- Health: `https://hermes-xxx.vercel.app/health`

---

## 🔄 Auto-Deploy

Every `git push` automatically triggers Vercel redeploy!

---

## 📝 Environment Variables

| Variable | Value |
|----------|-------|
| PORT | 4000 |
| NODE_ENV | production |
| MONGO_URI | mongodb+srv://... |
| MONGO_DB_NAME | hermes_ai |
| GEMINI_API_KEY | AIza... |
| CORS_ORIGIN | * |
| VITE_BACKEND_URL | (empty) |
| VITE_API_URL | /api |

---

**EXACTLY like LedgerKnight - ONE deployment, everything works!** 🎉
