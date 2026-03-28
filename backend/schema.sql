-- ─── Users Table ───────────────────────────────────────────────────────────
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  manager_email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user', -- 'user', 'manager', 'director', 'exec'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Tasks Table ───────────────────────────────────────────────────────────
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL, -- 'Not Started', 'In Progress', 'Blocked', 'Done'
  priority VARCHAR(20) NOT NULL, -- 'High', 'Medium', 'Low'
  pie VARCHAR(50) NOT NULL, -- 'Performance', 'Image', 'Exposure'
  quarter VARCHAR(10) NOT NULL, -- 'Q1', 'Q2', 'Q3', 'Q4'
  review_period VARCHAR(50), -- 'Mid-Year', 'Annual', 'Both'
  requestor VARCHAR(255),
  objective VARCHAR(500),
  impact TEXT,
  visibility VARCHAR(100), -- 'Manager Only', 'Director', 'VP', 'Exec/C-Suite', 'Cross-functional'
  evidence TEXT,
  feedback TEXT,
  skills TEXT, -- JSON array stored as string
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Task Comments Table (for collaboration) ─────────────────────────────
CREATE TABLE task_comments (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Review Sessions Table (for tracking review cycles) ──────────────────
CREATE TABLE review_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  quarter VARCHAR(10) NOT NULL,
  year INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'in-progress', -- 'in-progress', 'submitted', 'reviewed', 'completed'
  submitted_at TIMESTAMP,
  reviewed_at TIMESTAMP,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, quarter, year)
);

-- ─── Indexes for performance ───────────────────────────────────────────────
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_quarter ON tasks(quarter);
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_task_comments_user_id ON task_comments(user_id);
CREATE INDEX idx_review_sessions_user_id ON review_sessions(user_id);
CREATE INDEX idx_review_sessions_reviewer_id ON review_sessions(reviewer_id);
