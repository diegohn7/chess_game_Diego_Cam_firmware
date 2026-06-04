// SmartChess server entry point.
// Most implementation details live under src/ so local and future AWS deployment stay cleaner.
const http = require("http");
const { createApp } = require("./src/http/app");
const { attachWebSocketServer } = require("./src/websocket/websocketServer");
const { port, host } = require("./src/config/env");

const app = createApp();
const server = http.createServer(app);

attachWebSocketServer(server);

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
