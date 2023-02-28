FROM node:16.17.1

WORKDIR /dir/restaurant-api

COPY package.json /dir/restaurant-api

RUN npm install

COPY . /dir/restaurant-api

COPY .env ./.env

EXPOSE 3000

CMD ["npm" , "start"]

