import { BoardElement } from '../types';
import { checkGameResult } from '../utils';

describe('checkGameResult', () => {
  it('should return the winner when there is a winning combination', () => {
    const boardWithWinner: BoardElement[] = [
      'X',
      'O',
      'X',
      null,
      'O',
      null,
      'X',
      null,
      'O',
    ];
    const result = checkGameResult(boardWithWinner);
    expect(result).toBeNull();
  });

  it('should return "tie" when the game is a tie', () => {
    const boardTie: BoardElement[] = [
      'X',
      'O',
      'X',
      'O',
      'X',
      'O',
      'O',
      'X',
      'X',
    ];
    const result = checkGameResult(boardTie);
    expect(result).toBe('X');
  });

  it('should return null when there is no winner yet', () => {
    const boardNoWinner: BoardElement[] = [
      'X',
      'O',
      'X',
      'O',
      'O',
      'O',
      null,
      'X',
      'X',
    ];
    const result = checkGameResult(boardNoWinner);
    expect(result).toBe('O');
  });
});
