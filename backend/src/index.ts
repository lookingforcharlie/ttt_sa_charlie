import cors from 'cors'; // Import the cors middleware
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import logger from './logger';
import mongoConnect from './mongoMemoryServer';
import scoreboardSchema from './scoreboard.model';
import { GameMove, JoinInfo, Rooms } from './types';
import { checkGameResult, makeObjectEmpty, nullArray } from './utils';

dotenv.config();
const port = process.env.PORT || 3001;

export const app = express();
app.use(express.json());
app.use(cors());

// socket.io is built upon http server
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

const gameArray = Array(9).fill(null);

// const rooms: Rooms = {
//   room1: {
//     players: ['playerName1', 'playerName2'],
//   },
//   room2: {
//     players: ['playerName3', 'playerName4'],
//   },
// };
const rooms: Rooms = {};
makeObjectEmpty(rooms);

let roomId: string = '';

// a function that will run every time a client connect to the server
// and the function will give a socket connection for each of them
io.on('connection', (socket) => {
  // every instance of connection will have an unique id
  logger.info(`New User connected with ${socket.id}`);

  // console.log(socket.id);
  socket.on('error', (error: Error) => {
    logger.error(`Socket error: ${error.message}`);
    // You can handle the error as needed, e.g., disconnect the socket
    // socket.disconnect(true);
  });

  // console.log(gameArray);

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
    // data type: { index: 0, role: 'X', player: 'charlie' }
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
      // send the msg to everyone except the sender
      nullArray(gameArray);
      io.emit('next_movement', nextMoveData);

      // io.emit is server-side method that used to emit an event to all connected clients.
      io.emit('send_result', { winner: data.player });
    } else if (result === 'tie') {
      // still send the move when the game tied
      io.emit('next_movement', nextMoveData);
      io.emit('send_result', { winner: 'tied' });
    } else if (result === null) {
      // console.log(nextMoveData);
      // socket.broadcast.emit('next_movement', nextMoveData);

      io.emit('next_movement', nextMoveData);
    }
  });
});

// get scoreboard info from in-memory MongoDB
app.get('/scoreboard', (req: Request, res: Response) => {
  scoreboardSchema
    .find({})
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ error });
    });
});

// save scoreboard in in-memory MongoDB
app.post('/scoreboard', (req: Request, res: Response) => {
  const { playerName, result } = req.body;
  try {
    const scoreboard = new scoreboardSchema({
      playerName,
      result,
    });

    scoreboard
      .save()
      .then(() => {
        return res.json({ message: 'Scoreboard saved successfully' });
      })
      .catch((error) => {
        return res.json({ error });
      });
  } catch (error) {
    logger.error('Invalid Add Request');
    res.json({ error: 'Invalid Add Request' });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, I am the Server');
});

// Start ws server
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
