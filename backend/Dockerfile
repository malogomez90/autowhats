# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json* ./

# Use `npm ci` when a lockfile exists; otherwise fall back to `npm install`.
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source code
COPY . .

# Compile TypeScript (if using)
# RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install production dependencies only
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json* ./

# Use the lockfile when available; otherwise install prod deps without generating a hard failure.
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy built application from builder stage
COPY --from=builder /app/src ./src

# Create directories for logs
RUN mkdir -p /app/logs

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Set environment variables
ENV NODE_ENV=production \
    PORT=5000 \
    LOG_LEVEL=info

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "src/app.js"]

# Development stage
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json* ./

# Use `npm ci` when a lockfile exists; otherwise fall back to `npm install`.
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source code
COPY . .

# Expose development port
EXPOSE 5000

# Command to run in development
CMD ["npm", "run", "dev"]

# Test stage (optional)
FROM node:18-alpine AS test

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json* ./

# Use `npm ci` when a lockfile exists; otherwise fall back to `npm install`.
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source code
COPY . .

# Run tests
CMD ["npm", "test"]
