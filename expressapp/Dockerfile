FROM node:16

WORKDIR /code/expressap

COPY package.json package.json 

COPY . . 

RUN npm install

EXPOSE 4000

CMD npm run start 
