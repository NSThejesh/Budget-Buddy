# 🐳 Docker Deployment Guide for Budget Buddy

This guide will help you run Budget Buddy using Docker and Docker Compose, making it easy to share and deploy the application.

## 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- At least 2GB of available RAM
- At least 1GB of available disk space

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Expensync
```

### 2. Build and Run with Docker Compose
```bash
# Build and start all services (MongoDB + Budget Buddy App)
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

### 3. Access the Application
- **Budget Buddy App**: http://localhost:3001
- **MongoDB**: localhost:27017 (if you need direct database access)

### 4. Stop the Application
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (this will delete all data)
docker-compose down -v
```

## 🏗️ What's Included

The Docker setup includes:

### **Multi-stage Dockerfile**
- **Stage 1**: Builds the React frontend using Vite
- **Stage 2**: Sets up the Express.js backend and serves the built frontend
- **Security**: Runs as non-root user
- **Health checks**: Monitors application health

### **Docker Compose Services**
- **MongoDB**: Database with persistent storage
- **Budget Buddy App**: Full-stack application (frontend + backend)
- **Networking**: Isolated network for services
- **Health checks**: Automatic service monitoring

## ⚙️ Configuration

### Environment Variables
The application is configured with these default environment variables in `docker-compose.yml`:

```yaml
environment:
  NODE_ENV: production
  PORT: 3001
  MONGO_URI: mongodb://admin:password123@mongodb:27017/budgetbuddy?authSource=admin
  JWT_SECRET: your_super_secret_jwt_key_change_in_production
```

### 🔒 Security Recommendations for Production

1. **Change MongoDB credentials**:
   ```yaml
   MONGO_INITDB_ROOT_USERNAME: your_username
   MONGO_INITDB_ROOT_PASSWORD: your_secure_password
   ```

2. **Use a strong JWT secret**:
   ```yaml
   JWT_SECRET: your_very_long_and_secure_jwt_secret_key
   ```

3. **Use environment file for sensitive data**:
   ```bash
   # Create .env file
   cat << EOF > .env
   MONGO_USERNAME=your_username
   MONGO_PASSWORD=your_secure_password
   JWT_SECRET=your_very_long_and_secure_jwt_secret_key
   EOF
   ```

   Then reference in docker-compose.yml:
   ```yaml
   environment:
     MONGO_URI: mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongodb:27017/budgetbuddy?authSource=admin
     JWT_SECRET: ${JWT_SECRET}
   ```

## 🛠️ Development

### Building Only the Docker Image
```bash
# Build the application image
docker build -t budget-buddy .

# Run the image (you'll need MongoDB separately)
docker run -p 3001:3001 \
  -e MONGO_URI="your_mongodb_connection_string" \
  -e JWT_SECRET="your_jwt_secret" \
  budget-buddy
```

### Viewing Logs
```bash
# View logs from all services
docker-compose logs

# View logs from specific service
docker-compose logs budget-buddy-app
docker-compose logs mongodb

# Follow logs in real-time
docker-compose logs -f budget-buddy-app
```

### Debugging
```bash
# Access the running container
docker-compose exec budget-buddy-app sh

# Check MongoDB connection
docker-compose exec mongodb mongosh -u admin -p password123
```

## 📊 Health Monitoring

The setup includes health checks for both services:

- **MongoDB**: Checks database connectivity every 30 seconds
- **Budget Buddy App**: Checks HTTP endpoint availability every 30 seconds

View health status:
```bash
docker-compose ps
```

## 🗄️ Data Persistence

MongoDB data is persisted using Docker volumes:
- Volume name: `budgetbuddy_mongodb_data`
- Location: `/data/db` inside the container

### Backup Data
```bash
# Create a backup
docker-compose exec mongodb mongodump --uri="mongodb://admin:password123@localhost:27017/budgetbuddy?authSource=admin" --out=/data/backup

# Copy backup to host
docker cp budget-buddy-mongo:/data/backup ./backup
```

### Restore Data
```bash
# Copy backup to container
docker cp ./backup budget-buddy-mongo:/data/backup

# Restore data
docker-compose exec mongodb mongorestore --uri="mongodb://admin:password123@localhost:27017/budgetbuddy?authSource=admin" /data/backup/budgetbuddy
```

## 🌐 Deployment Options

### Option 1: Docker Hub
```bash
# Build and tag for Docker Hub
docker build -t yourusername/budget-buddy:latest .

# Push to Docker Hub
docker push yourusername/budget-buddy:latest

# Your friends can then run:
docker run -p 3001:3001 yourusername/budget-buddy:latest
```

### Option 2: Share Docker Compose File
Share your `docker-compose.yml` file with:
```bash
# Your friends can run:
docker-compose up --build -d
```

### Option 3: Export/Import Image
```bash
# Export image to file
docker save -o budget-buddy.tar budget-buddy:latest

# Share the .tar file, then import:
docker load -i budget-buddy.tar
```

## 🎯 Sharing with Friends

### Method 1: GitHub + Docker Hub
1. Push your code to GitHub
2. Build and push image to Docker Hub
3. Share the repository link
4. Friends can run: `docker-compose up -d`

### Method 2: Direct Image Share
1. Build the image: `docker build -t budget-buddy .`
2. Save to file: `docker save -o budget-buddy.tar budget-buddy`
3. Share the `.tar` file + `docker-compose.yml`
4. Friends load and run: 
   ```bash
   docker load -i budget-buddy.tar
   docker-compose up -d
   ```

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Change ports in docker-compose.yml
   ports:
     - "3002:3001"  # Use different host port
   ```

2. **MongoDB connection issues**:
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Restart MongoDB
   docker-compose restart mongodb
   ```

3. **Build failures**:
   ```bash
   # Clean build (no cache)
   docker-compose build --no-cache
   
   # Remove old images
   docker system prune -a
   ```

4. **Application not starting**:
   ```bash
   # Check application logs
   docker-compose logs budget-buddy-app
   
   # Check if all services are healthy
   docker-compose ps
   ```

## 📝 Notes

- The application combines both frontend and backend in a single container
- MongoDB runs in a separate container with persistent storage
- All services communicate through a Docker network
- The setup is production-ready with health checks and security considerations
- Default credentials are provided for easy setup but should be changed for production

## 🆘 Need Help?

If you encounter any issues:
1. Check the logs: `docker-compose logs`
2. Verify all services are healthy: `docker-compose ps`
3. Restart services: `docker-compose restart`
4. Clean rebuild: `docker-compose down && docker-compose up --build`

Enjoy your dockerized Budget Buddy! 🎉
