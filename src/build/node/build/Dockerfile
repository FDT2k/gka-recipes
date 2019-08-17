FROM node:10.16.0-alpine

ARG NPM_TOKEN

ADD ./npmrc /root/.npmrc

RUN apk add git
# set working directory
RUN mkdir /app
WORKDIR /app


# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

ADD ./dist /app

RUN npm install

# start app
CMD ["npm", "start"]
