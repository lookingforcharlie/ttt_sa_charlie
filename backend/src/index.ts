import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import logger from './logger';
import mongoConnect from './mongoMemoryServer';
dotenv.config();

import handleGame from './controllers/gameWSController';
import handleGetScoreboard from './controllers/getScoreboardController';
import handleSaveScoreboard from './controllers/saveScoreboardController';

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

// a function that will run every time a client connect to the server
// and the function will create a socket connection for each client
io.on('connection', (socket) => {
  handleGame(io, socket);
});

app.get('/scoreboard', handleGetScoreboard);

app.post('/scoreboard', handleSaveScoreboard);

app.get('/', (req: Request, res: Response) => {
  res.send('Hi, I am WebSocket.');
});

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
