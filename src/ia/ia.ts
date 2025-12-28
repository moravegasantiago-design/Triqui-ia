import evaluateBoard, { isCellEmpty } from "./evaluateBoard.ts";
export const miniMax = (props: {
  array: number[][];
  shift: boolean;
  depth?: number;
  mode: "impossible" | "medium";
}) => {
  const { array, shift, mode, depth = 0 } = props;
  const score = evaluateBoard({ array: array, mode: mode });
  if (score !== -1) {
    if (score === 10) return { score: 10 - depth };
    if (score === -10) return { score: -10 + depth };
    if (typeof score === "object" && mode === "medium")
      return { score: 0, ...score };
    return { score: 0 };
  }
  let bestScore = shift ? -Infinity : Infinity;
  let bestMove: { x: number; y: number } | undefined;
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (isCellEmpty({ array: array, row: y, col: x })) {
        array[y][x] = shift ? 1 : 2;
        const result = miniMax({
          array: array,
          shift: !shift,
          depth: depth + 1,
          mode: mode,
        });
        array[y][x] = 0;
        if (!result) continue;
        if (
          (shift && result.score > bestScore) ||
          (!shift && result.score < bestScore)
        ) {
          bestScore = result.score;
          bestMove = { x, y };
        }
      }
    }
  }
  return { score: bestScore, ...bestMove };
};
