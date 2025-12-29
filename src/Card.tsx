import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { addOption } from "./game/playTurn";
import { addStatistics, checkState } from "./game/statsController";
import { playerVsPlayer } from "./game/pvp";
import type { Cell, gameModeProps, gameStatusProps, metricsProps, statisticsProps } from "./type";

export default function Card() {
  const [turnPlayer, setTurnPlayer] = useState(false);
  const [gameStatus, setGameStatus] = useState<gameStatusProps>({
    isWin: false,
    winner: "none",
    isDraw: false,
    points : 0,
    mode : "ia"
  });
  const [gameMode, setGameMode] = useState<gameModeProps>({mode: "impossible", pointsWin : 1000, pointsDraw: 25, pointsLose: 10, opponent: "CPU"})
  const [playerStatistics, setPlayerStatistics] = useState<statisticsProps>(
    () => {
      const saved = localStorage.getItem("playerStatistics");
      if (!saved)
        return {
          points: 0,
          wins: 0,
          losses: 0,
          draw: 0,
          streak: 0,
          gameHistory: [],
          pvp :{
            player1: 0,
            player2: 0,
            draw: 0,
            gameHistory: []
          }
        };
      return JSON.parse(saved);
    }
  );
  const [board, setBoard] = useState<Cell[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  useEffect(() => {
    const check = checkState({
      board: board,
      gameMode: gameMode
    });
    if (!check) return;
    const checkItems = check;
    setTimeout(() => {
      setGameStatus(checkItems);
    }, 100);
  }, [board, gameMode]);
  useEffect(() => {
    localStorage.setItem("playerStatistics", JSON.stringify(playerStatistics));
  }, [playerStatistics]);
  useEffect(() => {
    addStatistics({setPlayerStatistics: setPlayerStatistics, gameStatus : gameStatus})
  }, [gameStatus])
  const mode = gameMode.mode === "friend" ? playerStatistics.pvp : playerStatistics;

  return (
    <div className="h-dvh bg-[#0a0a0f] text-white p-2 sm:p-4 flex justify-center overflow-hidden">
      <div className="w-full max-w-sm sm:max-w-4xl flex flex-col sm:flex-row gap-2 sm:gap-4">
        <DesktopBar
          gameHistory={mode.gameHistory}
          streak={playerStatistics.streak}
        />
        <div className="flex-1 flex flex-col gap-2 sm:gap-3 sm:min-h-0 justify-start">
          <HeaderCard
            playerStatistics={playerStatistics}
            gameMode={gameMode}
          />
          <div className="flex items-center justify-center py-2">
            <BoardCard
              turnPlayer={turnPlayer}
              setTurnPlayer={setTurnPlayer}
              board={board}
              setBoard={setBoard}
              gameStatus={gameStatus}
              mode={gameMode.mode}
            />
          </div>
          {!gameStatus.isWin && !gameStatus.isDraw && (
            <TurnIndicator turnPlayer={turnPlayer} gameMode={gameMode} />
          )}
          {(gameStatus.winner === "human" || gameStatus.winner === "player1" || gameStatus.winner === "player2") && (
            <WinModal setBoard={setBoard} setGameStatus={setGameStatus} gameStatus={gameStatus}/>
          )}
          {gameStatus.winner === "ia" && (
            <LoseModal setBoard={setBoard} setGameStatus={setGameStatus} />
          )}
          {gameStatus.isDraw && (
            <DrawModal setBoard={setBoard} setGameStatus={setGameStatus} />
          )}
          <MobileStatistics metricsPlayer={mode} points={playerStatistics.points} streak={playerStatistics.streak} mode={gameMode.mode}/>
          <button
            className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-semibold text-xs 
          sm:text-sm hover:from-violet-500 hover:to-purple-500 active:scale-[0.98] transition-all shadow-lg shadow-violet-500/20"
            onClick={() =>
              setBoard([
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
              ])
            }
          >
            Nueva Partida
          </button>
          <GameModeSelector gameMode={gameMode} setGameMode={setGameMode} setBoard={setBoard}/>
        </div>
        <div className="hidden sm:flex flex-col gap-3 w-52">
          <DesktopStatistics metricsPlayer={mode} points={playerStatistics.points} mode={gameMode.mode} />
        </div>
      </div>
    </div>
  );
}

const HeaderCard = (props: { playerStatistics :statisticsProps, gameMode: gameModeProps }) => {
  const { playerStatistics, gameMode } = props;
  const mode = gameMode.mode === "friend";

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 py-1 sm:py-2">
      <div className="text-center">
        <p className="text-3xl sm:text-5xl font-extrabold text-emerald-400">
          { mode ? playerStatistics.pvp.player1 : playerStatistics.wins}
        </p>
        <p className="text-[9px] sm:text-[11px] uppercase tracking-widest text-gray-500">
          {mode ? "Jugador1" :"Tú"}
        </p>
      </div>
      <div className="px-3 py-1 sm:px-4 sm:py-2 bg-[#1a1a24] rounded-full">
        <span className="text-[10px] sm:text-xs text-gray-500 font-semibold">
          VS
        </span>
      </div>
      <div className="text-center">
        <p className="text-3xl sm:text-5xl font-extrabold text-pink-400">
          {mode ? playerStatistics.pvp.player2 : playerStatistics.losses}
        </p>
        <p className="text-[9px] sm:text-[11px] uppercase tracking-widest text-gray-500">
          {gameMode.opponent}
        </p>
      </div>
    </div>
  );
};

const TurnIndicator = (props: { turnPlayer: boolean; gameMode: gameModeProps }) => {
  const { turnPlayer, gameMode } = props;
  const isFriend = gameMode.mode === "friend";
  let label: string;
  let colorClass: string;
  if (isFriend) {
    label = !turnPlayer ? "Turno: Jugador 2 (O)" : "Turno: Jugador  (X)";
    colorClass = !turnPlayer 
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : "bg-pink-500/10 text-pink-400 border-pink-500/20";
  } else {
    label = turnPlayer ? "IA pensando..." : "Tu turno";
    colorClass = turnPlayer 
      ? "bg-pink-500/10 text-pink-400 border-pink-500/20" 
      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  }

  return (
    <div className="flex justify-center">
      <div className={`px-4 py-1.5 rounded-full text-xs font-medium border ${colorClass}`}>
        {turnPlayer && !isFriend && (
          <span className="inline-block w-2 h-2 bg-pink-400 rounded-full mr-2 animate-pulse" />
        )}
        {label}
      </div>
    </div>
  );
};
type boardProps = {
  turnPlayer: boolean;
  setTurnPlayer: Dispatch<SetStateAction<boolean>>;
  board: Cell[][];
  setBoard: Dispatch<SetStateAction<Cell[][]>>;
  gameStatus: gameStatusProps;
  mode : "impossible" | "medium" | "easy" | "friend";
};
const BoardCard = (props: boardProps) => {
  const { turnPlayer, setTurnPlayer, board, setBoard, gameStatus, mode } = props;
  const Xstyle = "text-pink-400 shadow-[0_0_20px_#f472b666]";
  const Ostyle = "text-emerald-400 shadow-[0_0_20px_#34d39966]";
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-4 bg-[#12121a] rounded-2xl w-full max-w-[220px] sm:max-w-[280px] aspect-square">
      {board.map((a, y) => {
        return a.map((p, x) => {
          return (
            <button
              disabled={gameStatus.isWin || gameStatus.isDraw}
              key={`${x}-${y}`}
              onClick={() => {
                if(mode === "friend") return playerVsPlayer({setBoard: setBoard, setTurnPlayer:setTurnPlayer, turnPlayer:turnPlayer, x:x, y:y, board: board});
                  addOption({
                  x: x,
                  y: y,
                  setBoard: setBoard,
                  setTurnPlayer: setTurnPlayer,
                  turnPlayer: turnPlayer,
                  board: board,
                  mode: mode
                });
              }}
              className={`aspect-square rounded-xl sm:rounded-2xl 
            text-2xl sm:text-4xl font-extrabold flex items-center justify-center bg-[#1a1a24] 
            hover:bg-[#252532] active:scale-95 transition-all ${
              (p === "O" && Ostyle) || (p === "X" && Xstyle)
            }`}
            >
              {p}
            </button>
          );
        });
      })}
    </div>
  );
};
const StatsMobile = (props: { metricsPlayer: metricsProps, mode: string} ) => {
  const { metricsPlayer, mode } = props;
  const {gameHistory, wins, losses, draw, player1, player2} = metricsPlayer
  return (
    <>
      <div className="bg-[#1a1a24] rounded-xl p-2 text-center">
        <p className="text-lg font-bold">
          {gameHistory.length}
        </p>
        <p className="text-[7px] uppercase tracking-wider text-gray-500">
          Jugadas
        </p>
      </div>
      <div className="bg-[#1a1a24] rounded-xl p-2 text-center">
        <p className="text-lg font-bold text-emerald-400">
          {mode === "friend" ? player1 : wins}
        </p>
        <p className="text-[7px] uppercase tracking-wider text-gray-500">
          {mode === "friend" ? "Jugador1" : "Victorias"}
        </p>
      </div>
      <div className="bg-[#1a1a24] rounded-xl p-2 text-center">
        <p className="text-lg font-bold text-pink-400">
          {mode === "friend" ? player2 : losses}
        </p>
        <p className="text-[7px] uppercase tracking-wider text-gray-500">
          {mode === "friend" ? "Jugador1" : "Derrotas"}
        </p>
      </div>
      <div className="bg-[#1a1a24] rounded-xl p-2 text-center">
        <p className="text-lg font-bold text-yellow-400">
          {draw}
        </p>
        <p className="text-[7px] uppercase tracking-wider text-gray-500">
          Empates
        </p>
      </div>
    </>
  );
};

const WinModal = (props: {
  setBoard: Dispatch<SetStateAction<Cell[][]>>;
  setGameStatus: Dispatch<SetStateAction<gameStatusProps>>;
  gameStatus : gameStatusProps;
}) => {
  const { setBoard, setGameStatus, gameStatus } = props;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-emerald-400/30 max-w-lg w-full animate-scaleIn">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 sm:w-28 h-20 sm:h-28 bg-white/20 rounded-full mb-2">
            <svg
              className="w-12 sm:w-16 h-12 sm:h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-4xl sm:text-6xl font-bold text-white mb-3">
              ¡Ganaste!
            </h2>
            <p className="text-emerald-100 text-lg sm:text-xl">
              {gameStatus.winner === "human" ? "Excelente jugada" : gameStatus.winner}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-emerald-100 text-xl font-semibold">
              {gameStatus.points} Puntos
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setBoard([
                  ["", "", ""],
                  ["", "", ""],
                  ["", "", ""],
                ]);
                setGameStatus({ isWin: false, winner: "none", isDraw: false, mode: "ia", points: 0 });
              }}
              className="flex-1 bg-white hover:bg-emerald-50 text-emerald-600 py-3 sm:py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl text-base sm:text-lg"
            >
              Jugar de nuevo
            </button>
            <button className="px-6 sm:px-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 sm:py-4 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95">
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoseModal = (props: {
  setBoard: Dispatch<SetStateAction<Cell[][]>>;
  setGameStatus: Dispatch<SetStateAction<gameStatusProps>>;
}) => {
  const { setBoard, setGameStatus } = props;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-rose-500 to-rose-700 rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-rose-400/30 max-w-lg w-full animate-scaleIn">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 sm:w-28 h-20 sm:h-28 bg-white/20 rounded-full mb-2">
            <svg
              className="w-12 sm:w-16 h-12 sm:h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-4xl sm:text-6xl font-bold text-white mb-3">
              Perdiste
            </h2>
            <p className="text-rose-100 text-lg sm:text-xl">
              Inténtalo de nuevo
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-rose-100 text-xl font-semibold">
              +10 Puntos
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setBoard([
                  ["", "", ""],
                  ["", "", ""],
                  ["", "", ""],
                ]);
                setGameStatus({ isWin: false, winner: "none", isDraw: false, mode: "ia", points:0});
              }}
              className="flex-1 bg-white hover:bg-rose-50 text-rose-600 py-3 sm:py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl text-base sm:text-lg"
            >
              Reintentar
            </button>
            <button className="px-6 sm:px-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 sm:py-4 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95">
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DrawModal = (props: {
  setBoard: Dispatch<SetStateAction<Cell[][]>>;
  setGameStatus: Dispatch<SetStateAction<gameStatusProps>>;
}) => {
  const { setBoard, setGameStatus } = props;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-600 to-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-slate-500/30 max-w-lg w-full animate-scaleIn">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 sm:w-28 h-20 sm:h-28 bg-white/20 rounded-full mb-2">
            <svg
              className="w-12 sm:w-16 h-12 sm:h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-4xl sm:text-6xl font-bold text-white mb-3">
              Empate
            </h2>
            <p className="text-slate-200 text-lg sm:text-xl">Muy igualado</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-slate-200 text-xl font-semibold">
              +25 Puntos
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setBoard([
                  ["", "", ""],
                  ["", "", ""],
                  ["", "", ""],
                ]);
                setGameStatus({ isWin: false, winner: "none", isDraw: false, mode:"ia", points: 0 });
              }}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 py-3 sm:py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl text-base sm:text-lg"
            >
              Otra ronda
            </button>
            <button className="px-6 sm:px-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 sm:py-4 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95">
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const MobileBar = (props: { metricsPlayer: metricsProps, points : number, streak:number  }) => {
  const { metricsPlayer, points, streak } = props;
  const { wins, gameHistory, player1, player2, draw } = metricsPlayer;
  const winRateCPU = gameHistory.length
    ? Math.round((wins / gameHistory.length) * 100)
    : 0;
const victotyPlayers = (player1 || 0) + (player2 || 0);
  const winRateFriend = Math.round((victotyPlayers * 100) / (victotyPlayers + draw))

  const winRate = Number.isNaN(winRateCPU) ? winRateFriend : winRateCPU 
  return (
    <>
      <div className="flex-1 bg-[#1a1a24] rounded-xl p-2 text-center">
        <p className="text-xl font-bold text-violet-400">{streak}</p>
        <p className="text-[7px] uppercase tracking-wider text-gray-500">
          Racha
        </p>
      </div>
      <div
        className={`flex-[2] bg-gradient-to-r ${
          winRate < 50 ? "from-red-500/20" : "from-emerald-500/20"
        } to-transparent rounded-xl p-2`}
      >
        <div className="flex items-baseline gap-1">
          <span
            className={`text-xl font-bold ${
              winRate < 50 ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {winRate}%
          </span>
          <span className="text-[7px] uppercase text-gray-500">Win</span>
        </div>
        <div className="mt-1 h-1 bg-[#0a0a0f] rounded-full overflow-hidden">
          <div
            className={`h-full ${
              winRate < 50 ? "bg-red-400" : "bg-emerald-400"
            } rounded-full`}
            style={{ width: `${winRate}%` }}
          />
        </div>
      </div>
      <div className="flex-1 bg-[#1a1a24] rounded-xl p-2 text-center">
        <p className="text-base font-bold text-amber-400">{points}</p>
        <p className="text-[7px] uppercase tracking-wider text-gray-500">Pts</p>
      </div>
    </>
  );
};
const DesktopBar = (props: {
  gameHistory: ("W" | "L" | "D"| "P1" | "P2")[];
  streak: number;
}) => {
  const { gameHistory, streak } = props;
  const addListIndex = gameHistory.map((l, i) => [...[l, i + 1]]);
  const simplificarArray =
    addListIndex.length > 10
      ? addListIndex.slice(addListIndex.length - 10, addListIndex.length)
      : addListIndex;
  return simplificarArray.length ? (
    <div className="hidden sm:flex flex-col gap-3 w-48">
      <div className="bg-[#1a1a24] rounded-2xl p-4 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-3">
          Historial
        </p>
        <div className="flex flex-col gap-2">
          {simplificarArray.map((h) => {
            return (
              <div
                key={h[1]}
                className="flex items-center justify-between bg-[#12121a] rounded-lg px-3 py-2"
              >
                <span className="text-xs text-gray-400">Jugada #{h[1]}</span>
                <span
                  className={`${
                    (h[0] === "D" && "text-yellow-400") ||
                    (h[0] === "W" || h[0] === "P1" || h[0] === "P2"? "text-emerald-400" : "text-red-400")
                  } 
                font-bold text-sm`}
                >
                  {h[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-[#1a1a24] rounded-2xl p-4 text-center">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
          Racha Actual
        </p>
        <p className="text-4xl font-extrabold text-violet-400">{streak}</p>
        <p className="text-[10px] text-gray-500">Victorias seguidas</p>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-8 text-center hidden sm:flex">
        <div className="w-12 h-12 rounded-full bg-[#252532] flex items-center justify-center mb-3">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-500">Sin partidas</p>
        <p className="text-[10px] text-gray-600">¡Juega tu primera!</p>
      </div>
  );
};
const MobileHistory = (props: { gameHistory: ("W" | "L" | "D"| "P1" | "P2")[] }) => {
  const { gameHistory } = props;
  const simplificarArray =
    gameHistory.length > 10
      ? gameHistory.slice(gameHistory.length - 10, gameHistory.length)
      : gameHistory;
  return  (
    <div className="flex gap-1.5">
      {simplificarArray.map((h, i) => {
        return (
          <div
            key={`${h}-${i}`}
            className={`w-8 h-8 rounded-lg flex items-center justify-center 
        text-xs font-bold ${
          (h === "W" || h === "P1" || h === "P2") ? "bg-emerald-400/20 text-emerald-400" : h === "D"
            ? "bg-yellow-400/20 text-yellow-400"
            : "bg-red-400/20 text-red-400"
        }`}
          >
            {h}
          </div>
        );
      })}
    </div>
  ) 
};

const DesktopStatistics = (props: { metricsPlayer: metricsProps, points: number, mode : string }) => {
  const { mode, points, metricsPlayer } = props;
  const { gameHistory, draw, wins, losses, player1, player2 } = metricsPlayer;
    const winRateCPU = gameHistory.length
    ? Math.round((wins / gameHistory.length) * 100)
    : 0;
const victotyPlayers = (player1 || 0) + (player2 || 0);
  const winRateFriend = Math.round((victotyPlayers * 100) / (victotyPlayers + draw))

  const winRate = Number.isNaN(winRateCPU) ? winRateFriend : winRateCPU 
  return (
    <>
      <div className="bg-[#1a1a24] rounded-2xl p-4">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-3">
          Estadísticas
        </p>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Partidas jugadas</span>
            <span className="text-lg font-bold">{gameHistory.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">{mode === "friend" ? "Player1" : "Victorias"}</span>
            <span className="text-lg font-bold text-emerald-400">{mode === "friend" ? player1 : wins }</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">{mode === "friend" ? "Player2" : "Derrotas"}</span>
            <span className="text-lg font-bold text-pink-400">{mode === "friend" ? player2 : losses}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Empates</span>
            <span className="text-lg font-bold text-yellow-400">{draw}</span>
          </div>
        </div>
      </div>

      <div className={`bg-gradient-to-br 
        ${winRate < 50 ? "from-red-500/20 to-red-500/5" : "from-emerald-500/20 to-emerald-500/5"} 
        rounded-2xl p-4`}>
        <p className="text-[10px] uppercase tracking-wider text-black-400/70 mb-1">
          Tasa de Victoria
        </p>
        <p
          className={`text-5xl font-extrabold ${
            winRate < 50 ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {winRate}%
        </p>
        <div className={`mt-2 h-2 bg-[#0a0a0f] rounded-full overflow-hidden`}>
          <div
            className={`h-full ${
              winRate < 50 ? "bg-red-400" : "bg-emerald-400"
            } rounded-full `}
            style={{ width: `${winRate}%` }}
          />
        </div>
      </div>

      <div className="bg-[#1a1a24] rounded-2xl p-4 text-center flex-1 flex flex-col justify-center">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
          Puntos
        </p>
        <p className="text-4xl font-extrabold text-amber-400">{points}</p>
      </div>
    </>
  );
};
const MobileStatistics = (props: { metricsPlayer : metricsProps, points: number, streak:number, mode:string }) => {
  const { metricsPlayer, points, streak, mode } = props;
  const {gameHistory} = metricsPlayer
  return (
    <>
      <div className="grid grid-cols-4 gap-1.5 sm:hidden">
        <StatsMobile metricsPlayer={metricsPlayer} mode ={mode}/>
      </div>

      <div className="flex gap-1.5 sm:hidden">
        <MobileBar metricsPlayer={metricsPlayer} points={points} streak={streak}/>
      </div>

      {gameHistory.length !== 0 && (
        <div className="bg-[#1a1a24] rounded-xl p-2 sm:hidden">
          <MobileHistory gameHistory={gameHistory} />
        </div>
      )}
    </>
  );
};

type modeProps = {
  setGameMode : Dispatch<SetStateAction<gameModeProps>>
  gameMode : gameModeProps;
  setBoard : Dispatch<SetStateAction<Cell[][]>>;
}
type listProps = {
  mode : "impossible" | "medium" | "easy" | "friend";
  content : string;
  color: string;
  pointsWin : number;
  pointsLose : number;
  pointsDraw :number
  opponent : "CPU" | "Jugador2"
}
export const GameModeSelector = (props : modeProps) => {
  const {setGameMode, gameMode, setBoard} = props;
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const listOption : listProps[] = [
    {mode : "impossible", content : "Imposible", color : "bg-red-400", pointsWin : 1000, pointsLose: 10, pointsDraw: 25, opponent: "CPU"},
    {mode : "medium", content : "Medio", color : "bg-orange-400", pointsWin : 150, pointsLose: 0, pointsDraw: 5, opponent: "CPU"},
    {mode : "easy", content : "Fácil", color : "bg-emerald-400", pointsWin : 10, pointsLose: 0, pointsDraw: 0, opponent: "CPU"},
    {mode : "friend", content : "Con un amigo", color : "bg-purple-400", pointsWin : 0, pointsLose: 0, pointsDraw: 0, opponent: "Jugador2"}
  ]
  return (

      <div className="relative z-10">
        <button
          className="w-full px-4 py-3 bg-[#1a1a24] rounded-xl flex items-center justify-between
              border border-gray-800 hover:border-gray-700 transition-colors"
          onClick={()=> setIsOpen(prev => !prev)}
        >
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${listOption.find(l => l.mode === gameMode.mode)?.color}`}></div>
            <span className="text-gray-300">{listOption.find(p => p.mode === gameMode.mode)?.content}</span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div className={`absolute bottom-full left-0 right-0 mb-2 bg-[#1a1a24] rounded-xl 
        border border-gray-800 overflow-hidden shadow-xl shadow-black/50 animate-fadeIn
        ${isOpen ? "" : "hidden"}`}>
          {listOption.map((p, i) => {
            return (<button className="w-full px-4 py-3 flex items-center gap-3 
            hover:bg-[#252532] transition-colors"
            key={i}
            onClick={() => {
              setGameMode(prev => {
              const copyPrev = {...prev}
              copyPrev.mode = p.mode
              copyPrev.pointsWin = p.pointsWin;
              copyPrev.pointsLose = p.pointsLose;
              copyPrev.pointsDraw = p.pointsDraw;
              copyPrev.opponent = p.opponent
              return copyPrev;
            })
            setIsOpen(false)
            setBoard(()=> [["","",""],["","",""],["","",""]])
          }
          }>
            <div className={`w-2 h-2 rounded-full ${p.color}`}></div>
            <span className="text-gray-300">{p.content}</span>
          </button>)
          })}
        </div>
        </div>

  );
};