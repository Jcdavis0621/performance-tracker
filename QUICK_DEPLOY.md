# 🚀 Quick Start: Deploy to Production in 20 Minutes

This guide takes you from code to live in production using Railway + GitHub Actions.

## Prerequisites

- GitHub account
- Railway account (free trial, no CC required)
- Domain name (optional, Railway provides free subdomain)
- 15 minutes

---

## Step 1: Push Code to GitHub (2 min)

```bash
cd /Users/techprojects/projects/performance-tracker

git init
git add .
git commit -m "Initial commit: Performance Tracker app"
git branch -M main
git remote add origin https://github.com/Jcdavis0621/performance-tracker.git
git push -u origin main
```

---

## Step 2: Set Up Railway (5 min)

### 2.1 Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **GitHub Repo** → Select your repo
3. Railway auto-creates a project folder

### 2.2 Add PostgreSQL

1. In Railway dashboard → **+ New** → **Database** → **PostgreSQL**
2. Railway auto-provisions and sets `DATABASE_URL` env var
3. Done! DB is ready.

### 2.3 Configure Backend Service

1. Select the backend service
2. Set environment variables:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `[generate-strong-random-string]` (use 32+ chars)
   - `PORT` = `5000`
3. Railway auto-reads `DATABASE_URL` from PostgreSQL
4. Click **Deploy**

### 2.4 Get Backend URL

After deploy:
1. Click backend service
2. Under **Deployments**, copy the domain: `your-backend-xxxxx.railway.app`
3. Save this URL

---

## Step 3: Deploy Frontend to Vercel (3 min)

### 3.1 Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click **Import Project**
3. Select GitHub repo
4. Root dir: `frontend`

### 3.2 Set Environment Variables

1. **Environment Variables** section:
   - `VITE_API_URL` = `https://your-backend-xxxxx.railway.app/api`
2. Click **Deploy**

### 3.3 Get Frontend URL

After deploy:
- Vercel provides a domain: `your-frontend-xxxxx.vercel.app`
- Save this URL

---

## Step 4: Update CORS (2 min)

### 4.1 Update backend CORS

In your local `backend/src/server.js`, replace the CORS origin:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.CORS_ORIGIN || 'https://your-frontend-xxxxx.vercel.app']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
```

### 4.2 Add env var in Railway

In Railway dashboard → Backend service → Variables:
- `CORS_ORIGIN` = `https://your-frontend-xxxxx.vercel.app`

### 4.3 Redeploy backend

Push to GitHub:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Railway auto-redeploys.

---

## Step 5: Set Up GitHub Actions for CI/CD (3 min)

### 5.1 Create GitHub Secrets

1. GitHub repo → **Settings** → **Secrets and variables** → **New repository secret**

Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `RAILWAY_TOKEN` | From Railway: Account → API Tokens → Create |
| `RAILWAY_BACKEND_SERVICE_ID` | From Railway: Backend service → ID (shown in URL) |
| `VERCEL_TOKEN` | From Vercel: Account → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | From Vercel: Account → Settings → General → Copy Org ID |
| `VERCEL_PROJECT_ID` | From Vercel: Project → Settings → General → Copy Project ID |
| `SLACK_WEBHOOK_URL` | (Optional) From Slack: Create incoming webhook |

### 5.2 Push the workflow

The `.github/workflows/deploy.yml` is already in the repo. Just push:

```bash
git push
```

GitHub Actions automatically runs tests and deploys on every push to `main`.

---

## Step 6: Custom Domain (Optional, 3 min)

### 6.1 Point domain to Railway (Backend)

1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Railroad dashboard → Backend → **Settings** → **Custom Domain**
3. Enter `api.yourdomain.com`
4. Add DNS records shown (CNAME to Railway)
5. Wait 5-10 min for DNS propagation

### 6.2 Point domain to Vercel (Frontend)

1. In Vercel dashboard → Project → **Settings** → **Domains**
2. Enter `yourdomain.com`
3. Add DNS records shown
4. SSL auto-provisioned ✅

---

## Step 7: Test End-to-End (3 min)

### 7.1 Frontend

Open `https://your-frontend-xxxxx.vercel.app` or `https://yourdomain.com`

You should see the login page.

### 7.2 Create Account

1. Click "Create Account"
2. Fill in name, email, password
3. Click "Create Account"

### 7.3 Verify Data is Saved

1. You should be logged in
2. Click **Add Task**
3. Fill in task details
4. Click **Add Task**
5. Task appears in list ✅

### 7.4 Check Backend

Open `https://your-backend-xxxxx.railway.app/health`

Should return:
```json
{"status":"OK"}
```

---

## Step 8: Set Up Monitoring (2 min)

### 8.1 Health Checks with UptimeRobot

1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Create account
3. Monitor → New Monitor
4. Monitor Type: **HTTP(s)**
5. URL: `https://api.yourdomain.com/health`
6. Interval: 5 minutes
7. Alerts: Get email if down
8. Click "Create Monitor"

### 8.2 Error Tracking with Sentry (Optional)

1. Go to [sentry.io](https://sentry.io)
2. Create project → Node.js
3. Copy DSN
4. Add to Railway env vars:
   - `SENTRY_DSN` = (your DSN)
5. Redeploy

---

## ✅ You're Live!

Your app is now:
- ✅ Running in production
- ✅ Auto-deploying on `git push`
- ✅ Monitoring via UptimeRobot
- ✅ Tracking errors via Sentry (optional)
- ✅ Backed by PostgreSQL
- ✅ Using JWT auth
- ✅ HTTPS + SSL

---

## 🔄 Deployment Workflow

From now on:

1. Make changes locally
2. Test: `npm run dev` (backend) + `npm run dev` (frontend)
3. Push: `git add . && git commit -m "..." && git push`
4. GitHub Actions runs tests
5. If tests pass → Auto-deploys to Railway + Vercel
6. Deployed! 🎉

---

## 🆘 Troubleshooting

### Frontend shows blank page

Check browser console for errors. Verify `VITE_API_URL` env var is set in Vercel.

### Login fails with CORS error

1. Verify `CORS_ORIGIN` env var in Railway matches frontend URL
2. Redeploy backend: `git push`

### Tasks aren't saving

1. Check backend logs: Railway dashboard → Backend → Logs
2. Check database: Railway → PostgreSQL → Credentials → Connect

### CI/CD not running

1. Check GitHub Actions: Repo → Actions tab
2. Verify secrets are set: Settings → Secrets
3. Check `.github/workflows/deploy.yml` syntax

---

## 📚 Documentation

- [DEPLOY_TO_PRODUCTION.md](./DEPLOY_TO_PRODUCTION.md) - Full deployment guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - All API endpoints
- [README.md](./README.md) - Project overview

---

## 🎯 Next Steps

Now that you're live:

1. **Test with real users** - Get feedback
2. **Monitor performance** - Watch logs and metrics
3. **Iterate** - Fix bugs, add features
4. **Scale** - Add caching, CDN, etc. when needed

Congrats on shipping! 🚀

