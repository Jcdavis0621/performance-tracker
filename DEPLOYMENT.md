# Deployment Guide

## Production Architecture

```
Internet
    ↓
Frontend (Vercel/Netlify)
    ↓
API Gateway (optional)
    ↓
Backend (Railway/Render)
    ↓
PostgreSQL (Cloud Managed)
```

## Backend Deployment (Railway.app)

Railway is recommended for its simplicity and PostgreSQL support.

### 1. Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

### 2. Create New Project
- Click "New Project" → "Deploy from GitHub"
- Select your `performance-tracker` repository
- Choose `backend` directory

### 3. Add PostgreSQL
- In Railway dashboard: Add → Database → PostgreSQL
- Railway automatically creates and links the database
- Copy the database URL for next step

### 4. Set Environment Variables
In Railway dashboard for your backend service:
```
DATABASE_URL=postgresql://[auto-generated-url]
JWT_SECRET=[generate-long-random-string]
NODE_ENV=production
PORT=5000
```

To generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Deploy
- Commit changes: `git push`
- Railway auto-deploys on push
- Check logs for "✓ Server running on"

### 6. Get Backend URL
- In Railway dashboard, find the generated domain
- Example: `https://performance-tracker-backend-production.up.railway.app`

## Frontend Deployment (Vercel)

### 1. Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub

### 2. Create New Project
- Click "New Project"
- Select your `performance-tracker` GitHub repository
- Choose `frontend` as root directory

### 3. Configure Build
Vercel auto-detects Vite, but set explicitly:
```
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

### 4. Set Environment Variables
In Vercel project settings → Environment Variables:
```
VITE_API_URL=https://your-railway-backend-url
```

### 5. Deploy
- Click "Deploy"
- Vercel auto-deploys on push to main branch
- Get your frontend URL (e.g., `https://performance-tracker.vercel.app`)

## Database Migration (Production)

When you update schema.sql, run migration:

```bash
# From your local machine with production DATABASE_URL
export DATABASE_URL=postgresql://prod_user:prod_pass@prod_host/performance_tracker
npm run migrate
```

Or via SSH to production server:
```bash
ssh user@server
cd performance-tracker/backend
npm run migrate
```

## Monitoring & Maintenance

### Check Backend Health
```bash
curl https://your-railway-backend-url/health
```

Should return:
```json
{"status": "OK"}
```

### View Logs

**Backend (Railway)**:
- Dashboard → Deployments → Logs tab
- Real-time streaming logs

**Frontend (Vercel)**:
- Dashboard → Deployments → Logs tab
- Error logs and build info

### Performance Monitoring

Consider adding APM (Application Performance Monitoring):
- **Sentry** (error tracking)
- **Datadog** (full monitoring)
- **LogRocket** (frontend performance)

Setup Sentry for backend:
```bash
npm install @sentry/node
```

## Security Checklist

- [ ] JWT_SECRET is 32+ characters, random
- [ ] Database password is strong
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Set CORS origin to production domain only
- [ ] Disable debug mode in production
- [ ] Run `npm audit` before deployment
- [ ] Setup automated backups for database
- [ ] Enable database encryption at rest
- [ ] Use environment variables for secrets
- [ ] Setup rate limiting on API

Add rate limiting to backend:

```bash
npm install express-rate-limit
```

```javascript
// In server.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Scaling Considerations

### When to Scale Up

1. **Database**: If > 100K tasks, enable read replicas
2. **Backend**: If > 1000 concurrent users, add load balancing
3. **Frontend**: Already globally distributed on Vercel

### Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX idx_tasks_user_quarter ON tasks(user_id, quarter);
CREATE INDEX idx_tasks_created_recent ON tasks(created_at DESC);

-- Monitor slow queries
EXPLAIN ANALYZE SELECT * FROM tasks WHERE user_id = 1;
```

## Backup Strategy

### Database Backups
- Railway: Automatic daily backups
- Download backups:
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Code Backups
- GitHub is your backup
- Tag releases: `git tag -a v1.0.0`

## Rollback Plan

If deployment breaks:

**Backend (Railway)**:
- Dashboard → Deployments → Select previous deployment → "Revert"

**Frontend (Vercel)**:
- Dashboard → Deployments → Select previous → "Rollback to this"

**Database**:
- Manual rollback using backup SQL file
- Keep schema versions in `schema_v1.sql`, `schema_v2.sql`

## Cost Estimates (Monthly)

- **Railway Backend**: $5-20 (Pay-as-you-go)
- **Railway PostgreSQL**: $15+ (512MB minimum)
- **Vercel Frontend**: $0-20 (Free tier available)
- **Custom Domain**: $1-10
- **Total Estimate**: $20-50/month for small teams

## Custom Domain Setup

1. Buy domain (Namecheap, Google Domains)
2. Vercel: Settings → Domains → Add domain
3. Update nameservers at registrar
4. Railway: Add custom domain to backend
5. Backend must support custom domain via environment variable

## Support Resources

- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs
- PostgreSQL backups: https://www.postgresql.org/docs/current/backup.html
