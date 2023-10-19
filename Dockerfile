# --------------> The runtime dependencies image
FROM node:20.8.1 AS dependencies
WORKDIR /usr/src/app
COPY scripts /usr/src/app/scripts
COPY package*.json /usr/src/app/
RUN npm ci --omit=dev
# --------------> The build image
FROM node:20.8.1 AS build
WORKDIR /usr/src/app
COPY scripts /usr/src/app/scripts
COPY package*.json /usr/src/app/
RUN npm ci
COPY . /usr/src/app/
RUN npm run postinstall
RUN npm run build
# --------------> The production image
FROM node:20.8.1-alpine
RUN apk add dumb-init
ENV NODE_ENV production
USER node
WORKDIR /usr/src/app
COPY --chown=node:node package*.json /usr/src/app/
COPY --chown=node:node --from=dependencies /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node --from=build /usr/src/app/build /usr/src/app
CMD ["dumb-init", "node", "."]