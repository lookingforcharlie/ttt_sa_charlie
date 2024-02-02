import React, { useState } from 'react';

type BoardElement = 'X' | 'O' | null;
type Role = 'X' | 'O' | '';

interface GameBoardProps {
  playerName: string;
  roomName: string;
  setRoomName: (value: React.SetStateAction<string>) => void;
}

export default function GameBoard({
  playerName,
  roomName,
  setRoomName,
}: GameBoardProps) {
  const [board, setBoard] = useState<BoardElement[]>(Array(9).fill(null));
  const [role, setRole] = useState<Role>('');
  // game starts from X player
  const [myTurn, setMyTurn] = useState<boolean>(true);
  return (
    <div className='flex flex-col items-center'>
      <div>Game in on in Room: {roomName}</div>
      <div>Who starts the game is decided randomly.</div>
      <div>
        {playerName} are playing {role}
      </div>
      <div>{role === 'X' ? 'O' : 'X'}</div>
      <div className='grid grid-cols-3'>
        {board.map((ele, idx) => {
          return (
            <button
              key={idx}
              className={`border-2 border-emerald-950 w-20 h-20 bg-emerald-100 hover:bg-emerald-200 focus:outline-none text-6xl`}
              disabled={!myTurn}
            >
              {ele}
            </button>
          );
        })}
      </div>
    </div>
  );
}
