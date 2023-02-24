FROM node:lts-alpine as api

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build

USER 1000

CMD ["npm", "run", "start:prod"]

FROM postgres AS db

COPY src/migrations/init.sql /docker-entrypoint-initdb.d/