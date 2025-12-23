import { useState, type Dispatch, type SetStateAction } from "react";
import { serializeBoard } from "./ia/seralizeBoard";
import { miniMax } from "./ia/ia";
export type Cell = "" | "X" | "O";
export default function Card() {
  const [turnPlayer, SetTurnPlayer] = useState(false);
  const [board, SetBoard] = useState<Cell[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  if (turnPlayer) {
    const tranformer = serializeBoard({ arrays: board });
    const resIa = miniMax({ array: tranformer, shift: true });
    SetBoard((count) => {
      if (resIa.x === undefined || resIa.y === undefined) return count;
      const copyCount = count.map((c) => [...c]);
      copyCount[resIa.y][resIa.x] = "O";
      return copyCount;
    });
    SetTurnPlayer(false);
  }
  return (
    <div className="h-dvh bg-[#0a0a0f] text-white p-2 sm:p-4 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-sm sm:max-w-4xl h-full max-h-[100dvh] flex flex-col sm:flex-row gap-2 sm:gap-4">
        <DesktopBar />
        <div className="flex-1 flex flex-col gap-2 sm:gap-3 min-h-0">
          <HeaderCard />
          <div className="flex-1 flex items-center justify-center min-h-0">
            <BoardCard
              turnPlayer={turnPlayer}
              SetTurnPlayer={SetTurnPlayer}
              board={board}
              SetBoard={SetBoard}
            />
          </div>
          <MobileStatistics />
          <button
            className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-semibold text-xs 
          sm:text-sm hover:from-violet-500 hover:to-purple-500 active:scale-[0.98] transition-all shadow-lg shadow-violet-500/20"
            onClick={() =>
              SetBoard([
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
              ])
            }
          >
            Nueva Partida
          </button>
        </div>
        <div className="hidden sm:flex flex-col gap-3 w-52">
          <DesktopStatistics />
        </div>
      </div>
    </div>
  );
}

const HeaderCard = () => {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 py-1 sm:py-2">
      <div className="text-center">
        <p className="text-3xl sm:text-5xl font-extrabold text-emerald-400">
          3
        </p>
        <p className="text-[9px] sm:text-[11px] uppercase tracking-widest text-gray-500">
          Tú
        </p>
      </div>
      <div className="px-3 py-1 sm:px-4 sm:py-2 bg-[#1a1a24] rounded-full">
        <span className="text-[10px] sm:text-xs text-gray-500 font-semibold">
          VS
        </span>
      </div>
      <div className="text-center">
        <p className="text-3xl sm:text-5xl font-extrabold text-pink-400">2</p>
        <p className="text-[9px] sm:text-[11px] uppercase tracking-widest text-gray-500">
          CPU
        </p>
      </div>
    </div>
  );
};
type boardProps = {
  turnPlayer: boolean;
  SetTurnPlayer: Dispatch<SetStateAction<boolean>>;
  board: Cell[][];
  SetBoard: Dispatch<SetStateAction<Cell[][]>>;
};
const BoardCard = (props: boardProps) => {
  const { turnPlayer, SetTurnPlayer, board, SetBoard } = props;
  const Xstyle = "text-pink-400 shadow-[0_0_20px_#f472b666]";
  const Ostyle = "text-emerald-400 shadow-[0_0_20px_#34d39966]";
  const addOption = (props: { x: number; y: number }) => {
    const { x, y } = props;
    if (board[y][x] !== "") return;
    SetBoard((count) => {
      const cursor = turnPlayer ? "O" : "X";
      const newBoard = count.map((a) => [...a]);
      newBoard[y][x] = cursor;
      return newBoard;
    });
    SetTurnPlayer((count) => !count);
  };
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-4 bg-[#12121a] rounded-2xl w-full max-w-[220px] sm:max-w-[280px] aspect-square">
      {board.map((a, y) => {
        return a.map((p, x) => {
          return (
            <button
              key={`${x}-${y}`}
              className={`aspect-square rounded-xl sm:rounded-2xl 
            text-2xl sm:text-4xl font-extrabold flex items-center justify-center bg-[#1a1a24] 
            hover:bg-[#252532] active:scale-95 transition-all ${
              (p === "O" && Ostyle) || (p === "X" && Xstyle)
            }`}
              onClick={() => {
                if (turnPlayer) return;
                addOption({ x: x, y: y });
              }}
            >
              {p}
            </button>
          );
        });
      })}
    </div>
  );
};
const StatsMobile = () => {
  return (
    <>
      <div className="bg-[#1a1a24] rounded-xl p-2 text-center">
        <p className="text-lg font-bold">28</p>
        <p className="text-[7px] uppercase tracking-wider text-gray-500">
          Jugadas
        </p>
      </div>
      <div className="bg-[#1a1a24] rounded-xl p-2 text-center">
        <p className="text-lg font-bold text-emerald-400">18</p>
        <p className="text-[7px] uppercase tracking-wider text-gray-500">
          Victorias
        </p>
      </div>
      <div className="bg-[#1a1a24] rounded-xl p-2 text-center">
        <p className="text-lg font-bold text-pink-400">7</p>
        <p className="text-[7px] uppercase tracking-wider text-gray-500">
          Derrotas
        </p>
      </div>
      <div className="bg-[#1a1a24] rounded-xl p-2 text-center">
        <p className="text-lg font-bold text-yellow-400">3</p>
        <p className="text-[7px] uppercase tracking-wider text-gray-500">
          Empates
        </p>
      </div>
    </>
  );
};
const MobileBar = () => {
  return (
    <>
      <div className="flex-1 bg-[#1a1a24] rounded-xl p-2 text-center">
        <p className="text-xl font-bold text-violet-400">3</p>
        <p className="text-[7px] uppercase tracking-wider text-gray-500">
          Racha
        </p>
      </div>
      <div className="flex-[2] bg-gradient-to-r from-emerald-500/20 to-transparent rounded-xl p-2">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-emerald-400">64%</span>
          <span className="text-[7px] uppercase text-gray-500">Win</span>
        </div>
        <div className="mt-1 h-1 bg-[#0a0a0f] rounded-full overflow-hidden">
          <div className="h-full w-[64%] bg-emerald-400 rounded-full" />
        </div>
      </div>
      <div className="flex-1 bg-[#1a1a24] rounded-xl p-2 text-center">
        <p className="text-base font-bold text-amber-400">1,450</p>
        <p className="text-[7px] uppercase tracking-wider text-gray-500">Pts</p>
      </div>
    </>
  );
};
const DesktopBar = () => {
  return (
    <div className="hidden sm:flex flex-col gap-3 w-48">
      {/* Historial */}
      <div className="bg-[#1a1a24] rounded-2xl p-4 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-3">
          Historial
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between bg-[#12121a] rounded-lg px-3 py-2">
            <span className="text-xs text-gray-400">Jugada #5</span>
            <span className="text-emerald-400 font-bold text-sm">O</span>
          </div>
          <div className="flex items-center justify-between bg-[#12121a] rounded-lg px-3 py-2">
            <span className="text-xs text-gray-400">Jugada #4</span>
            <span className="text-pink-400 font-bold text-sm">X</span>
          </div>
          <div className="flex items-center justify-between bg-[#12121a] rounded-lg px-3 py-2">
            <span className="text-xs text-gray-400">Jugada #3</span>
            <span className="text-emerald-400 font-bold text-sm">O</span>
          </div>
          <div className="flex items-center justify-between bg-[#12121a] rounded-lg px-3 py-2">
            <span className="text-xs text-gray-400">Jugada #2</span>
            <span className="text-pink-400 font-bold text-sm">X</span>
          </div>
          <div className="flex items-center justify-between bg-[#12121a] rounded-lg px-3 py-2">
            <span className="text-xs text-gray-400">Jugada #1</span>
            <span className="text-emerald-400 font-bold text-sm">O</span>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a24] rounded-2xl p-4 text-center">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
          Racha Actual
        </p>
        <p className="text-4xl font-extrabold text-violet-400">3</p>
        <p className="text-[10px] text-gray-500">Victorias seguidas</p>
      </div>
    </div>
  );
};
const MobileHistory = () => {
  return (
    <div className="flex gap-1.5">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-emerald-400/20 text-emerald-400">
        W
      </div>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-pink-400/20 text-pink-400">
        L
      </div>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-emerald-400/20 text-emerald-400">
        W
      </div>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-pink-400/20 text-pink-400">
        L
      </div>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-emerald-400/20 text-emerald-400">
        W
      </div>
    </div>
  );
};
const DesktopStatistics = () => {
  return (
    <>
      <div className="bg-[#1a1a24] rounded-2xl p-4">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-3">
          Estadísticas
        </p>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Partidas jugadas</span>
            <span className="text-lg font-bold">28</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Victorias</span>
            <span className="text-lg font-bold text-emerald-400">18</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Derrotas</span>
            <span className="text-lg font-bold text-pink-400">7</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Empates</span>
            <span className="text-lg font-bold text-yellow-400">3</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-2xl p-4">
        <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 mb-1">
          Tasa de Victoria
        </p>
        <p className="text-5xl font-extrabold text-emerald-400">64%</p>
        <div className="mt-2 h-2 bg-[#0a0a0f] rounded-full overflow-hidden">
          <div className="h-full w-[64%] bg-emerald-400 rounded-full" />
        </div>
      </div>

      <div className="bg-[#1a1a24] rounded-2xl p-4 text-center flex-1 flex flex-col justify-center">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
          Puntos
        </p>
        <p className="text-4xl font-extrabold text-amber-400">1,450</p>
      </div>
    </>
  );
};
const MobileStatistics = () => {
  return (
    <>
      <div className="grid grid-cols-4 gap-1.5 sm:hidden">
        <StatsMobile />
      </div>

      <div className="flex gap-1.5 sm:hidden">
        <MobileBar />
      </div>

      <div className="bg-[#1a1a24] rounded-xl p-2 sm:hidden">
        <MobileHistory />
      </div>
    </>
  );
};
