# GeneSys Backend API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register Teacher
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "email": "juan.delacruz@school.edu.ph",
  "password": "SecurePass123",
  "school": "Puerto Galera National High School",
  "department": "Science Department"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Teacher registered successfully",
  "data": {
    "id": "65f1234567890abcdef12345",
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "email": "juan.delacruz@school.edu.ph",
    "school": "Puerto Galera National High School",
    "department": "Science Department",
    "role": "teacher"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login Teacher
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan.delacruz@school.edu.ph",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Current Teacher Profile
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Juan Miguel",
  "school": "Updated School Name"
}
```

### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass456"
}
```

---

## 📝 Question Endpoints

### Create Question
```http
POST /api/questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionText": "What is the basic unit of life?",
  "questionType": "multiple-choice",
  "choices": [
    { "text": "Cell", "isCorrect": true },
    { "text": "Tissue", "isCorrect": false },
    { "text": "Organ", "isCorrect": false },
    { "text": "Organism", "isCorrect": false }
  ],
  "topic": "Genetic Engineering",
  "difficulty": "easy",
  "points": 1,
  "explanation": "The cell is the smallest unit of life that can function independently."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Question created successfully",
  "data": {
    "_id": "65f1234567890abcdef12345",
    "questionText": "What is the basic unit of life?",
    "questionType": "multiple-choice",
    "choices": [...],
    "topic": "Genetic Engineering",
    "difficulty": "easy",
    "points": 1,
    "teacher": "65f0987654321fedcba09876",
    "createdAt": "2025-11-09T10:30:00.000Z"
  }
}
```

### Get All Questions
```http
GET /api/questions?topic=Evolution&difficulty=medium&page=1&limit=20
Authorization: Bearer <token>
```

**Query Parameters:**
- `topic` (optional): Filter by topic
- `difficulty` (optional): easy, medium, hard
- `questionType` (optional): Question type filter
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 15,
  "total": 45,
  "page": 1,
  "pages": 3,
  "data": [ ... ]
}
```

### Get Single Question
```http
GET /api/questions/:id
Authorization: Bearer <token>
```

### Update Question
```http
PUT /api/questions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionText": "Updated question text",
  "difficulty": "hard"
}
```

### Delete Question
```http
DELETE /api/questions/:id
Authorization: Bearer <token>
```

### Get Questions by Topic
```http
GET /api/questions/topic/Evolution
Authorization: Bearer <token>
```

---

## 🏠 Room Endpoints

### Create Room
```http
POST /api/rooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "General Biology Midterm Exam",
  "description": "Covers topics from Genetic Engineering to Evolution",
  "questions": ["65f1234...", "65f5678..."],
  "settings": {
    "timeLimit": 60,
    "shuffleQuestions": true,
    "shuffleChoices": true,
    "showResultsImmediately": false,
    "allowReview": true,
    "maxStudents": 50,
    "requiredFields": {
      "name": true,
      "lrn": true,
      "section": true,
      "email": false
    }
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "_id": "65f9876543210fedcba09876",
    "roomCode": "ABC123",
    "title": "General Biology Midterm Exam",
    "status": "draft",
    "expiresAt": "2025-11-10T10:30:00.000Z",
    ...
  }
}
```

### Get All Rooms
```http
GET /api/rooms?status=active&page=1&limit=20
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): draft, active, closed, expired
- `page` (optional): Page number
- `limit` (optional): Items per page

### Get Single Room
```http
GET /api/rooms/:id
Authorization: Bearer <token>
```

### Get Room by Code (Public - for students)
```http
GET /api/rooms/join/ABC123
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "roomCode": "ABC123",
    "title": "General Biology Midterm Exam",
    "description": "...",
    "teacher": { "firstName": "Juan", "lastName": "Dela Cruz" },
    "settings": { ... },
    "questions": [ ... ],
    "questionCount": 20
  }
}
```

### Update Room
```http
PUT /api/rooms/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Room Title",
  "settings": {
    "timeLimit": 90
  }
}
```

### Delete Room
```http
DELETE /api/rooms/:id
Authorization: Bearer <token>
```

### Add Questions to Room
```http
POST /api/rooms/:id/questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionIds": ["65f1234...", "65f5678...", "65f9abc..."]
}
```

### Update Room Status
```http
PATCH /api/rooms/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "active"
}
```

**Valid Statuses:** `draft`, `active`, `closed`

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "stack": "..." // Only in development mode
}
```

---

## 🔍 Common Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Missing or invalid token
- **403 Forbidden** - Not authorized to access resource
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

---

## 💾 Caching

The API uses Redis for caching with the following TTLs:
- Teacher profiles: 1 hour
- Questions list: 5 minutes
- Single question: 10 minutes
- Rooms list: 5 minutes
- Active room by code: 1 hour

Cache is automatically invalidated on updates/deletes.

---

## 🚀 Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Juan","lastName":"Dela Cruz","email":"juan@school.edu.ph","password":"Pass123","school":"PGNHS"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@school.edu.ph","password":"Pass123"}'
```

### Create Question (with token)
```bash
curl -X POST http://localhost:5000/api/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"questionText":"Sample question?","questionType":"multiple-choice","topic":"Evolution","difficulty":"medium"}'
```

---

## 📝 Notes

1. All timestamps are in ISO 8601 format (UTC)
2. Room codes are 6 characters, uppercase alphanumeric
3. Rooms auto-expire after 24 hours (configurable via `ROOM_EXPIRY_HOURS`)
4. JWT tokens expire after 7 days (configurable via `JWT_EXPIRE`)
5. Redis caching is optional - API works without it but with reduced performance
