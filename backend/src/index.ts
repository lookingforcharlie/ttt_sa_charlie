import cors from 'cors'; // Import the cors middleware
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

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

// a function that will run every time a client connect to the server
// and the function will give a socket connection for each of them
io.on('connection', (socket) => {
  // every instance of connection will have an unique id
  console.log(`New User connected with ${socket.id}`);

  // error handling for io connection
  socket.on('error', (error: Error) => {
    console.log(`Socket error: ${error.message}`);
    // You can handle the error as needed, e.g., disconnect the socket
    // socket.disconnect(true);
  });

  socket.on('sending_message', (msg: string) => {
    console.log(msg);
    // socket.disconnect();
  });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, I am the Server');
});

// Start ws server
server.listen(port, () => {
  console.log(`Socket server is running on http://localhost:${port}`);
});
