# GeneSys Backend - Quick Start Guide

## ✅ Setup Complete!

Your GeneSys backend has been successfully initialized with:

### 📦 Installed Packages
- ✅ Express 5.1.0 - Web framework
- ✅ Mongoose 8.x - MongoDB ODM
- ✅ Redis 5.9.0 - Caching layer
- ✅ bcrypt 6.0.0 - Password hashing
- ✅ jsonwebtoken 9.0.2 - JWT authentication
- ✅ Socket.IO 4.7.0 - Real-time features
- ✅ dotenv 17.2.3 - Environment variables
- ✅ nodemon 3.x - Dev server with hot reload

### 📁 Project Structure Created
```
backend/
├── src/
│   ├── config/          ✅ Database & Redis config
│   ├── models/          ✅ 4 Mongoose models
│   ├── controllers/     ✅ 3 CRUD controllers with caching
│   ├── routes/          ✅ RESTful API routes
│   ├── middleware/      ✅ Auth & error handling
│   ├── utils/           ✅ JWT utilities
│   └── server.js        ✅ Express app
├── Dockerfile           ✅ Production container
├── Dockerfile.dev       ✅ Development container
└── package.json         ✅ Updated with scripts
```

---

## 🚀 Start Development Server

### Option 1: Local Development (without Docker)

**Prerequisites:** MongoDB and Redis must be running locally or update `.env` with remote URLs

```bash
# From backend folder
npm run dev
```

Server will start at: http://localhost:5000

### Option 2: Docker Compose (Recommended)

```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f backend
```

This starts:
- ✅ MongoDB on port 27017
- ✅ Redis on port 6379
- ✅ Backend API on port 5000
- ✅ Mongo Express on port 8081 (admin UI)
- ✅ Redis Commander on port 8082 (admin UI)

---

## 🧪 Test the API

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register a Teacher
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Juan\",\"lastName\":\"Dela Cruz\",\"email\":\"juan@pgnhs.edu.ph\",\"password\":\"Teacher123\",\"school\":\"Puerto Galera National High School\"}"
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"juan@pgnhs.edu.ph\",\"password\":\"Teacher123\"}"
```

Save the token from response and use it for protected endpoints!

---

## 📚 API Endpoints Available

### Authentication (Public)
- POST `/api/auth/register` - Register teacher
- POST `/api/auth/login` - Login teacher

### Authentication (Protected)
- GET `/api/auth/me` - Get profile
- PUT `/api/auth/profile` - Update profile
- PUT `/api/auth/change-password` - Change password

### Questions (Protected)
- POST `/api/questions` - Create question
- GET `/api/questions` - List all questions (with filters)
- GET `/api/questions/:id` - Get single question
- PUT `/api/questions/:id` - Update question
- DELETE `/api/questions/:id` - Delete question
- GET `/api/questions/topic/:topic` - Get by topic

### Rooms (Mixed)
- GET `/api/rooms/join/:roomCode` - Join room (public - for students)
- POST `/api/rooms` - Create room (protected)
- GET `/api/rooms` - List all rooms (protected)
- GET `/api/rooms/:id` - Get single room (protected)
- PUT `/api/rooms/:id` - Update room (protected)
- DELETE `/api/rooms/:id` - Delete room (protected)
- POST `/api/rooms/:id/questions` - Add questions (protected)
- PATCH `/api/rooms/:id/status` - Update status (protected)

---

## 🔧 Configuration

Your `.env` file is already configured with:
- ✅ MongoDB connection
- ✅ Redis connection  
- ✅ JWT secrets (generated)
- ✅ Room expiry (24 hours)
- ✅ CORS settings

**⚠️ Important:** Change JWT secrets in production!

---

## 🎯 Key Features Implemented

### ✅ Complete CRUD Operations
- Teachers (register, login, profile management)
- Questions (all question types supported)
- Rooms (with 6-character codes)
- Full validation and error handling

### ✅ Redis Caching Layer
- Automatic caching for better performance
- Cache invalidation on updates
- Configurable TTLs

### ✅ Security
- JWT authentication
- Password hashing (bcrypt)
- Protected routes
- CORS configuration

### ✅ Database Models
- **Teacher** - Authentication & profiles
- **Question** - 6 question types, topics, difficulty
- **Room** - Unique codes, auto-expiry, settings
- **StudentResponse** - Scoring, time tracking

---

## 📊 Database Schema

### Topics Available
- Genetic Engineering
- Evolution
- Taxonomy
- Reproduction
- Plant Systems
- Animal Systems
- Homeostasis
- Immune System
- Other

### Question Types
- multiple-choice
- true-false
- matching
- fill-in-the-blank
- essay
- short-answer

### Room Statuses
- draft (being created)
- active (students can join)
- closed (manually closed)
- expired (auto-expired after 24h)

---

## 🔍 Monitoring & Debugging

### View Server Logs
```bash
# Docker
docker-compose logs -f backend

# Local
# Logs appear in terminal where you ran npm run dev
```

### Check Database
```bash
# MongoDB Shell
docker-compose exec mongodb mongosh -u admin -p genesys_admin_password

# Or use Mongo Express: http://localhost:8081
```

### Check Redis Cache
```bash
# Redis CLI
docker-compose exec redis redis-cli -a genesys_redis_password

# Or use Redis Commander: http://localhost:8082
```

---

## 📖 Documentation

- **API Documentation:** `backend/API_DOCUMENTATION.md`
- **Backend README:** `backend/README.md`
- **Docker Setup:** `DOCKER_SETUP.md` (project root)

---

## 🎉 You're All Set!

Your GeneSys backend is ready for development. Next steps:

1. ✅ **Test the API** using the curl commands above
2. ✅ **Create some test data** (teachers, questions, rooms)
3. ✅ **Start building the frontend** to connect to this API
4. ✅ **Add Socket.IO handlers** for real-time features

---

## 🆘 Need Help?

### Common Issues

**MongoDB connection failed?**
```bash
docker-compose up -d mongodb
docker-compose logs mongodb
```

**Redis not connecting?**
```bash
docker-compose up -d redis
docker-compose logs redis
```

**Port 5000 already in use?**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

Happy coding! 🚀
