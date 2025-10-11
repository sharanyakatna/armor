# syntax=docker/dockerfile:1

# ✅ Multi-arch compatible base image
FROM --platform=$BUILDPLATFORM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy everything else
COPY . .

# Expose backend port
EXPOSE 8080

# Environment mode
ENV NODE_ENV=production

# Start command
CMD ["node", "server.js"]

