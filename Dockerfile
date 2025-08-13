FROM node:22.18.0-slim

RUN apt update -y && apt upgrade -y && apt install -y curl wget netcat-traditional procps git python3 build-essential && \
  curl https://raw.githubusercontent.com/eficode/wait-for/v2.2.4/wait-for --output /usr/bin/wait-for && \
  chmod +x /usr/bin/wait-for

RUN npm i -g npm npm-check-updates kill-port @nestjs/cli@11.0.10 pnpm@10.14.0

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN mkdir -p /home/node/.npm
RUN chown -R 1000:1000 /home/node/.npm

RUN npm cache clean --force

USER node

WORKDIR /app

EXPOSE 3900 3901
