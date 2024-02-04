import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GameMove, JoinInfo, Rooms } from '../src/types';
import logger from './logger';
import mongoConnect from './mongoMemoryServer';
import scoreboardSchema from './scoreboard.model';
import { checkGameResult, makeObjectEmpty, nullArray } from './utils';

import handleGetScoreboard from './controllers/getScoreboardController';
import handleSaveScoreboard from './controllers/saveScoreboardController';

dotenv.config();
const port = process.env.PORT || 3003;

export const app = express();
app.use(express.json());
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

const gameArray = Array(9).fill(null);

const rooms: Rooms = {};
makeObjectEmpty(rooms);

let roomId: string = '';

// a function that will run every time a client connect to the server
// and the function will give a socket connection for each of them
io.on('connection', (socket) => {
  logger.info(`New User connected with ${socket.id}`);

  socket.on('error', (error: Error) => {
    logger.error(`Socket error: ${error.message}`);
  });

  // Code for join a room, only users only interact with each when they join the same room
  socket.on('join_room', (data: JoinInfo) => {
    logger.info(`User connection info: ${data}`);

    roomId = data.roomId;
    const player = data.player;

    if (!rooms[roomId]) {
      rooms[roomId] = { players: [] };
    } else if (rooms[roomId].players.length === 2) {
      rooms[roomId].players = [];
    }

    logger.info(`Rooms: ${rooms}, RoomId: ${roomId}`);

    // Add the player to the room
    rooms[roomId].players.push(player);
    logger.info(`Rooms with users: ${rooms}`);

    socket.join(roomId);

    // Check if there are exactly two players to start the game
    if (rooms[roomId].players.length === 2) {
      // Emit a start game event to all players in the room
      io.to(roomId).emit('start_game', {
        player1: rooms[roomId].players[0],
        player1Role: 'X',
        player2: rooms[roomId].players[1],
        player2Role: 'O',
        message: 'Game is on.',
      });

      logger.info(`Rooms when start the game: ${rooms}`);
    }
  });

  socket.on('send_move', (data: GameMove) => {
    logger.info(`Players actions: ${data}`);
    gameArray[data.index] = data.role;

    const nextMoveData = {
      movement: gameArray,
      last_player: data.player,
      role: data.role === 'X' ? 'O' : 'X',
      done: true,
    };
    logger.info(`Server sending out the other players action: ${nextMoveData}`);

    // check winner or tie
    const result = checkGameResult(gameArray);
    logger.info(`Game result: ${result}`);

    if (result === 'O' || result === 'X') {
      logger.info(`${result} is the winner!`);
      nullArray(gameArray);
      io.emit('next_movement', nextMoveData);

      io.emit('send_result', { winner: data.player });
    } else if (result === 'tie') {
      io.emit('next_movement', nextMoveData);
      io.emit('send_result', { winner: 'tied' });
    } else if (result === null) {
      io.emit('next_movement', nextMoveData);
    }
  });

  socket.on('ending_game', (data: number) => {
    if (data === 1) {
      makeObjectEmpty(rooms);
    }
  });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hi, I am socket.');
});

// get scoreboard info from in-memory MongoDB
// app.get('/scoreboard', (req: Request, res: Response) => {
//   scoreboardSchema
//     .find({})
//     .then((data) => {
//       res.json(data);
//     })
//     .catch((error) => {
//       res.json({ error });
//     });
// });

app.get('/scoreboard', handleGetScoreboard);

app.post('/scoreboard', handleSaveScoreboard);

mongoConnect()
  .then(() => {
    try {
      server.listen(port, () => {
        logger.info(`Socket server is running on http://localhost:${port}`);
      });
    } catch (error) {
      logger.error('Invalid socket connection');
    }
  })
  .catch((error: Error) => {
    console.log(`Invalid MongoDB connection: ${error.message}`);
  });
