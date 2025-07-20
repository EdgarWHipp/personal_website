# syntax=docker.io/docker/dockerfile:1

# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Copy built application from build stage
COPY --from=build /app/build ./build

# Install a simple static file server for Node.js
RUN npm install -g serve

# Expose port 80 (nginx default)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["serve", "-s", "build", "-l", "3000"]
