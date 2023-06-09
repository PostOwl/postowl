FROM node:18-slim

# NodeJS app lives here
WORKDIR /app

# Install packages needed to build node modules
RUN apt update -qq && \
    apt install -y python-is-python3 pkg-config build-essential

# Install node modules
COPY package.json package-lock.json ./
RUN npm ci --omit dev

COPY . .

RUN npm run build

FROM node:18-slim
RUN apt update -qq && \
    apt install -y sqlite3

WORKDIR /app
COPY --from=0 /app ./
COPY . .

# Start the server by default, this can be overwritten at runtime
CMD [ "node", "./build" ]
