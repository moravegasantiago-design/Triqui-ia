const verificarIgualdad = (props: { a: number[] }) => {
  const { a } = props;
  if (a.includes(0)) return 0;
  if (a.every((i) => i === 1)) return 10;
  if (a.every((i) => i === 2)) return -10;
  return 0;
};
export const verificarWin = (props: { array: number[][] }) => {
  const { array } = props;
  for (const a of array) {
    const res = verificarIgualdad({ a: a });
    if (res) return res;
  }
  for (let i = 0; i < 3; i++) {
    const arrayVertical = [array[0][i], array[1][i], array[2][i]];
    const res = verificarIgualdad({ a: arrayVertical });
    if (res) return res;
  }

  const arrayDiagonal = [
    [array[0][0], array[1][1], array[2][2]],
    [array[0][2], array[1][1], array[2][0]],
  ];
  for (const a of arrayDiagonal) {
    const res = verificarIgualdad({ a: a });
    if (res) return res;
  }
  return 0;
};

export const verificarEmpate = (props: { array: number[][] }) => {
  const { array } = props;
  const aplanar = array.flatMap((a) => a);
  if (aplanar.includes(0)) return false;
  else return true;
};
