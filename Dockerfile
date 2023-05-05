FROM node:18-alpine

WORKDIR /app

COPY package*.json ./app/


COPY . .

RUN yarn install

RUN yarn build

ENV NODE_ENV=production

EXPOSE 4200

CMD ["yarn", "dev"]