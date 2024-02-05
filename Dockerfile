# BUILD
FROM node:21-alpine3.18 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm cache clean --force
RUN npm install
COPY . .
RUN npm run build


# RUN
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/second-sportsleader /usr/share/nginx/html