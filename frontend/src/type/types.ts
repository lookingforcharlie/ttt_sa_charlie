export type NextMoveData = {
  movement: BoardElement[];
  last_player: string;
  role: 'O' | 'X';
  done: boolean;
};

export type BoardElement = 'X' | 'O' | null;
export type Role = 'X' | 'O' | '';

export type GameStartData = {
  player1: string;
  player1Role: 'X' | 'O';
  player2: string;
  player2Role: 'X' | 'O';
  message: string;
};
