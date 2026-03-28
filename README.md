# Performance Tracker - Full Stack Application

A complete performance review tracking application with React frontend, Node.js backend, PostgreSQL database, and JWT authentication.

## Project Structure

```
performance-tracker/
├── backend/
│   ├── src/
│   │   ├── server.js                 # Main Express server
│   │   ├── db.js                     # PostgreSQL connection
│   │   ├── migrate.js                # Database migration script
│   │   ├── middleware/
│   │   │   └── auth.js               # JWT verification middleware
│   │   ├── models/
│   │   │   ├── User.js               # User model with auth
│   │   │   └── Task.js               # Task model with CRUD
│   │   └── routes/
│   │       ├── auth.js               # Register/Login routes
│   │       └── tasks.js              # Task CRUD routes
│   ├── schema.sql                    # Database schema
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── main.jsx                  # React entry point
│   │   ├── App.jsx                   # Main app component with auth flow
│   │   ├── components/
│   │   │   └── PerformanceTracker.jsx # Main tracker component
│   │   ├── pages/
│   │   │   └── LoginPage.jsx         # Auth page
│   │   ├── hooks/
│   │   │   ├── useAuth.js            # Auth hook
│   │   │   └── useTasks.js           # Tasks API hook
│   │   └── utils/
│   │       └── api.js                # Axios API client
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Database Schema

The application uses PostgreSQL with the following tables:

- **users**: User accounts with email, password hash, name, role
- **tasks**: Performance tasks with all tracking fields
- **task_comments**: Collaboration/feedback on tasks
- **review_sessions**: Tracks review cycles and status

## Quick Start

### Prerequisites

- Node.js 16+ & npm
- PostgreSQL 12+
- Git

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb performance_tracker

# Run migrations
cd backend
npm install
npm run migrate
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/performance_tracker
# JWT_SECRET=your_super_secret_key_change_in_production

# Start backend (development with auto-reload)
npm run dev

# Backend runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start frontend (development)
npm run dev

# Frontend runs on http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user (requires token)

### Tasks (all require JWT token)
- `GET /api/tasks` - Get all user's tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/quarter/:quarter` - Get tasks by quarter
- `GET /api/tasks/stats/overview` - Get task statistics

## Authentication Flow

1. User registers or logs in via frontend
2. Backend validates credentials and generates JWT token
3. Token stored in localStorage on client
4. All API requests include `Authorization: Bearer <token>` header
5. Backend verifies token before processing requests
6. Expired tokens trigger logout and redirect to login

## Features

### Core Features
- ✅ User registration and login with JWT
- ✅ Create, read, update, delete tasks
- ✅ Task categorization (Status, Priority, PIE, Quarter)
- ✅ Quantifiable impact tracking
- ✅ Skills demonstrated tracking
- ✅ Evidence and feedback documentation
- ✅ Performance metrics dashboard
- ✅ Quarterly breakdown views
- ✅ Brag doc generation

### Security
- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation with express-validator
- ✅ User data isolation (can only access own tasks)

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/performance_tracker
JWT_SECRET=your_secret_key_min_32_chars_in_production
PORT=5000
NODE_ENV=development
```

### Frontend (optional)
- VITE runs with API proxy to http://localhost:5000/api

## Production Deployment

### Backend (Railway, Render, or Heroku)
1. Push code to Git
2. Set environment variables on platform
3. Deploy
4. Database migrations run automatically

### Frontend (Vercel, Netlify)
1. Push code to Git
2. Set `VITE_API_URL` environment variable
3. Deploy
4. Frontend automatically builds with Vite

## Development Notes

### Adding New Features
1. Create database schema changes in `schema.sql`
2. Add model methods in backend models
3. Add API routes in backend routes
4. Create hooks in frontend for API calls
5. Build UI components using existing patterns

### Common Tasks
- **Reset database**: `dropdb performance_tracker && createdb performance_tracker && npm run migrate`
- **Check API**: `curl http://localhost:5000/health`
- **Debug queries**: Add `console.log()` in src/db.js query method

## Troubleshooting

### Database connection errors
- Check PostgreSQL is running: `psql --version`
- Verify DATABASE_URL in .env
- Check credentials match PostgreSQL user

### Auth errors
- Ensure JWT_SECRET is set in .env
- Clear localStorage and try login again
- Check token expiration (set to 7 days)

### API not responding
- Check backend is running on port 5000
- Verify CORS settings in server.js
- Check network tab in browser dev tools

## Support

For issues or questions, check:
1. Environment variables are set correctly
2. Both backend and frontend are running
3. Database is created and migrated
4. Ports 5000 and 5173 are available
