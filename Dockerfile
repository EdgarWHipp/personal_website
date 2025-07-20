# ---------- 1. Build the application ----------
    FROM node:20-alpine AS deps
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci --omit=dev
    
    FROM node:20-alpine AS builder
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    RUN npm run build
    
    # ---------- 2. Production image ----------
    FROM node:20-alpine AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV PORT=80              
    
    # copy built artefacts
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/.next/standalone ./
    COPY --from=builder /app/.next/static ./.next/static
    
    # non-root user
    RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
    USER nextjs
    
    EXPOSE 80
    CMD ["node", "server.js"]