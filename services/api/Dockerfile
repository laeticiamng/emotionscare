# Multi-stage production Docker build for EmotionsCare API
FROM node:20-alpine AS base
WORKDIR /app

# Keep base image up to date and install utilities needed at runtime
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init curl && \
    rm -rf /var/cache/apk/*

# Create non-root user for better security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S emotionscare -u 1001 -G nodejs

ENV NODE_ENV=production
ENV PORT=8080
ENV API_PORT=8080

# Dependencies stage - install npm modules once
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts

# Builder stage - bundle the Fastify API
FROM base AS builder
WORKDIR /app
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Compile the API to a single ESM bundle (fails the build if compilation breaks)
RUN npx esbuild services/api/index.ts \
      --bundle \
      --platform=node \
      --format=esm \
      --target=node20 \
      --outfile=dist/server.js

# Remove development-only dependencies after the build step
RUN npm prune --omit=dev

# Runtime stage - lightweight image with only what we need
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV API_PORT=8080

# Copy production dependencies and build artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/services ./services

# Run as the dedicated non-root user
USER emotionscare

# Health check to ensure the API is responding
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "\
    const http = require('http');\
    const options = {\
      hostname: 'localhost',\
      port: process.env.PORT || process.env.API_PORT || 8080,\
      path: '/health',\
      method: 'GET',\
      timeout: 2000\
    };\
    const req = http.request(options, (res) => {\
      process.exit(res.statusCode === 200 ? 0 : 1);\
    });\
    req.on('error', () => process.exit(1));\
    req.on('timeout', () => process.exit(1));\
    req.end();\
  "

# Expose the Fastify port
EXPOSE 8080

# Use dumb-init for proper PID 1 signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the compiled Fastify server
CMD ["node", "dist/server.js"]
