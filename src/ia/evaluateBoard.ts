import { checkWin, checkTie, openingPlay } from "./rules.ts";
type propsCell = {
  array: number[][];
  row: number;
  col: number;
};
export const isCellEmpty = (props: propsCell) => {
  const { array, row, col } = props;
  if (array[row][col] === 0) return true;
  else return false;
};
const evaluateBoard = (props: { array: number[][] }) => {
  const { array } = props;
  const opening = openingPlay({ array: array });
  if (opening && opening.x !== -1) return opening;
  const win = checkWin({ array: array });
  if (win) return win;
  return checkTie({ array: array }) === true ? 0 : -1;
};

export default evaluateBoard;
