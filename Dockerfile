# --------------> The build image
FROM node:22.2.0 AS build
WORKDIR /usr/src/app
COPY scripts /usr/src/app/scripts
COPY package*.json /usr/src/app/
RUN npm ci
COPY . /usr/src/app/
RUN npm run postinstall
RUN npm run build
# --------------> The production image
FROM  ghcr.io/nginxinc/nginx-unprivileged:1.27.0-alpine-slim
WORKDIR /usr/share/nginx/html
COPY Docker.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html