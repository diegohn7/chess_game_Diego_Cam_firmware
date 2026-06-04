# SmartChess chess.js integration

This draft makes the Node server the authoritative source of game state.

## Setup

```bash
npm install
npm start
```

## What chess.js handles now

- Legal move validation.
- Turn order.
- Captures.
- Castling.
- En passant.
- Promotion.
- Check.
- Checkmate.
- Stalemate.
- Insufficient material.
- Threefold repetition.
- Fifty-move rule.
- FEN and PGN output.
- Undo.
- Legal move listing.

## Current server behavior

- The browser no longer applies moves as the source of truth.
- The browser sends move requests and waits for `game:state` from the server.
- New clients receive the current board state immediately on connection.
- Physical-board promotion defaults to queen if no promotion piece is supplied.
- Rejected moves include a reason and, when possible, legal alternatives.

## ESP32 move format

The server accepts either:

```json
{ "type": "move:physicalboard", "move": "e2e4" }
```

or row/column coordinates:

```json
{ "type": "move:physicalboard", "from_row": 6, "from_col": 4, "to_row": 4, "to_col": 4 }
```

or direct squares:

```json
{ "type": "move:physicalboard", "from": "e2", "to": "e4" }
```

The current coordinate assumption is row 0 = rank 8 and col 0 = file a.
