FROM node:19.7.0

COPY ./ /usr/app

WORKDIR /usr/app
RUN npm install

RUN npm run compile

CMD ["node","dist/index.js"]