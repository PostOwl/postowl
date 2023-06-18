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
    --mount=type=secret,id=PUBLIC_ORIGIN \
    --mount=type=secret,id=ADMIN_NAME \
    --mount=type=secret,id=ADMIN_EMAIL \
    --mount=type=secret,id=ADMIN_PASSWORD \
    --mount=type=secret,id=SMTP_SERVER \
    --mount=type=secret,id=SMTP_PORT \
    --mount=type=secret,id=SMTP_USERNAME \
    --mount=type=secret,id=SMTP_PASSWORD \
    DB_PATH="$(cat /run/secrets/DB_PATH)" \
    ORIGIN="$(cat /run/secrets/ORIGIN)" \
    PUBLIC_ORIGIN="$(cat /run/secrets/PUBLIC_ORIGIN)" \
    ADMIN_NAME="$(cat /run/secrets/ADMIN_NAME)" \
    ADMIN_EMAIL="$(cat /run/secrets/ADMIN_EMAIL)" \
    ADMIN_PASSWORD="$(cat /run/secrets/ADMIN_PASSWORD)" \
    SMTP_SERVER="$(cat /run/secrets/SMTP_SERVER)" \
    SMTP_PORT="$(cat /run/secrets/SMTP_PORT)" \
    SMTP_USERNAME="$(cat /run/secrets/SMTP_USERNAME)" \
    SMTP_PASSWORD="$(cat /run/secrets/SMTP_PASSWORD)" \
    npm run build

FROM node:18-slim AS runner
RUN apt update -qq && \
    apt install -y sqlite3

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app
COPY --from=builder /app/scripts/fly-start.sh /app
COPY --from=builder /app/scripts/schema.sql /app
WORKDIR /app
ENV NODE_ENV production

# Start the server by default, this can be overwritten at runtime
CMD [ "node", "build" ]
