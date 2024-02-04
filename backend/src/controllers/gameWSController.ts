import { Server, Socket } from 'socket.io';
import logger from '../logger';
import { GameMove, JoinInfo, Rooms } from '../types';
import { checkGameResult, makeObjectEmpty, nullArray } from '../utils';

const gameArray = Array(9).fill(null);
const rooms: Rooms = {};
makeObjectEmpty(rooms);
let roomId: string = '';

// Handle all the game logic
const handleGame = (io: Server, socket: Socket) => {
  logger.info(`New User connected with ${socket.id}`);

  // ws connection error handling
  socket.on('error', (error: Error) => {
    logger.error(`Socket error: ${error.message}`);
  });

  // Handle players joining room, players can game against when they are in the same room
  socket.on('join_room', (data: JoinInfo) => {
    logger.info(`User connection info: ${data}`);

    roomId = data.roomId;
    const player = data.player;

    // clear the players when the player create the room share the same name
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

    // When two players in the room, game will start

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

  // logic for
  socket.on('send_move', (data: GameMove) => {
    logger.info(`Players actions: ${data}`);
    // data.role will be 'X' or 'O', adding it to the game board
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

    // sending one player's move to another base on the move received
    if (result === 'O' || result === 'X') {
      logger.info(`${result} is the winner!`);
      // empty the game board when there's a result
      nullArray(gameArray);
      // send the msg to everyone except the sender
      io.emit('next_movement', nextMoveData);
      // io.emit is server-side method that used to emit an event to all connected clients.
      io.emit('send_result', { winner: data.player });
    } else if (result === 'tie') {
      // empty the game board when there's a result
      nullArray(gameArray);
      // still send the move when the game tied
      io.emit('next_movement', nextMoveData);
      io.emit('send_result', { winner: 'tied' });
    } else if (result === null) {
      io.emit('next_movement', nextMoveData);
    }
  });

  // empty the rooms object when game is over, such as player left the room
  socket.on('ending_game', (data: number) => {
    if (data === 1) {
      makeObjectEmpty(rooms);
    }
  });
};

export default handleGame;
