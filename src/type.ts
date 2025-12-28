export type Cell = "" | "X" | "O";
export type gameStatusProps = {
  isWin: boolean;
  winner: "human" | "ia" | "player1" | "player2" | "none";
  isDraw: boolean;
  mode: "ia" | "friend";
  points: number;
};
export type metricsProps = {
  player1?: number;
  player2?: number;
  draw: number;
  gameHistory: ("W" | "L" | "D" | "P1" | "P2")[];
  losses: number;
  wins: number;
};
export type statisticsProps = {
  points: number;
  wins: number;
  losses: number;
  draw: number;
  streak: number;
  gameHistory: ("W" | "L" | "D" | "P1" | "P2")[];
  pvp: metricsProps;
};
export type gameModeProps = {
  mode: "impossible" | "medium" | "easy" | "friend";
  pointsWin: number;
  pointsDraw: number;
  pointsLose: number;
  opponent: "CPU" | "Jugador2";
};

export type CheckStateResult = {
  isWin: boolean;
  winner: "player1" | "player2" | "human" | "ia" | "none";
  isDraw: boolean;
  points: number;
  mode: "friend" | "ia";
};
