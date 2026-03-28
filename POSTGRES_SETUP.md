# LOCAL SETUP - WAIT FOR POSTGRESQL

Since PostgreSQL is still installing, here's what to do next:

## Step 1: Wait for PostgreSQL Installation
PostgreSQL installation via Homebrew is in progress. This may take a few minutes.

Once complete, you'll see PostgreSQL binaries available at:
```bash
/usr/local/opt/postgresql/bin/
```

## Step 2: Initialize PostgreSQL

After installation completes, run:
```bash
initdb -D /usr/local/var/postgres
```

## Step 3: Start PostgreSQL Service

```bash
brew services start postgresql
```

Verify it's running:
```bash
brew services list | grep postgresql
```

You should see: `postgresql ... started`

## Step 4: Create Database

```bash
cd /Users/techprojects/projects/performance-tracker
createdb performance_tracker
```

## Step 5: Configure Backend Environment

```bash
cd backend
cp .env.example .env

# Edit .env and set:
# DATABASE_URL=postgresql://localhost/performance_tracker
# JWT_SECRET=my-super-secret-key-for-dev
```

## Step 6: Run Migrations

```bash
cd backend
npm run migrate
```

You should see:
```
✓ Database schema created successfully
```

## Step 7: Start Everything

From project root:
```bash
npm run dev
```

This will start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

## If PostgreSQL Installation is Taking Too Long

Try installing it directly:
```bash
/usr/local/bin/brew install postgresql@15
```

Or use an alternative like:
- Docker (if you have it): `docker run -e POSTGRES_PASSWORD=secret -p 5432:5432 postgres`
- Or skip for now and read the documentation

## Troubleshooting

If you get "command not found: createdb":
1. PostgreSQL is still installing
2. OR you need to add PostgreSQL to PATH:
   ```bash
   export PATH="/usr/local/opt/postgresql/bin:$PATH"
   ```

## Documentation

While waiting, you can read:
- START_HERE.md - Project overview
- QUICKSTART.md - Detailed setup guide
- README.md - Full documentation
