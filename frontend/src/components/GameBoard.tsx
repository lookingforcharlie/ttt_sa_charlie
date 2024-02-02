'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import trophy from '../app/trophy.png';

interface GameBoardProps {
  playerName: string;
  player1: string;
  player2: string;
  roomName: string;
  socket: Socket;
  setInRoom: (value: React.SetStateAction<boolean>) => void;
  setPlayerName: (value: React.SetStateAction<string>) => void;
  setRoomName: (value: React.SetStateAction<string>) => void;
  setIndicator: (value: React.SetStateAction<string>) => void;
}

type BoardElement = 'X' | 'O' | null;
type Role = 'X' | 'O' | '';

const GameBoard = ({
  playerName,
  player1,
  player2,
  roomName,
  socket,
  setInRoom,
  setPlayerName,
  setRoomName,
  setIndicator,
}: GameBoardProps) => {
  const [board, setBoard] = useState<BoardElement[]>(Array(9).fill(null));
  const [role, setRole] = useState<Role>(playerName === player1 ? 'X' : 'O');
  // game starts from X player
  const [myTurn, setMyTurn] = useState<boolean>(role === 'X');

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modelContent, setModelContent] = useState('You are the winner!');
  const [winner, setWinner] = useState('');

  const handleClick = (index: number) => {
    console.log(index);

    // setBoard((prev) => {
    //   const tempBoard = [...prev];
    //   if (role !== '') {
    //     tempBoard[index] = role;
    //   }
    //   return tempBoard;
    // });

    setMyTurn((prevTurn) => !prevTurn);

    socket.emit('send_move', { index, role, player: playerName });
  };

  const handlePlayAgain = () => {
    setShowModal(false);
    setWinner('');
    // socket.emit('play_again', 1); // add 1 , the code start working, so weird why?
  };

  const handleLeave = () => {
    setInRoom(false);
    setRoomName('');
    setPlayerName('');
    setIndicator('Create or find a room to play against another player');
    setWinner('');

    socket.emit('ending_game', 1);
  };

  type NextMoveData = {
    movement: BoardElement[];
    last_player: string;
    role: 'O' | 'X';
    done: boolean;
  };

  useEffect(() => {
    socket.on('next_movement', (nextMoveData: NextMoveData) => {
      console.log(nextMoveData.movement);
      console.log(nextMoveData.last_player);

      if (playerName !== nextMoveData.last_player) {
        setBoard(nextMoveData.movement);
        setRole(nextMoveData.role);
        setMyTurn(nextMoveData.done);
      }
      setBoard(nextMoveData.movement);
    });

    // socket.on('new_game', (emptyArray: BoardElement[]) => {
    //   setBoard(emptyArray);
    // });
    // socket.removeAllListeners();
  }, [socket]);

  useEffect(() => {
    socket.on('send_result', (data) => {
      // Handle the data received from the backend
      if (data.winner === player1 || data.winner === player2) {
        console.log(`${data.winner} is the winner!`);
        setModelContent(`${data.winner} is the winner!`);
        setWinner(data.winner);
      } else if (data.winner === 'tied') {
        setModelContent(`The game ${data.winner}.`);
      }

      setShowModal(true);
    });
  }, [socket]);

  return (
    <div className='flex flex-col items-center justify-start -mt-12'>
      <div className='flex flex-col items-center justify-center gap-4'>
        <div className='text-center'>
          <div className='text-lg font-semibold'>
            Game in on in Room: {roomName}
          </div>
          <div>Who starts the game is decided randomly.</div>
        </div>
        <div className='flex w-full items-center justify-between text-rose-800'>
          <div>
            {playerName} are playing {role}
          </div>
          <div>
            {player1 === playerName ? player2 : player1} is playing{' '}
            {role === 'X' ? 'O' : 'X'}
          </div>
        </div>
      </div>
      <div className='grid grid-cols-3 mt-12'>
        {board.map((ele, idx) => {
          return (
            <button
              key={idx}
              className={`border-2 border-green-900 w-[6rem] h-[6rem] bg-emerald-100 hover:bg-emerald-200 focus:outline-none text-6xl ${
                !myTurn ? 'wait-indicator' : ''
              }`}
              onClick={() => handleClick(idx)}
              disabled={!myTurn}
            >
              {ele}
            </button>
          );
        })}
      </div>

      {/* model starts here */}
      {showModal ? (
        <div className='absolute backdrop-blur-md mt-10 flex justify-center items-center flex-col w-2/3 rounded-lg shadow-xl h-auto p-2'>
          <Image
            src={trophy}
            width={100}
            height={100}
            alt='trophy'
            className='mt-4'
          />
          <h2 className='text-2xl mt-4 text-gray-800 font-semibold text-center mx-4'>
            {modelContent}
          </h2>
          <div className='flex gap-5 mb-4'>
            <button
              className='my-5 w-auto px-10 h-10 bg-emerald-600 hover:bg-emerald-800 text-white rounded-md shadow hover:shadow-lg font-semibold'
              onClick={handlePlayAgain}
            >
              Play again
            </button>
            <button
              className=' w-auto px-4 my-5 border border-red-200 h-10 bg-red-200 hover:bg-red-700 hover:text-white rounded-md text-red-600  hover:shadow-lg font-semibold'
              onClick={handleLeave}
            >
              Leave the room
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default GameBoard;

// Play again: setBoard(Array(9).fill(null), socket.emit('reset_game')
// Leave the room: setInRoom(false), socket.emit('end_game')
