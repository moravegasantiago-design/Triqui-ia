import { type Cell } from "../Card";
export const serializeBoard = (props: { arrays: Cell[][] }) => {
  const { arrays } = props;
  const copyArray: number[][] = arrays.map(() => [0, 0, 0]);
  arrays.forEach((array, y) => {
    array.forEach((cursor, x) => {
      if (cursor === "") copyArray[y][x] = 0;
      if (cursor === "O") copyArray[y][x] = 1;
      if (cursor === "X") copyArray[y][x] = 2;
    });
  });
  return copyArray;
};
