FROM node:18-slim AS builder

RUN mkdir /app
# NodeJS app lives here
WORKDIR /app

# Install packages needed to build node modules
RUN apt update -qq && \
    apt install -y python-is-python3 pkg-config build-essential

# Install node modules
COPY package.json package-lock.json ./
RUN npm ci --omit dev
RUN npm install dotenv

# copy source across (excludes items filtered by .dockerignore)
COPY . .

RUN mkdir data
RUN npm run build

FROM node:18-slim AS runner
RUN apt update -qq && \
    apt install -y sqlite3

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app
COPY --from=builder /app/scripts/fly-start.sh /app
COPY --from=builder /app/scripts/schema.sql /app
COPY --from=builder /app/.env.production /app/build/
WORKDIR /app
ENV NODE_ENV production

# Start the server by default, this can be overwritten at runtime
CMD [ "node", "build" ]
