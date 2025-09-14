# syntax=docker/dockerfile:1
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["node", "--loader", "ts-node/esm", "services/api/index.ts"]
