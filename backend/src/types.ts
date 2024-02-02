export type JoinInfo = {
  player: string;
  roomId: string;
};

type RoomId = string;
type PlayerName = string;

interface Room {
  players: PlayerName[];
}

export interface Rooms {
  [roomId: RoomId]: Room;
}

export type BoardElement = 'X' | 'O' | null;

export type GameMove = {
  index: number;
  role: 'X' | 'O';
  player: string;
};
