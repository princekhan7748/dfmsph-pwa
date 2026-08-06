# Multi-stage Dockerfile for DFMSPH22 PWA Application on Render / Container Cloud
FROM node:20-slim AS builder

# Install C compiler gcc & make
RUN apt-get update && apt-get install -y gcc make && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy full application codebase
COPY . .

# Compile dfmsph22.c binary for native execution
RUN gcc -O3 -std=c99 dfmsph22.c -lm -o dfmsph22

# Build Vite frontend and Express bundled server.cjs
RUN npm run build

# Production Runtime Container
FROM node:20-slim AS runner

# Install GCC runtime libraries
RUN apt-get update && apt-get install -y libgomp1 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy compiled artifacts from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dfmsph22 ./dfmsph22
COPY --from=builder /app/dfmsph22.c ./dfmsph22.c

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
