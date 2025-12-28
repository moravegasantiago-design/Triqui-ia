import type { Dispatch, SetStateAction } from "react";
import { serializeBoard } from "../ia/serializeBoard";
import { miniMax } from "../ia/ia";
import { modeEasy } from "../ia/modeEasy";
import type { Cell } from "../type";
type playProps = {
  turnPlayer?: boolean;
  setTurnPlayer: Dispatch<SetStateAction<boolean>>;
  x?: number;
  y?: number;
  board?: Cell[][];
  setBoard: Dispatch<SetStateAction<Cell[][]>>;
  mode?: "impossible" | "medium" | "easy";
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
  const { setBoard, setTurnPlayer, mode } = props;
  if (!mode) return;
  setTimeout(() => {
    setBoard((count) => {
      const transformer = serializeBoard({ arrays: count });
      let resIa: { x?: number; y?: number; score?: number };
      if (mode !== "easy") {
        resIa = miniMax({ array: transformer, shift: true, mode: mode });
      } else resIa = modeEasy({ board: transformer });
      if (resIa.x === undefined || resIa.y === undefined) return count;
      const copyCount = count.map((c) => [...c]);
      copyCount[resIa.y][resIa.x] = "O";
      return copyCount;
    });
    setTurnPlayer(false);
  }, 600);
};

export const addOption = (props: playProps) => {
  const { x, y, setBoard, board, setTurnPlayer, turnPlayer, mode } = props;
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
    mode: mode,
  });
  return;
};
