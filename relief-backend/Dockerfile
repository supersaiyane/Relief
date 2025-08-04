# Stage 1: Install dependencies
FROM node:18-alpine AS builder
WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

# Stage 2: Run app
FROM node:18-alpine
WORKDIR /app

# Copy built artifacts and deps
COPY --from=builder /app .

EXPOSE 3000
CMD ["node", "index.js"]