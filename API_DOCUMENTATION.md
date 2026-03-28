# Performance Tracker API Documentation

## Base URL

- **Development:** `http://localhost:5001/api`
- **Production:** `https://api.yourdomain.com/api`

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>
```

## Endpoints

### Auth Endpoints

#### Register

Create a new user account.

```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400 Bad Request` - Invalid email or password < 8 chars
- `409 Conflict` - Email already registered

---

#### Login

Authenticate and receive a JWT token.

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `401 Unauthorized` - Invalid email or password

---

#### Get Current User

Retrieve authenticated user info.

```
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}
```

**Errors:**
- `401 Unauthorized` - Invalid or missing token

---

### Task Endpoints

#### Get All Tasks

Fetch all tasks for the authenticated user.

```
GET /tasks
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "Led sprint planning",
    "description": "Organized Q1 sprint planning with team",
    "status": "Done",
    "priority": "High",
    "pie": "Performance",
    "quarter": "Q1",
    "review_period": "Mid-Year",
    "requestor": "Manager Name",
    "objective": "Ensure smooth sprint kickoff",
    "impact": "Reduced planning time by 30%",
    "visibility": "Manager Only",
    "evidence": "https://confluence.example.com/...",
    "feedback": "Great job organizing this",
    "skills": ["Leadership", "Communication"],
    "created_at": "2026-03-27T23:53:02.973Z",
    "updated_at": "2026-03-27T23:53:02.973Z"
  }
]
```

**Query Parameters:**
- None (use `/tasks/quarter/:quarter` to filter by quarter)

**Errors:**
- `401 Unauthorized` - Missing or invalid token

---

#### Get Tasks by Quarter

Fetch tasks for a specific quarter.

```
GET /tasks/quarter/:quarter
```

**Parameters:**
- `quarter` - Q1, Q2, Q3, or Q4

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Led sprint planning",
    "status": "Done",
    "quarter": "Q1",
    ...
  }
]
```

---

#### Get Task by ID

Fetch a specific task.

```
GET /tasks/:id
```

**Parameters:**
- `id` - Task ID

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Led sprint planning",
  ...
}
```

**Errors:**
- `404 Not Found` - Task doesn't exist
- `401 Unauthorized` - Invalid token

---

#### Create Task

Create a new task.

```
POST /tasks
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Led sprint planning",
  "description": "Organized Q1 sprint planning with team",
  "status": "Done",
  "priority": "High",
  "pie": "Performance",
  "quarter": "Q1",
  "review_period": "Mid-Year",
  "requestor": "Manager Name",
  "objective": "Ensure smooth sprint kickoff",
  "impact": "Reduced planning time by 30%, saved ~$5K",
  "visibility": "Manager Only",
  "evidence": "https://confluence.example.com/sprint-q1",
  "feedback": "Great job organizing this",
  "skills": ["Leadership", "Communication"]
}
```

**Required Fields:**
- `name`
- `status` (Not Started, In Progress, Blocked, Done)
- `priority` (High, Medium, Low)
- `pie` (Performance, Image, Exposure)
- `quarter` (Q1, Q2, Q3, Q4)

**Response:** `201 Created`
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Led sprint planning",
  ...
  "created_at": "2026-03-27T23:53:02.973Z"
}
```

**Errors:**
- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - Invalid token

---

#### Update Task

Update an existing task.

```
PUT /tasks/:id
```

**Parameters:**
- `id` - Task ID

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:** (partial update, include only fields to update)
```json
{
  "name": "Led sprint planning (updated)",
  "status": "Done",
  "impact": "Reduced planning time by 40%, saved ~$8K"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Led sprint planning (updated)",
  ...
  "updated_at": "2026-03-28T10:15:30.123Z"
}
```

**Errors:**
- `404 Not Found` - Task doesn't exist
- `401 Unauthorized` - Invalid token

---

#### Delete Task

Delete a task.

```
DELETE /tasks/:id
```

**Parameters:**
- `id` - Task ID

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:** `200 OK`
```json
{
  "message": "Task deleted"
}
```

**Errors:**
- `404 Not Found` - Task doesn't exist
- `401 Unauthorized` - Invalid token

---

#### Get Task Stats

Get overview statistics for tasks.

```
GET /tasks/stats/overview
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:** `200 OK`
```json
[
  {
    "status": "Done",
    "count": 5
  },
  {
    "status": "In Progress",
    "count": 2
  },
  {
    "status": "Not Started",
    "count": 1
  },
  {
    "status": "Blocked",
    "count": 0
  }
]
```

---

### System Endpoints

#### Health Check

Check API health (no authentication required).

```
GET /health
```

**Response:** `200 OK`
```json
{
  "status": "OK"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Description of the error"
}
```

### Common HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request body or parameters
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists (e.g., email registered)
- `500 Internal Server Error` - Server error

---

## Rate Limiting

Currently no rate limiting. Production deployments should implement:
- 100 requests/minute per IP
- 1000 requests/hour per user

---

## Data Constraints

### Task Fields

| Field | Type | Constraints |
|-------|------|-------------|
| name | string | 1-500 chars, required |
| description | text | Optional, max 5000 chars |
| status | enum | Not Started, In Progress, Blocked, Done |
| priority | enum | High, Medium, Low |
| pie | enum | Performance, Image, Exposure |
| quarter | enum | Q1, Q2, Q3, Q4 |
| impact | text | Optional, max 2000 chars (use real numbers!) |
| skills | array | Optional, max 10 skills |

---

## Examples

### cURL

**Register:**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Create Task:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X POST http://localhost:5001/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Completed Q1 review",
    "status": "Done",
    "priority": "High",
    "pie": "Performance",
    "quarter": "Q1",
    "impact": "Achieved 110% of goals"
  }'
```

**Get All Tasks:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5001/api/tasks
```

---

## Support

For API issues or questions:
- Check error response for details
- Review server logs: `railway logs` (production)
- Verify authentication token is valid and not expired
- Ensure CORS origin is whitelisted

