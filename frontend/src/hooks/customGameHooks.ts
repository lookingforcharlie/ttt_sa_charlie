import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { BoardElement, NextMoveData, Role } from '../type/types';

// handle the on-going game movements: no result such as win or tie yet
export const useMoveEffect = (
  socket: Socket,
  playerName: string,
  setBoard: React.Dispatch<React.SetStateAction<BoardElement[]>>,
  setRole: React.Dispatch<React.SetStateAction<Role>>,
  setMyTurn: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    socket.on('next_movement', (nextMoveData: NextMoveData) => {
      if (playerName !== nextMoveData.last_player) {
        setBoard(nextMoveData.movement);
        setRole(nextMoveData.role);
        setMyTurn(nextMoveData.done);
      }
      setBoard(nextMoveData.movement);
    });
  }, [socket]);
};

// Handle a result comes from server, result is winner's name or tie
export const useResultEffect = (
  socket: Socket,
  player1: string,
  player2: string,
  setModelContent: React.Dispatch<React.SetStateAction<string>>,
  setWinner: React.Dispatch<React.SetStateAction<string>>,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    socket.on('send_result', (data) => {
      if (data.winner === player1 || data.winner === player2) {
        setModelContent(`${data.winner} is the winner!`);
        setWinner(data.winner);
      } else if (data.winner === 'tied') {
        setModelContent(`The game ${data.winner}.`);
      }

      setShowModal(true);
    });
  }, [socket]);
};

// Once there's a winner, save it to DB
export const useSaveWinnerEffect = (
  winner: string | undefined,
  saveWinner: (playerName: string, result: string) => Promise<void>
) => {
  useEffect(() => {
    if (winner) {
      const winnerName = winner;
      saveWinner(winnerName, 'winner');
    }
  }, [winner]);
};
