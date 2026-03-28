const WebSocket = require('ws');
const http = require('http');
const Y = require('yjs');
const { setupWSConnection } = require('y-websocket/bin/utils');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'vita_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'vita_board',
  password: process.env.DB_PASSWORD || 'vita_password',
  port: 5432,
});

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Yjs WebSocket Server');
});

const wss = new WebSocket.Server({ noServer: true });
const docs = new Map();

server.on('upgrade', async (request, socket, head) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const token = url.searchParams.get('token');
    const docName = url.pathname.slice(1).split('/')[0];

    if (!token) throw new Error('Missing token');
    const decoded = jwt.verify(token, 'super-secret-key'); // Must match NestJS secret
    const userId = decoded.sub;

    // Optional: Check whiteboard permissions in DB here
    const { rows } = await pool.query('SELECT * FROM whiteboards WHERE id = $1', [docName]);
    if (rows.length === 0) {
      // For auto-creation if not exists, or throw
      // throw new Error('Whiteboard not found');
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request, { docName });
    });
  } catch (err) {
    console.error('WS Upgrade Error:', err.message);
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
  }
});

wss.on('connection', (conn, req, { docName }) => {
  setupWSConnection(conn, req, { docName, gc: true });
});

server.listen(1234, '0.0.0.0', () => {
  console.log('Yjs WebSocket Server running on port 1234');
});
