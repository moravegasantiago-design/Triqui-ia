import type { Dispatch, SetStateAction } from "react";
import type {
  Cell,
  CheckStateResult,
  gameModeProps,
  gameStatusProps,
  statisticsProps,
} from "../type";
import { checkTie, checkWin } from "../ia/rules";
import { serializeBoard } from "../ia/serializeBoard";
import { updateStatistics } from "./systemStatistics";

type addStatisticsProps = {
  setPlayerStatistics: Dispatch<SetStateAction<statisticsProps>>;
  gameStatus: gameStatusProps;
};
export const checkState = (props: {
  board: Cell[][];
  gameMode: gameModeProps;
}): CheckStateResult | null => {
  const { board, gameMode } = props;
  const convertBoard = serializeBoard({ arrays: board });
  const win = checkWin({ array: convertBoard });
  const draw = checkTie({ array: convertBoard });
  if (!win && !draw) return null;
  const winner =
    gameMode.mode === "friend"
      ? (["player1", "player2"] as const)
      : (["human", "ia"] as const);
  const pointsMode = win === -10 ? gameMode.pointsWin : gameMode.pointsLose;
  const mode: "ia" | "friend" =
    gameMode.mode === "friend" ? gameMode.mode : "ia";
  const points = gameMode.mode === "friend" ? 0 : pointsMode;
  if (win === -10)
    return {
      isWin: true,
      winner: winner[0],
      isDraw: false,
      points: points,
      mode: mode,
    };
  else if (win === 10)
    return {
      isWin: true,
      winner: winner[1],
      isDraw: false,
      points: points,
      mode: mode,
    };
  return {
    isWin: false,
    winner: "none",
    isDraw: true,
    points: gameMode.mode === "friend" ? 0 : gameMode.pointsDraw,
    mode: mode,
  };
};
export const addStatistics = ({
  setPlayerStatistics,
  gameStatus,
}: addStatisticsProps) => {
  if (gameStatus.winner === "none" && !gameStatus.isDraw) return;
  setPlayerStatistics((prev) => {
    if (gameStatus.mode === "friend") {
      const winner = gameStatus.winner as "player1" | "player2";

      return updateStatistics({
        prev,
        points: gameStatus.points,
        parameter: winner,
        letter: winner === "player1" ? "P1" : "P2",
        mode: "friend",
      });
    }

    const winner = gameStatus.winner as "human" | "ia";

    return updateStatistics({
      prev,
      points: gameStatus.points,
      parameter: winner === "human" ? "wins" : "losses",
      letter: winner === "human" ? "W" : "L",
      mode: "ia",
    });
  });
  if (gameStatus.isDraw) {
    setPlayerStatistics((prev) =>
      updateStatistics({
        prev,
        points: gameStatus.points,
        parameter: "draw",
        letter: "D",
        mode: gameStatus.mode,
      })
    );
  }
};
