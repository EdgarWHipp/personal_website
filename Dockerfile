FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./

# Add build args for all required env variables
ARG REACT_APP_ELEVENLABS_API_KEY
ARG REACT_APP_KIMI_API_URL
ARG REACT_APP_MOONSHOT_KEY
ARG REACT_APP_SUPABASE_ANON_KEY
ARG REACT_APP_SUPABASE_URL

# Set them as ENV so react-scripts can use them
ENV REACT_APP_ELEVENLABS_API_KEY=$REACT_APP_ELEVENLABS_API_KEY
ENV REACT_APP_KIMI_API_URL=$REACT_APP_KIMI_API_URL
ENV REACT_APP_MOONSHOT_KEY=$REACT_APP_MOONSHOT_KEY
ENV REACT_APP_SUPABASE_ANON_KEY=$REACT_APP_SUPABASE_ANON_KEY
ENV REACT_APP_SUPABASE_URL=$REACT_APP_SUPABASE_URL

RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build ./build
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1
CMD ["serve", "-s", "build", "-l", "3000"]