FROM node:18-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]