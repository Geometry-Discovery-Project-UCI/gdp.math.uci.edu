FROM docker.io/library/node:lts-alpine as page
COPY . /src
WORKDIR /src
RUN npm install && npm run build && mv /src/dist /output

FROM docker.io/library/caddy:2
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=page /output /srv

EXPOSE 80

WORKDIR /srv
ENTRYPOINT ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
