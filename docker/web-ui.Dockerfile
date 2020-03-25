FROM node:8.15 as builder
MAINTAINER Masayuki Ito <masayuki.itou.work@gmail.com>

WORKDIR /web-ui/
COPY web-ui/ .
COPY proto/ .
RUN npm install
RUN npx webpack app.js

FROM nginx:1.17.9
COPY --from=builder /web-ui/ /usr/share/nginx/html/
EXPOSE 80
