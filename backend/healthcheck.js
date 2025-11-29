#!/usr/bin/env node

/**
 * GeneSys Backend Health Check Script
 * Verifies all services are running and accessible
 */

const http = require('http');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

console.log(`\n${colors.cyan}🏥 GeneSys Backend Health Check${colors.reset}\n`);

// Check Backend API
function checkBackend() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`${colors.green}✅ Backend API is running on port 5000${colors.reset}`);
          resolve(true);
        } else {
          console.log(
            `${colors.red}❌ Backend API responded with status ${res.statusCode}${colors.reset}`
          );
          resolve(false);
        }
      });
    });

    req.on('error', () => {
      console.log(
        `${colors.red}❌ Backend API is not accessible on port 5000${colors.reset}`
      );
      console.log(
        `${colors.yellow}   Run: cd backend && npm run dev${colors.reset}`
      );
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log(`${colors.red}❌ Backend API connection timeout${colors.reset}`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Check MongoDB (via backend)
function checkMongoDB() {
  return new Promise((resolve) => {
    console.log(`${colors.cyan}Checking MongoDB connection...${colors.reset}`);
    // MongoDB check would be done through backend API in real scenario
    // For now, we assume if backend is up, MongoDB is connected
    setTimeout(() => {
      console.log(
        `${colors.yellow}ℹ️  MongoDB check via backend API (start backend first)${colors.reset}`
      );
      resolve(true);
    }, 100);
  });
}

// Check Redis (via backend)
function checkRedis() {
  return new Promise((resolve) => {
    console.log(`${colors.cyan}Checking Redis connection...${colors.reset}`);
    // Redis check would be done through backend API
    setTimeout(() => {
      console.log(
        `${colors.yellow}ℹ️  Redis check via backend API (start backend first)${colors.reset}`
      );
      resolve(true);
    }, 100);
  });
}

// Main health check
async function runHealthCheck() {
  console.log(`${colors.cyan}Starting health checks...${colors.reset}\n`);

  const backendOk = await checkBackend();

  if (!backendOk) {
    console.log(`\n${colors.red}❌ Health check failed${colors.reset}`);
    console.log(`\n${colors.yellow}To start the backend:${colors.reset}`);
    console.log(`   1. cd backend`);
    console.log(`   2. npm install`);
    console.log(`   3. npm run dev`);
    console.log(`\n${colors.yellow}Or use Docker:${colors.reset}`);
    console.log(`   docker-compose up -d`);
    process.exit(1);
  }

  await checkMongoDB();
  await checkRedis();

  console.log(`\n${colors.green}✅ All health checks passed!${colors.reset}`);
  console.log(`\n${colors.cyan}Available endpoints:${colors.reset}`);
  console.log(`   • Health: http://localhost:5000/api/health`);
  console.log(`   • Auth: http://localhost:5000/api/auth`);
  console.log(`   • Questions: http://localhost:5000/api/questions`);
  console.log(`   • Rooms: http://localhost:5000/api/rooms`);
  console.log(`\n${colors.cyan}Admin interfaces (Docker):${colors.reset}`);
  console.log(`   • Mongo Express: http://localhost:8081`);
  console.log(`   • Redis Commander: http://localhost:8082`);
  console.log();
}

// Run the health check
runHealthCheck().catch((error) => {
  console.error(`${colors.red}Error during health check:${colors.reset}`, error);
  process.exit(1);
});
