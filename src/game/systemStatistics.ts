import type { statisticsProps } from "../Card";

type winDraw = {
  prev: statisticsProps;
  parameter: "wins" | "draw" | "losses";
  letter: "W" | "L" | "D";
  points: number;
};
export const updateStatistics = (props: winDraw) => {
  const { prev, parameter, letter, points } = props;
  const objCopy = { ...prev };
  objCopy[parameter] += 1;
  objCopy.points += points;
  if (parameter === "wins") objCopy.streak += 1;
  else if (parameter === "losses") objCopy.streak = 0;
  objCopy.gameHistory = [...objCopy.gameHistory, letter];
  return objCopy;
};
