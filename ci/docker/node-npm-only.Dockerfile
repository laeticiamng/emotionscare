FROM node:18-alpine

RUN apk del --no-cache bun && rm -f /usr/local/bin/bun || true
ENV COREPACK_ENABLE=0

