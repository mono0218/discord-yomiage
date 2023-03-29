FROM node:19.7.0

COPY ./ /usr/app

WORKDIR /usr/app
RUN npm install

CMD ["node","index.js"]