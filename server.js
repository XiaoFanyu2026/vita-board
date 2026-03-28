const WebSocket = require('ws');
const http = require('http');
const { setupWSConnection } = require('y-websocket/bin/utils');

const port = process.env.PORT || 1234;
const host = '0.0.0.0';

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Yjs WebSocket Server is running.');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (conn, req) => {
  console.log('New connection established');
  setupWSConnection(conn, req, {
    gc: true,
  });
});

server.listen(port, host, () => {
  console.log(`WebSocket server is running on ws://${host}:${port}`);
});
