# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies

```bash
# From project root
npm run install:all
```

### Step 2: Create PostgreSQL Database

```bash
# On macOS with Homebrew PostgreSQL
brew services start postgresql

# Create database
createdb performance_tracker
```

### Step 3: Setup Environment Variables

#### Backend (.env)
```bash
cd backend
cp .env.example .env

# Edit .env:
# DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/performance_tracker
# JWT_SECRET=change_this_to_a_random_long_string_in_production
# PORT=5000
# NODE_ENV=development
```

Get PostgreSQL user info:
```bash
psql -U postgres -c "SELECT current_user;"
```

### Step 4: Initialize Database

```bash
cd backend
npm run migrate
```

You should see: `✓ Database schema created successfully`

### Step 5: Start Everything

From project root:
```bash
npm run dev
```

This will start:
- Backend on http://localhost:5000
- Frontend on http://localhost:5173

### Step 6: Test the App

1. Open http://localhost:5173 in browser
2. Register a new account
3. Add a task
4. See it in your dashboard

## Common Issues

### "Database connection error"
```bash
# Check PostgreSQL is running
psql postgres

# If connection refused, start it:
brew services start postgresql
```

### "Cannot find module 'pg'"
```bash
cd backend
npm install
```

### "Port 5000 already in use"
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

## Next Steps

- Read `README.md` for full documentation
- Check `backend/schema.sql` to understand database structure
- Review API endpoints in `backend/src/routes/`
- Customize appearance in `frontend/src/components/PerformanceTracker.jsx`

## Production Checklist

Before deploying:
- [ ] Change JWT_SECRET to long random string
- [ ] Set NODE_ENV=production
- [ ] Use strong database password
- [ ] Enable HTTPS
- [ ] Set CORS origin to production domain
- [ ] Run security audit: `npm audit`
