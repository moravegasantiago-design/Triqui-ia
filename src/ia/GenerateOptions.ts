const AddOption = () => {
  const optionPlay = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ];
  optionPlay.forEach((a) => {
    const diferente = a.findIndex((n) => n !== 0);
    if (diferente === -1) return;
    console.log(diferente);
  });
};
AddOption();
