# SmartChess Server

This version keeps the server as the authoritative source of chess state. The browser and ESP32 send move requests; the Node server validates them with `chess.js`, updates the official position, and broadcasts the updated state.

## Run locally

```bash
npm install
npm start
```

Then open:

```txt
http://localhost:3000
```

## Run tests

```bash
npm test
```

## Current structure

```txt
smart-chess-server/
├── server.js
├── package.json
├── package-lock.json
├── .env.example
├── public/
│   ├── index.html
│   ├── client.js
│   └── styles.css
├── src/
│   ├── config/
│   │   └── env.js
│   ├── http/
│   │   └── app.js
│   ├── chess/
│   │   ├── gameManager.js
│   │   ├── moveParser.js
│   │   └── squareMapping.js
│   └── websocket/
│       ├── websocketServer.js
│       ├── messageHandlers.js
│       └── protocol.js
├── deploy/
└── tests/
```

## Main roles

- `server.js`: small startup file that creates the HTTP server and attaches WebSockets.
- `public/`: browser-facing files.
- `src/http/app.js`: Express setup and HTTP API routes.
- `src/chess/gameManager.js`: authoritative `chess.js` game state, legal moves, game-over status, reset, undo, and FEN loading.
- `src/chess/moveParser.js`: converts incoming move payloads into `chess.js`-compatible move objects.
- `src/chess/squareMapping.js`: converts ESP32 row/column coordinates into chess squares.
- `src/websocket/`: WebSocket setup, message routing, and shared protocol strings.

## HTTP API routes

```txt
GET  /api/test
GET  /api/state
GET  /api/legal-moves?square=e2
POST /api/move
POST /api/reset
POST /api/undo
POST /api/load-fen
```

Example HTTP move body:

```json
{ "move": "e2e4" }
```

Example FEN body:

```json
{ "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" }
```

## WebSocket message types

Client to server:

```txt
browser:hello
esp32:hello
move:virtualboard
move:physicalboard
game:state:request
game:legalmoves:request
game:reset
game:undo
game:loadfen
```

Server to client:

```txt
server:hello
game:state
game:legalmoves
move:rejected
error
```

## Accepted move formats

Virtual/browser moves:

```json
{ "type": "move:virtualboard", "move": "e2e4" }
```

Promotion:

```json
{ "type": "move:virtualboard", "move": "e7e8q" }
```

Physical-board row/column move:

```json
{
  "type": "move:physicalboard",
  "from_row": 6,
  "from_col": 4,
  "to_row": 4,
  "to_col": 4
}
```

Direct square object:

```json
{ "type": "move:physicalboard", "from": "e2", "to": "e4" }
```

The current coordinate assumption is row 0 = rank 8 and col 0 = file a.

## Notes for AWS later

The server already uses environment variables through `src/config/env.js`:

```txt
PORT
HOST
NODE_ENV
```

For local use, the defaults are fine. On AWS, set `PORT` and other environment variables from the hosting platform instead of hardcoding them in the app.
