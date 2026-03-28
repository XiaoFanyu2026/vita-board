FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Use a lightweight server to serve static files
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-p", "5173"]
