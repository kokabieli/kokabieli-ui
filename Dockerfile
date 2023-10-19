# --------------> The build image
FROM node:20.8.1 AS build
WORKDIR /usr/src/app
COPY scripts /usr/src/app/scripts
COPY package*.json /usr/src/app/
RUN npm ci
RUN npm run postinstall
COPY . /usr/src/app/
RUN npm run build
# --------------> The production image
FROM httpd:2.4.57-alpine
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf
COPY --from=build /usr/src/app/build /usr/local/apache2/htdocs/