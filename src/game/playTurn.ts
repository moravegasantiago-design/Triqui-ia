import type { Dispatch, SetStateAction } from "react";
import type { Cell } from "../Card";
import { serializeBoard } from "../ia/seralizeBoard";
import { miniMax } from "../ia/ia";
type playProps = {
  turnPlayer?: boolean;
  setTurnPlayer: Dispatch<SetStateAction<boolean>>;
  x?: number;
  y?: number;
  board?: Cell[][];
  setBoard: Dispatch<SetStateAction<Cell[][]>>;
};
const playHuman = (props: playProps) => {
  const { board, setBoard, x, y, setTurnPlayer } = props;
  if (x === undefined || !board || y === undefined) return false;
  if (board[y][x] !== "") return false;
  setTurnPlayer(true);
  setBoard((count) => {
    const cursor = "X";
    const newBoard = count.map((a) => [...a]);
    newBoard[y][x] = cursor;
    return newBoard;
  });
  return true;
};

const playIa = (props: playProps) => {
  const { setBoard, setTurnPlayer } = props;
  setTimeout(() => {
    setBoard((count) => {
      const tranformer = serializeBoard({ arrays: count });
      const resIa = miniMax({ array: tranformer, shift: true });
      if (resIa.x === undefined || resIa.y === undefined) return count;
      const copyCount = count.map((c) => [...c]);
      copyCount[resIa.y][resIa.x] = "O";
      return copyCount;
    });
    setTurnPlayer(false);
  }, 500);
};

export const addOption = (props: playProps) => {
  const { x, y, setBoard, board, setTurnPlayer, turnPlayer } = props;
  const checker = playHuman({
    board: board,
    setBoard: setBoard,
    x: x,
    y: y,
    setTurnPlayer: setTurnPlayer,
    turnPlayer,
  });
  if (!checker) return;
  playIa({
    setBoard: setBoard,
    setTurnPlayer: setTurnPlayer,
  });
};
