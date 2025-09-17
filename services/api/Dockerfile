# Multi-stage production Docker build for EmotionsCare API
FROM node:20-alpine AS base
WORKDIR /app

# Install security updates and dumb-init for proper signal handling
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S emotionscare -u 1001 -G nodejs

# Dependencies stage - install only production dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Build stage - compile TypeScript and prepare for production
FROM base AS builder
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy source code 
COPY . .
ENV NODE_ENV=production

# Runtime stage - minimal production image
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=8080
ENV API_PORT=8080

# Copy only necessary files
COPY --from=deps --chown=emotionscare:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=emotionscare:nodejs /app/package.json ./package.json
COPY --from=builder --chown=emotionscare:nodejs /app/services ./services

# Switch to non-root user for security
USER emotionscare

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: process.env.PORT || process.env.API_PORT || 8080,
      path: '/health',
      method: 'GET',
      timeout: 2000
    };
    const req = http.request(options, (res) => {
      process.exit(res.statusCode === 200 ? 0 : 1);
    });
    req.on('error', () => process.exit(1));
    req.on('timeout', () => process.exit(1));
    req.end();
  "

# Expose the API port
EXPOSE 8080

# Use dumb-init for proper signal handling and process management
ENTRYPOINT ["dumb-init", "--"]

# Start the server with ts-node for TypeScript support
CMD ["node", "--loader", "ts-node/esm", "services/api/index.ts"]