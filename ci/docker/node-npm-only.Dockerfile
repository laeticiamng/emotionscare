FROM node:18-alpine

# Remove Bun if present
RUN apk del --no-cache bun && rm -f /usr/local/bin/bun || true

# Disable Yarn/Bun auto via Corepack
ENV COREPACK_ENABLE=0

WORKDIR /app

CMD ["node"]
