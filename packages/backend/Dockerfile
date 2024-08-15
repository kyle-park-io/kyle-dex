## build stage
# node version
FROM node:16 AS builder

# set dir
WORKDIR /usr/src/app

# copy package.json
COPY production/package*.json ./

# copy tsconfig.json
COPY production/tsconfig.json ./

# install dependency
RUN npm install

# copy code
COPY src ./

# build
RUN npm run build


## prod stage
# node version
FROM node:16-slim

# install git
RUN apt-get update && apt-get install -y git \
  vim

# set dir
WORKDIR /usr/src/app

# copy builder package.json
COPY --from=builder /usr/src/app/package*.json ./

# install prod dependency
RUN npm install --only=production

# copy build stage files
COPY --from=builder /usr/src/app/dist ./dist
COPY build ./build
COPY config ./config
COPY config-prod ./config-prod
COPY artifacts ./artifacts
COPY scripts ./scripts

# set env
ENV NODE_ENV="production"

# alarm port
EXPOSE 8080

# run server
RUN chmod +x scripts/start-server.sh
ENTRYPOINT ["scripts/start-server.sh"]

