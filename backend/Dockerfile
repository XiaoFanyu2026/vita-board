FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Start both NestJS and Yjs WebSocket server
CMD ["sh", "-c", "node yjs-server.js & npm run start:prod"]
