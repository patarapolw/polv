FROM node:12-alpine

WORKDIR /app
RUN apk add git

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile --production
COPY . .

ENTRYPOINT [ "yarn", "start" ]
