# Budget Buddy Docker Setup 🐳

This document explains how to run Budget Buddy using Docker, which containerizes both the frontend and backend for easy deployment.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- At least 2GB of available memory

## Quick Start

### Option 1: Using the startup script (Recommended)
```bash
./start-docker.sh
```

### Option 2: Manual Docker Compose commands
```bash
# Build and start containers
docker-compose build
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f budget-buddy-app
```

## Architecture Overview

The Docker setup consists of two main services:

### 1. MongoDB Database (`mongodb`)
- **Image**: `mongo:6.0`
- **Port**: `27017`
- **Credentials**: 
  - Username: `admin`
  - Password: `password123`
  - Database: `budgetbuddy`
- **Data Persistence**: Uses Docker volume `mongodb_data`

### 2. Budget Buddy Application (`budget-buddy-app`)
- **Port**: `3001`
- **Components**: 
  - React frontend (built with Vite)
  - Express.js backend
  - Serves both API and static files
- **Environment**: Production-optimized build

## Application URLs

Once running, you can access:

- **Frontend**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health
- **MongoDB**: localhost:27017

## Docker Commands

### Starting Services
```bash
# Start in detached mode
docker-compose up -d

# Start with logs visible
docker-compose up
```

### Stopping Services
```bash
# Stop containers
docker-compose down

# Stop and remove volumes (⚠️ This will delete database data)
docker-compose down -v
```

### Managing Containers
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f budget-buddy-app
docker-compose logs -f mongodb

# Restart a service
docker-compose restart budget-buddy-app

# Rebuild containers
docker-compose build --no-cache
```

### Database Management
```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password123

# Backup database
docker-compose exec mongodb mongodump --username admin --password password123 --authenticationDatabase admin --db budgetbuddy --out /tmp/backup

# View database files
docker-compose exec mongodb ls -la /data/db
```

## File Structure

```
Budget-Buddy/
├── docker-compose.yml      # Container orchestration
├── Dockerfile             # Multi-stage build definition
├── .dockerignore          # Files to exclude from build
├── start-docker.sh        # Quick startup script
├── client/                # React frontend
│   ├── package.json
│   ├── src/
│   └── public/
└── server/                # Express backend
    ├── package.json
    ├── index.js
    ├── models/
    ├── routes/
    └── controllers/
```

## Build Process

The Docker build uses a multi-stage approach:

1. **Stage 1 (frontend-build)**:
   - Builds React app using Vite
   - Outputs to `client/dist/`

2. **Stage 2 (production)**:
   - Sets up Node.js backend
   - Copies built frontend to `server/public/`
   - Configures production environment

## Environment Variables

The application uses these environment variables:

- `NODE_ENV`: Set to `production`
- `PORT`: Application port (3001)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: JWT token secret

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Check what's using port 3001
   lsof -i :3001
   
   # Stop the process or change port in docker-compose.yml
   ```

2. **Database connection failed**:
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Restart MongoDB
   docker-compose restart mongodb
   ```

3. **Build failures**:
   ```bash
   # Clean build without cache
   docker-compose build --no-cache
   
   # Remove all containers and rebuild
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

4. **Frontend not loading**:
   - Check if build completed successfully
   - Verify static files are in `/app/public`
   - Check application logs

### Health Checks

The containers include health checks:

- **MongoDB**: Uses `mongosh` ping command
- **Budget Buddy**: HTTP GET to `/api/health`

Check health status:
```bash
docker-compose ps
```

### Performance Optimization

For better performance:

1. **Increase Docker memory**: Set to at least 2GB in Docker Desktop settings
2. **Use Docker BuildKit**: Enable in Docker settings
3. **Prune unused images**: `docker system prune -f`

## Security Notes

⚠️ **Important**: This setup is for development/testing purposes. For production:

1. Change default MongoDB credentials
2. Use environment variables for secrets
3. Enable MongoDB authentication
4. Use HTTPS
5. Configure proper firewall rules
6. Regular security updates

## Data Persistence

Database data is stored in the `mongodb_data` Docker volume. To view:

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect budget-buddy_mongodb_data
```

## Backup and Recovery

### Backup Database
```bash
# Create backup
docker-compose exec mongodb mongodump --username admin --password password123 --authenticationDatabase admin --db budgetbuddy --archive=/tmp/backup.archive

# Copy backup to host
docker-compose cp mongodb:/tmp/backup.archive ./backup.archive
```

### Restore Database
```bash
# Copy backup to container
docker-compose cp ./backup.archive mongodb:/tmp/backup.archive

# Restore backup
docker-compose exec mongodb mongorestore --username admin --password password123 --authenticationDatabase admin --db budgetbuddy --archive=/tmp/backup.archive
```

## Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify Docker is running: `docker info`
3. Check available ports: `netstat -an | grep 3001`
4. Rebuild containers: `docker-compose build --no-cache`

For more help, check the main project documentation or create an issue in the repository.
