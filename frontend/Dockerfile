# Dockerfile
FROM node:alpine

WORKDIR /usr/app

COPY ./package.json ./

RUN npm install

COPY ./ ./

# Start
CMD [ "npm", "start" ]
EXPOSE 3000
