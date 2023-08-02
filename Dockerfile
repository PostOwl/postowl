FROM node:18-slim AS builder

RUN mkdir /app
# NodeJS app lives here
WORKDIR /app

# Copy source (excludes items filtered by .dockerignore)
COPY . .

# Install node modules and build app
RUN npm ci --omit dev \
    && mkdir data \
    && npm run build

# Create runner image from builder
FROM node:18-slim AS runner
RUN apt-get update -qq \
    && apt-get install -y sqlite3

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/build /app/build
COPY --from=builder /app/.env.production /app/build
COPY --from=builder /app/package.json /app/scripts/schema.sql \
    /app/scripts/start-fly.sh /app/scripts/start-app.js /app

WORKDIR /app
ENV NODE_ENV production

# Start the server
CMD [ "node", "build" ]
