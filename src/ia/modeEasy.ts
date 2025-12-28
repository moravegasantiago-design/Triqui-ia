import { isCellEmpty } from "./evaluateBoard";
import { checkWin } from "./rules";

export const modeEasy = (props: { board: number[][] }) => {
  const { board } = props;
  if (!board.flatMap((p) => [...p]).includes(0) || checkWin({ array: board }))
    return { x: undefined, y: undefined };
  const searchCell = () => {
    const y = Math.floor(Math.random() * 3);
    const x = Math.floor(Math.random() * 3);
    if (!isCellEmpty({ array: board, row: y, col: x })) return searchCell();
    return { x: x, y: y };
  };
  return searchCell();
};
