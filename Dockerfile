# Multi-stage Dockerfile for Budget Buddy - Cross-Platform Compatible
# Supports: Linux (x86_64, ARM64), macOS (Intel, Apple Silicon), Windows

# Stage 1: Build the React frontend
FROM --platform=$BUILDPLATFORM node:18-alpine AS frontend-build

# Set build arguments for cross-compilation
ARG BUILDPLATFORM
ARG TARGETPLATFORM
ARG TARGETOS
ARG TARGETARCH

# Install build dependencies for cross-platform compatibility
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && ln -sf python3 /usr/bin/python

# Set working directory
WORKDIR /app/client

# Copy package files with proper permissions
COPY --chmod=644 client/package*.json ./

# Set environment variables for cross-platform builds
ENV PYTHON=/usr/bin/python3
ENV npm_config_python=/usr/bin/python3

# Install dependencies with platform-specific optimizations
RUN npm ci --no-audit --no-fund && \
    npm cache clean --force

# Copy client source code with proper permissions
COPY --chmod=644 client/ ./

# Build the React app with cross-platform settings
ENV NODE_ENV=production
ENV CI=true
RUN npm run build

# Stage 2: Setup the Express backend and serve the built frontend
FROM --platform=$TARGETPLATFORM node:18-alpine AS production

# Set platform arguments
ARG TARGETPLATFORM
ARG TARGETOS
ARG TARGETARCH

# Install runtime dependencies for cross-platform compatibility
RUN apk add --no-cache \
    dumb-init \
    wget \
    curl \
    tzdata \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Create app directory structure with proper permissions
RUN mkdir -p /app/logs /app/public /app/uploads && \
    chmod 755 /app/logs /app/public /app/uploads

# Copy package files with proper permissions
COPY --chmod=644 server/package*.json ./

# Configure npm for production
RUN npm config set audit false && \
    npm config set fund false && \
    npm config set loglevel warn

# Install server dependencies with platform-specific optimizations
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Copy server source code with proper permissions and structure
COPY --chmod=644 server/*.js ./
COPY --chmod=644 server/package*.json ./
COPY --chmod=755 server/routes/ ./routes/
COPY --chmod=755 server/models/ ./models/
COPY --chmod=755 server/controllers/ ./controllers/
COPY --chmod=755 server/middleware/ ./middleware/

# Create a non-root user for security (cross-platform compatible)
RUN addgroup -g 1001 -S appgroup 2>/dev/null || true && \
    adduser -S -D -H -u 1001 -s /sbin/nologin -G appgroup appuser 2>/dev/null || true

# Copy built frontend from the previous stage with proper ownership
COPY --from=frontend-build --chown=appuser:appgroup /app/client/dist ./public

# Set environment variables for cross-platform compatibility
ENV NODE_ENV=production
ENV PORT=3001
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV TZ=UTC

# Change ownership of the app directory (compatible with all platforms)
RUN chown -R appuser:appgroup /app 2>/dev/null || chown -R 1001:1001 /app

# Ensure public directory has correct permissions
RUN chmod -R 755 /app/public && \
    find /app/public -type f -exec chmod 644 {} \;

# Switch to non-root user
USER appuser

# Expose the port
EXPOSE 3001

# Health check (cross-platform compatible)
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || \
        curl -f http://localhost:3001/api/health || \
        node -e "require('http').get('http://localhost:3001/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Use dumb-init for proper signal handling across platforms
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "index.js"]
