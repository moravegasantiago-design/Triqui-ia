import type { statisticsProps } from "../type";

type winDraw = {
  prev: statisticsProps;
  parameter: "wins" | "draw" | "losses" | "player1" | "player2";
  letter: "W" | "L" | "D" | "P1" | "P2";
  points: number;
  mode: "ia" | "friend";
};
export const updateStatistics = (props: winDraw) => {
  const { prev, parameter, letter, points, mode } = props;
  const objCopy = { ...prev };
  if (mode === "friend") {
    if (prev.pvp[parameter] === undefined) return prev;
    return {
      ...prev,
      pvp: {
        ...prev.pvp,
        [parameter]: prev.pvp[parameter] + 1,
        gameHistory: [...prev.pvp.gameHistory, letter],
      },
    };
  }
  if (parameter === "player1" || parameter === "player2") return prev;
  objCopy[parameter] += 1;
  if ("points" in objCopy) objCopy.points += points;
  if ("streak" in objCopy) {
    if (parameter === "wins" && objCopy.streak) objCopy.streak += 1;
    else if (parameter === "losses" && objCopy.streak) objCopy.streak = 0;
  }
  objCopy.gameHistory = [...objCopy.gameHistory, letter];
  return objCopy;
};
