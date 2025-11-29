# GeneSys Backend API

Backend server for GeneSys - A Digital Game-Based Learning Platform for General Biology Education.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB 7.0+
- Redis 7+ (optional but recommended)
- Docker & Docker Compose (for containerized setup)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp ../.env.example ../.env
# Edit .env with your configuration
```

3. **Start the server**
```bash
# Development with hot reload
npm run dev

# Production
npm start
```

The server will start on `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Database and Redis configuration
│   │   ├── database.js
│   │   └── redis.js
│   ├── models/          # Mongoose models
│   │   ├── Teacher.js
│   │   ├── Question.js
│   │   ├── Room.js
│   │   └── StudentResponse.js
│   ├── controllers/     # Request handlers
│   │   ├── authController.js
│   │   ├── questionController.js
│   │   └── roomController.js
│   ├── routes/          # API routes
│   │   ├── authRoutes.js
│   │   ├── questionRoutes.js
│   │   └── roomRoutes.js
│   ├── middleware/      # Express middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/           # Utility functions
│   │   └── jwt.js
│   └── server.js        # Main application entry
├── Dockerfile           # Production Docker image
├── Dockerfile.dev       # Development Docker image
├── package.json
└── API_DOCUMENTATION.md
```

---

## 🔧 Environment Variables

Key environment variables (see `.env.example` for full list):

```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://admin:password@localhost:27017/genesys?authSource=admin

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d

# Room Settings
ROOM_EXPIRY_HOURS=24

# CORS
FRONTEND_URL=http://localhost:3000
```

---

## 🛠️ Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Run tests (to be implemented)
npm test
```

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new teacher
- `POST /api/auth/login` - Login teacher
- `GET /api/auth/me` - Get current teacher profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Questions
- `POST /api/questions` - Create question (protected)
- `GET /api/questions` - Get all questions (protected)
- `GET /api/questions/:id` - Get single question (protected)
- `PUT /api/questions/:id` - Update question (protected)
- `DELETE /api/questions/:id` - Delete question (protected)
- `GET /api/questions/topic/:topic` - Get questions by topic (protected)

### Rooms
- `POST /api/rooms` - Create room (protected)
- `GET /api/rooms` - Get all rooms (protected)
- `GET /api/rooms/:id` - Get single room (protected)
- `GET /api/rooms/join/:roomCode` - Get room by code (public)
- `PUT /api/rooms/:id` - Update room (protected)
- `DELETE /api/rooms/:id` - Delete room (protected)
- `POST /api/rooms/:id/questions` - Add questions to room (protected)
- `PATCH /api/rooms/:id/status` - Update room status (protected)

### Health Check
- `GET /api/health` - Server health status (public)

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation.

---

## 💾 Database Models

### Teacher
- Authentication and profile information
- Password hashing with bcrypt
- Role-based access control

### Question
- Multiple question types (multiple-choice, true-false, matching, etc.)
- Topic categorization (aligned with Biology curriculum)
- Difficulty levels (easy, medium, hard)
- Rich content support (images, explanations)

### Room
- Unique 6-character room codes
- Flexible settings (time limits, randomization, feedback modes)
- Auto-expiration after 24 hours (configurable)
- Statistics tracking

### StudentResponse
- Student answers and scoring
- Time tracking
- Session management

---

## 🔄 Redis Caching

Redis is used for caching to improve performance:

- **Teacher profiles**: 1 hour TTL
- **Questions list**: 5 minutes TTL
- **Single question**: 10 minutes TTL
- **Rooms list**: 5 minutes TTL
- **Active rooms**: 1 hour TTL

Cache is automatically invalidated on data updates.

---

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

From the project root:
```bash
# Start all services (MongoDB, Redis, Backend)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

### Build Docker Image Manually

```bash
# Production build
docker build -t genesys-backend .

# Development build
docker build -f Dockerfile.dev -t genesys-backend:dev .

# Run container
docker run -p 5000:5000 --env-file .env genesys-backend
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Register teacher
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Juan","lastName":"Dela Cruz","email":"juan@school.edu.ph","password":"Pass123","school":"PGNHS"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@school.edu.ph","password":"Pass123"}'
```

### Using Postman or Thunder Client

Import the API endpoints from `API_DOCUMENTATION.md` into your API client.

---

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt (10 salt rounds)
- Protected routes with auth middleware
- CORS configuration
- Input validation
- Error handling middleware
- Rate limiting ready (to be configured)

---

## 🚨 Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "stack": "..." // Only in development
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🔄 Development Workflow

1. **Make changes** to source files
2. **Nodemon automatically restarts** the server
3. **Test endpoints** using API client or cURL
4. **Check logs** in terminal
5. **Commit changes** to version control

---

## 📊 Monitoring

Check server health:
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "success": true,
  "message": "GeneSys API is running",
  "timestamp": "2025-11-09T10:30:00.000Z",
  "environment": "development"
}
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Test connection
mongosh mongodb://admin:genesys_admin_password@localhost:27017
```

### Redis Connection Issues
```bash
# Check Redis is running
docker-compose ps redis

# Test Redis connection
docker-compose exec redis redis-cli -a genesys_redis_password ping
```

### Port Already in Use
```bash
# Find process using port 5000 (Windows)
netstat -ano | findstr :5000

# Kill process (Windows - replace PID)
taskkill /PID <PID> /F
```

---

## 🔮 Future Enhancements

- [ ] Socket.IO integration for real-time features
- [ ] Student response submission endpoints
- [ ] Analytics and reporting endpoints
- [ ] File upload for question images
- [ ] Email notifications
- [ ] Rate limiting implementation
- [ ] API versioning
- [ ] Comprehensive test suite
- [ ] Swagger/OpenAPI documentation

---

## 👥 Team

GeneSys Research Team - Puerto Galera National High School

---

## 📄 License

This project is part of academic research for Practical Research 2.

---

**Need help?** Check the [API Documentation](./API_DOCUMENTATION.md) or contact the development team.
