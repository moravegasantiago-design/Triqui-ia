import type { Dispatch, SetStateAction } from "react";
import { serializeBoard } from "../ia/serializeBoard";
import type { Cell } from "../type";
import { checkTie, checkWin } from "../ia/rules";

type playerProps = {
  setTurnPlayer: Dispatch<SetStateAction<boolean>>;
  turnPlayer: boolean;
  setBoard: Dispatch<SetStateAction<Cell[][]>>;
  x: number;
  y: number;
  board: Cell[][];
};
export const playerVsPlayer = (props: playerProps) => {
  const { setTurnPlayer, turnPlayer, setBoard, x, y, board } = props;
  setBoard((prev) => {
    const boardTran = serializeBoard({ arrays: prev });
    if (checkWin({ array: boardTran }) || checkTie({ array: boardTran }))
      return prev;
    if (boardTran[y][x] !== 0) return prev;
    const copyBoard = prev.map((p) => [...p]);
    const cursor = turnPlayer ? "X" : "O";
    copyBoard[y][x] = cursor;
    return copyBoard;
  });
  if (board[y][x] === "") setTurnPlayer((prev) => !prev);
};
