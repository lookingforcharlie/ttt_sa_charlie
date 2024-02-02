'use client';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import GameBoard from './GameBoard';

// socket.on listens for incoming events from the other side (server or client).
// On the client side, socket.on is used to listen for events emitted by the server.

type GameStartData = {
  player1: string;
  player1Role: 'X' | 'O';
  player2: string;
  player2Role: 'X' | 'O';
  message: string;
};

const TicTacToe = () => {
  const [playerName, setPlayerName] = useState('');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [roomName, setRoomName] = useState<string>('');
  const [indicator, setIndicator] = useState<string>(
    'Create or find a room to play against another player'
  );

  const [joining, setJoining] = useState(false);
  const [inRoom, setInRoom] = useState(false);

  // Creating the socket connection between server and client
  const socket = io('http://localhost:3001', {
    transports: ['websocket'],
  });

  // confirm the socket connection from the client side
  // 'connect' is the reserved variable of event name for check the connection
  socket.on('connect', () => {
    console.log(`You connected with id: ${socket.id}`);
  });

  // handle error msg
  socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim() !== '' || socket) {
      socket.emit('join_room', { player: playerName, roomId: roomName });
    }
    setJoining(true);
    setIndicator('Waiting for another player joining ...');
    // setPlayerName('');
  };

  useEffect(() => {
    socket.on('start_game', (startData: GameStartData) => {
      console.log(startData);
      setPlayer1(startData.player1);
      setPlayer2(startData.player2);
      setInRoom(true);
      setJoining(false);
    });
  }, [socket]);

  return (
    <div className='flex flex-col items-center space-y-8 w-1/2'>
      {inRoom && (
        <GameBoard
          playerName={playerName}
          roomName={roomName}
          socket={socket}
          player1={player1}
          player2={player2}
          setInRoom={setInRoom}
          setPlayerName={setPlayerName}
          setRoomName={setRoomName}
          setIndicator={setIndicator}
        />
      )}
      {/* <h1>------------------- GameBoard ------------------</h1> */}

      {!inRoom && (
        <>
          <h1 className='text-rose-800 text-center text-xl font-semibold'>
            {indicator}
          </h1>
          <form className='flex flex-col w-full gap-4' onSubmit={joinRoom}>
            <input
              className='w-full p-2 focus:outline-none border-2 rounded'
              placeholder='Enter your name...'
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value.trim());
              }}
            />
            <input
              className='w-full p-2 focus:outline-none border-2 rounded'
              placeholder='Enter room name...'
              value={roomName}
              onChange={(e) => {
                setRoomName(e.target.value.trim());
              }}
            />
            <button
              type='submit'
              disabled={!roomName.trim() || !playerName.trim()}
              className='w-full h-10 px-2 bg-gray-300 disabled:bg-gray-300 disabled:text-gray-400 hover:bg-gray-400 text-gray-800 rounded-md shadow-md transition-colors duration-200 ease-in-out'
            >
              {joining ? 'Joining...' : 'Start a New Game'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default TicTacToe;

// onSubmit={joinRoom}
// when server return that there are two players, and two players' name ( X and O ), start the game, SetIsReady(true)
// when isReady to true, setJoining(false), the ttt game board shows up

import { Tester } from './Tester';
