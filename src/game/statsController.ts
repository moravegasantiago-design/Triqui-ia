import type { Dispatch, SetStateAction } from "react";
import type { Cell, statisticsProps } from "../Card";
import { checkTie, checkWin } from "../ia/rules";
import { serializeBoard } from "../ia/seralizeBoard";
import { updateStatistics } from "./systemStatistics";

type winnerProps = {
  board: Cell[][];
  setPlayerStatistics: Dispatch<SetStateAction<statisticsProps>>;
};
export const checkWinner = (props: winnerProps) => {
  const { board, setPlayerStatistics } = props;
  const convertBoard = serializeBoard({ arrays: board });
  const win = checkWin({ array: convertBoard });
  const draw = checkTie({ array: convertBoard });
  if (!win && !draw) return false;
  if (win) {
    if (win === 10)
      setPlayerStatistics((prev) =>
        updateStatistics({
          prev: prev,
          points: 10,
          parameter: "losses",
          letter: "L",
        })
      );
    else
      setPlayerStatistics((prev) =>
        updateStatistics({
          prev: prev,
          points: 1000,
          parameter: "wins",
          letter: "W",
        })
      );
    const isWinner = win === -10 ? "human" : "Ia";
    return { isWin: true, winner: isWinner, isDraw: false };
  } else if (draw) {
    setPlayerStatistics((prev) =>
      updateStatistics({
        prev: prev,
        points: 25,
        parameter: "draw",
        letter: "D",
      })
    );
    return { isWin: false, winner: "none", isDraw: true };
  }
};
