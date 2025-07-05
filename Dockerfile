# Multi-stage Dockerfile for Budget Buddy (Expensync)
# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy client source code
COPY client/ ./

# Build the React app
RUN npm run build

# Stage 2: Setup the Express backend and serve the built frontend
FROM node:18-alpine AS production

WORKDIR /app

# Install server dependencies
COPY server/package*.json ./
RUN npm install --only=production

# Copy server source code
COPY server/ ./

# Copy built frontend from the previous stage (Vite outputs to dist)
COPY --from=frontend-build /app/client/dist ./public

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S budgetbuddy -u 1001

# Change ownership of the app directory
RUN chown -R budgetbuddy:nodejs /app
USER budgetbuddy

# Expose the port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
