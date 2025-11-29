# Docker Setup Guide for GeneSys

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
  - Download: https://www.docker.com/products/docker-desktop
  - Version: 20.10 or higher
- **Docker Compose** (usually included with Docker Desktop)
  - Version: 2.0 or higher

Verify installation:
```bash
docker --version
docker-compose --version
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
cd c:\Users\olajo\Desktop\Genesys
```

### 2. Set Up Environment Variables
```bash
# Copy the example environment file
copy .env.example .env

# Edit .env file with your preferred text editor
# IMPORTANT: Change all secret keys and passwords for production!
```

### 3. Start All Services
```bash
# Start all services in detached mode
docker-compose up -d

# Or start with development tools (includes Mongo Express & Redis Commander)
docker-compose --profile dev up -d
```

### 4. Check Service Status
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 5. Access the Application

Once all services are running:

- **Frontend (Student/Teacher Interface)**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health
- **Mongo Express (Dev)**: http://localhost:8081 (admin/admin)
- **Redis Commander (Dev)**: http://localhost:8082

## 🛠️ Development Commands

### Starting Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d mongodb redis

# Start with development tools
docker-compose --profile dev up -d

# Start and view logs
docker-compose up
```

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v

# Stop specific service
docker-compose stop backend
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 frontend

# Since specific time
docker-compose logs --since 30m mongodb
```

### Rebuilding Services

```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild and restart
docker-compose up -d --build

# Force rebuild (no cache)
docker-compose build --no-cache backend
```

### Executing Commands Inside Containers

```bash
# Access backend shell
docker-compose exec backend sh

# Access frontend shell
docker-compose exec frontend sh

# Run npm commands in backend
docker-compose exec backend npm install <package-name>

# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p genesys_admin_password

# Access Redis CLI
docker-compose exec redis redis-cli -a genesys_redis_password
```

## 📦 Service Details

### MongoDB (Port 27017)
- **Container**: genesys-mongodb
- **Database**: genesys
- **Username**: admin
- **Password**: genesys_admin_password (change in production!)
- **Volume**: mongodb_data

### Redis (Port 6379)
- **Container**: genesys-redis
- **Password**: genesys_redis_password (change in production!)
- **Max Memory**: 256MB
- **Eviction Policy**: allkeys-lru
- **Volume**: redis_data

### Backend API (Port 5000)
- **Container**: genesys-backend
- **Framework**: Node.js + Express + Socket.IO
- **Hot Reload**: Enabled (development mode)
- **Dependencies**: MongoDB, Redis

### Frontend (Port 3000)
- **Container**: genesys-frontend
- **Framework**: Next.js / React
- **Hot Reload**: Enabled (development mode)
- **Dependencies**: Backend API

## 🔧 Troubleshooting

### Services won't start

```bash
# Check if ports are already in use
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :27017

# Stop all containers and remove volumes
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a --volumes
```

### MongoDB connection issues

```bash
# Check MongoDB logs
docker-compose logs mongodb

# Test MongoDB connection
docker-compose exec mongodb mongosh -u admin -p genesys_admin_password --eval "db.adminCommand('ping')"

# Restart MongoDB
docker-compose restart mongodb
```

### Redis connection issues

```bash
# Check Redis logs
docker-compose logs redis

# Test Redis connection
docker-compose exec redis redis-cli -a genesys_redis_password ping

# Restart Redis
docker-compose restart redis
```

### Backend won't connect to databases

```bash
# Ensure databases are healthy
docker-compose ps

# Check backend logs for connection errors
docker-compose logs backend

# Restart backend after databases are healthy
docker-compose restart backend
```

### Permission errors (Linux/Mac)

```bash
# Fix permissions for volumes
sudo chown -R $USER:$USER ./backend ./frontend

# Or run Docker commands with sudo
sudo docker-compose up -d
```

### Port conflicts

```bash
# Change ports in docker-compose.yaml
# Example: Change frontend from 3000:3000 to 3001:3000

# Or stop conflicting services
# Windows: netstat -ano | findstr :3000
# Then: taskkill /PID <PID> /F
```

## 🗄️ Database Management

### Backup MongoDB

```bash
# Create backup
docker-compose exec -T mongodb mongodump --uri="mongodb://admin:genesys_admin_password@localhost:27017/genesys?authSource=admin" --archive > genesys_backup_$(date +%Y%m%d).dump

# Or using docker volume
docker run --rm --volumes-from genesys-mongodb -v $(pwd):/backup ubuntu tar cvf /backup/mongodb_backup.tar /data/db
```

### Restore MongoDB

```bash
# Restore from dump
docker-compose exec -T mongodb mongorestore --uri="mongodb://admin:genesys_admin_password@localhost:27017/genesys?authSource=admin" --archive < genesys_backup_20250109.dump
```

### Clear Redis Cache

```bash
# Flush all Redis data
docker-compose exec redis redis-cli -a genesys_redis_password FLUSHALL

# Flush specific database
docker-compose exec redis redis-cli -a genesys_redis_password -n 0 FLUSHDB
```

## 🔐 Security Best Practices

### For Production Deployment:

1. **Change all default passwords** in `.env` file
2. **Use strong, random secrets** for JWT and sessions (64+ characters)
3. **Enable SSL/TLS** for all connections
4. **Use environment-specific configs** (separate .env files)
5. **Remove development tools** (don't use `--profile dev` in production)
6. **Set up proper firewall rules**
7. **Enable Docker security scanning**
8. **Use Docker secrets** for sensitive data
9. **Implement rate limiting** on API endpoints
10. **Regular security updates** for all images

### Generate Secure Secrets

```bash
# Generate random 64-character string (Linux/Mac)
openssl rand -hex 32

# PowerShell (Windows)
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

## 📊 Monitoring

### View Resource Usage

```bash
# Real-time stats for all containers
docker stats

# Specific container stats
docker stats genesys-backend
```

### Health Checks

```bash
# Check service health status
docker-compose ps

# Manual health check
curl http://localhost:5000/api/health
curl http://localhost:3000
```

## 🧹 Cleanup

### Remove Stopped Containers

```bash
docker-compose rm
```

### Clean Up Everything

```bash
# Stop and remove containers, networks, volumes
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a --volumes

# WARNING: This removes ALL Docker data, not just GeneSys
```

## 📝 Environment Profiles

### Development Profile

```bash
# Includes all services + admin tools
docker-compose --profile dev up -d
```

### Production Profile

```bash
# Minimal services only
docker-compose up -d
```

## 🔄 Updates and Maintenance

### Update Docker Images

```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build
```

### Update Dependencies

```bash
# Backend
docker-compose exec backend npm update

# Frontend
docker-compose exec frontend npm update
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Redis Docker Hub](https://hub.docker.com/_/redis)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

**Need Help?** Contact the GeneSys development team or check the main README.md for more information.
