FROM node:16-alpine3.16
COPY . /usr/app
WORKDIR /usr/app
RUN npm install  --production
ENTRYPOINT ["npm","run","start"]