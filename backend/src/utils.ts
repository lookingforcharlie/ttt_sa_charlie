import { BoardElement, Rooms } from '../src/types';

// Define winning combinations for checkGameResult()
const WIN_COMBINATIONS: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function makeObjectEmpty(obj: Rooms) {
  Object.keys(obj).forEach((key) => delete obj[key]);
}

export function checkGameResult(
  board: BoardElement[]
): BoardElement | null | string {
  // Check for a win
  for (const combination of WIN_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  // Check for a tie
  if (!board.includes(null)) {
    return 'tie';
  }
  // No winner yet
  return null;
}

export function nullArray(myArray: (string | null)[]) {
  for (let i = 0; i < myArray.length; i++) {
    myArray[i] = null;
  }
  return myArray;
}
