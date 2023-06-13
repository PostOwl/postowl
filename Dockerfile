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

# copy source across (excludes items filtered by .dockerignore)
COPY . .

RUN mkdir data
RUN --mount=type=secret,id=DB_PATH \
    --mount=type=secret,id=ORIGIN \
    --mount=type=secret,id=ADMIN_PASSWORD \
    --mount=type=secret,id=S3_ACCESS_KEY \
    --mount=type=secret,id=S3_SECRET_ACCESS_KEY \
    --mount=type=secret,id=S3_ENDPOINT \
    --mount=type=secret,id=S3_BUCKET \
    --mount=type=secret,id=PUBLIC_ASSET_PATH \
    DB_PATH="$(cat /run/secrets/DB_PATH)" \
    ORIGIN="$(cat /run/secrets/ORIGIN)" \
    ADMIN_PASSWORD="$(cat /run/secrets/ADMIN_PASSWORD)" \
    S3_ACCESS_KEY="$(cat /run/secrets/S3_ACCESS_KEY)" \
    S3_SECRET_ACCESS_KEY="$(cat /run/secrets/S3_SECRET_ACCESS_KEY)" \
    S3_ENDPOINT="$(cat /run/secrets/S3_ENDPOINT)" \
    S3_BUCKET="$(cat /run/secrets/S3_BUCKET)" \
    PUBLIC_ASSET_PATH="$(cat /run/secrets/PUBLIC_ASSET_PATH)" \
    npm run build

FROM node:18-slim AS runner
RUN apt update -qq && \
    apt install -y sqlite3

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app
COPY --from=builder /app/start.sh /app
COPY --from=builder /app/schema.sql /app
WORKDIR /app
ENV NODE_ENV production

# Start the server by default, this can be overwritten at runtime
CMD [ "node", "build" ]
