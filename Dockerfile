# ---- Stage 1: Get Pocketbase ----
FROM alpine:3.20 AS pb

WORKDIR /app/pb

ADD --checksum=sha256:b84c17b64c8bef5632dd8348176392159592424675c2c0d863d6521f92fc0a93 \
    https://github.com/pocketbase/pocketbase/releases/download/v0.22.12/pocketbase_0.22.12_linux_amd64.zip \
    /tmp/pb.zip

RUN apk add --no-cache unzip
RUN unzip -o /tmp/pb.zip && rm /tmp/pb.zip && chmod +x pocketbase

# ---- Stage 2: Build Frontend ----
FROM node:22-alpine AS frontend

WORKDIR /app/sk
COPY ./sk .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

# ---- Stage 3: Runtime ----
FROM node:22-alpine

COPY --from=pb /app/pb/pocketbase /app/pb/pocketbase
COPY pb/pb_hooks/     /app/pb/pb_hooks/
COPY pb/pb_migrations/ /app/pb/pb_migrations/

COPY --from=frontend  /app/sk/build/          /app/sk/build/
COPY --from=frontend  /app/sk/node_modules/   /app/sk/node_modules/
COPY --from=frontend  /app/sk/server.js       /app/sk/server.js

# https://pocketbase.io/docs/going-to-production/#using-docker
RUN apk add --no-cache ca-certificates

WORKDIR /app

ENV NODE_ENV=production \
    # Frontend port
    PORT=59991 \
    # Internal Pocketbase URL.
    # Frontend code relies on this variable.
    POCKETBASE_URL=http://0.0.0.0:59992

# DO NOT CHANGE `/app/pb/pb_data`. Setting `--dir` to anything else breaks the frontend.
CMD ["/bin/sh", "-c", "./pb/pocketbase serve --http 0.0.0.0:59992 --dir ./pb/pb_data --hooksDir ./pb/pb_hooks --migrationsDir ./pb/pb_migrations & node ./sk/server.js"]
