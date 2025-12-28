const checkEquality = (props: { a: number[] }) => {
  const { a } = props;
  if (a.includes(0)) return 0;
  if (a.every((i) => i === 1)) return 10;
  if (a.every((i) => i === 2)) return -10;
  return 0;
};
export const checkWin = (props: { array: number[][] }) => {
  const { array } = props;
  for (const a of array) {
    const res = checkEquality({ a: a });
    if (res) return res;
  }
  for (let i = 0; i < 3; i++) {
    const arrayVertical = [array[0][i], array[1][i], array[2][i]];
    const res = checkEquality({ a: arrayVertical });
    if (res) return res;
  }

  const arrayDiagonal = [
    [array[0][0], array[1][1], array[2][2]],
    [array[0][2], array[1][1], array[2][0]],
  ];
  for (const a of arrayDiagonal) {
    const res = checkEquality({ a: a });
    if (res) return res;
  }
  return 0;
};

export const checkTie = (props: { array: number[][] }) => {
  const { array } = props;
  const flattenList = array.flatMap((a) => a);
  if (flattenList.includes(0)) return false;
  else return true;
};

export const openingPlay = (props: { array: number[][] }) => {
  const { array } = props;
  const cloneArray = array.flatMap((a) => [...a]);
  if (!cloneArray.every((a) => a !== 1)) return false;
  let moveHuman: { x: number; y: number };
  let moveIa: { x: number; y: number } = { x: -1, y: -1 };
  array.forEach((a, i) => {
    const index = a.indexOf(2);
    if (index === -1) return;
    moveHuman = { x: index, y: i };
    if (moveHuman.x === 1 && moveHuman.y === 1) {
      const getRamdom = () => {
        const x = Math.floor(Math.random() * 3);
        const y = Math.floor(Math.random() * 3);
        if (!(x === 1 && y === 1)) return { x: x, y: y };
        return getRamdom();
      };
      moveIa = getRamdom();
    } else {
      moveIa = { x: 1, y: 1 };
    }
  });
  return moveIa;
};
