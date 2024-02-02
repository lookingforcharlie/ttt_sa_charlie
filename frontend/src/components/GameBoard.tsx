import React, { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

type BoardElement = 'X' | 'O' | null;
type Role = 'X' | 'O' | '';

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

export default function GameBoard({
  playerName,
  player1,
  player2,
  roomName,
  socket,
  setInRoom,
  setPlayerName,
  setRoomName,
  setIndicator,
}: GameBoardProps) {
  const [board, setBoard] = useState<BoardElement[]>(Array(9).fill(null));
  const [role, setRole] = useState<Role>('');
  // game starts from X player
  const [myTurn, setMyTurn] = useState<boolean>(true);

  const handleClick = (index: number) => {
    console.log(index);

    setBoard((prev) => {
      const tempBoard = [...prev];
      if (role !== '') {
        tempBoard[index] = role;
      }
      return tempBoard;
    });

    setMyTurn((prevTurn) => !prevTurn);

    socket.emit('send_move', { index, role, player: playerName });
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

  return (
    <div className='flex flex-col items-center'>
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
      <div>{role === 'X' ? 'O' : 'X'}</div>
      <div className='grid grid-cols-3'>
        {board.map((ele, idx) => {
          return (
            <button
              key={idx}
              className={`border-2 border-emerald-950 w-20 h-20 bg-emerald-100 hover:bg-emerald-200 focus:outline-none text-6xl`}
              disabled={!myTurn}
              onClick={() => handleClick(idx)}
            >
              {ele}
            </button>
          );
        })}
      </div>
    </div>
  );
}
