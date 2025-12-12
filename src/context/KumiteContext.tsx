import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import * as XLSX from "xlsx";

import { Competidor, Match } from "@/types";
import { generateBracket } from "@/utils/bracketUtils";
import { useBroadcastChannel } from "@/hooks/useBroadcastChannel";
import { useConfig } from "./ConfigContext";

// --- Types & Initial State ---

export interface HistoryLogItem {
  id: number;
  timestamp: number;
  competitor: "aka" | "shiro";
  actionType: string; // "ippon", "wazari", "atenai", etc.
  description: string;
  previousValue: any;
  newValue: any;
  // Snapshot of scores to be safe? For now, delta is enough for simple numeric/bool toggles
}

export const createDefaultBracket = () => {
  const defaultCompetitors: Competidor[] = [
    { id: 1, Nombre: "AKA", Edad: 0 },
    { id: 2, Nombre: "SHIRO", Edad: 0 },
  ];

  return generateBracket(defaultCompetitors);
};

export const initialState = {
  timer: {
    tiempoRestante: 180,
    tiempoInicial: 180,
    temporizadorIniciado: false,
    timerStarted: false,
    timerPaused: false,
    selectedTime: 180,
  },
  scores: {
    aka: {
      wazari: 0,
      ippon: 0,
      kinshi: false,
      kinshiNi: false,
      kinshiChui: false,
      kinshiHansoku: false,
      atenai: false,
      atenaiChui: false,
      atenaiHansoku: false,
      shikaku: false,
      kiken: false,
      nombre: "AKA",
    },
    shiro: {
      wazari: 0,
      ippon: 0,
      kinshi: false,
      kinshiNi: false,
      kinshiChui: false,
      kinshiHansoku: false,
      atenai: false,
      atenaiChui: false,
      atenaiHansoku: false,
      shikaku: false,
      kiken: false,
      nombre: "SHIRO",
    },
  },
  match: {
    ganador: null as "aka" | "shiro" | null,
    ganadorNombre: "",
    showGanador: false,
    categoria: "",
    area: "",
    areaSeleccionada: false,
  },
  history: [] as HistoryLogItem[],
  bracket: createDefaultBracket(),
  currentRoundIndex: 0,
  currentMatchIndex: 0,
};

export type KumiteState = typeof initialState;

type Action =
  | { type: "SET_TIMER"; payload: Partial<typeof initialState.timer> }
  | { type: "UPDATE_SCORE"; competitor: "aka" | "shiro"; payload: any }
  | { type: "UPDATE_MATCH"; payload: Partial<typeof initialState.match> }
  | { type: "SET_BRACKET"; payload: any }
  | { type: "INIT_DEFAULT_BRACKET" }
  | {
    type: "NEXT_MATCH";
    payload: { currentMatchIndex: number; currentRoundIndex: number };
  }
  | { type: "RESET_ALL" }
  | { type: "ADD_HISTORY"; payload: HistoryLogItem }
  | { type: "UNDO_LAST_ACTION" };

function reducer(state: KumiteState, action: Action): KumiteState {
  switch (action.type) {
    case "SET_TIMER":
      return { ...state, timer: { ...state.timer, ...action.payload } };
    case "UPDATE_SCORE":
      return {
        ...state,
        scores: {
          ...state.scores,
          [action.competitor]: {
            ...state.scores[action.competitor],
            ...action.payload,
          },
        },
      };
    case "UPDATE_MATCH":
      return { ...state, match: { ...state.match, ...action.payload } };
    case "SET_BRACKET":
      return { ...state, bracket: action.payload };
    case "INIT_DEFAULT_BRACKET":
      return {
        ...state,
        bracket: createDefaultBracket(),
        currentRoundIndex: 0,
        currentMatchIndex: 0,
        match: {
          ...state.match,
          ganador: null,
          showGanador: false,
          ganadorNombre: "",
        },
        scores: initialState.scores,
      };
    case "NEXT_MATCH":
      return {
        ...state,
        currentMatchIndex: action.payload.currentMatchIndex,
        currentRoundIndex: action.payload.currentRoundIndex,
        match: {
          ...state.match,
          ganador: null,
          showGanador: false,
          ganadorNombre: "",
        },
        scores: initialState.scores,
      };
    case "RESET_ALL":
      return initialState;
    case "ADD_HISTORY":
      return { ...state, history: [...state.history, action.payload] };
    case "UNDO_LAST_ACTION": {
      if (state.history.length === 0) return state;

      const lastAction = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);

      // Revert logic
      const { competitor, actionType, previousValue } = lastAction;

      // Special handling if reverting a point that caused a winner?
      // For now, just reverting the score.
      // If winner was set, we might need to unset it.
      // Ideally, specific winner-set actions should also be in history if we want to undo them directly.
      // But typically, reducing score below threshold should unset winner?
      // Or we manually unset winner if it exists?
      // Let's rely on manual "Winner" modal close or if logic allows.
      // Actually, if we undo a point, we just set the score back.
      // If there was a winner, we might want to clear it if it was auto-set?
      // Let's keep it simple: just revert the value.
      // If the user wants to "un-win", they can just continue match?
      // No, if winner is set, inputs are disabled. We need to clear winner if we undo.

      const newState = {
        ...state,
        scores: {
          ...state.scores,
          [competitor]: {
            ...state.scores[competitor],
            // Special handling for increments vs sets?
            // "wazari": previousValue (which is number)
            // "kinshi": previousValue (which is bool)
            [actionType]: previousValue,
          },
        },
        history: newHistory,
      };

      // If we undo, and there was a winner, we should probably clear the winner
      // to allow the match to continue, specifically if the undo changes the score.
      if (state.match.ganador) {
        newState.match = {
          ...newState.match,
          ganador: null,
          showGanador: false,
          ganadorNombre: ""
        }
      }

      return newState;
    }
    default:
      return state;
  }
}

// --- Context Definition ---

interface KumiteContextType {
  state: KumiteState;
  dispatch: React.Dispatch<Action>;
  // Actions
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  selectTime: (time: number) => void;
  handleFileUpload: (file: File) => void;
  updateScore: (competitor: "aka" | "shiro", type: string, value?: any) => void; // Generalized score update
  setWinner: (ganador: "aka" | "shiro", nombre?: string) => void;
  nextMatch: () => void;
  resetAll: () => void;
  setArea: (area: string) => void;
  closeWinnerModal: () => void;
  broadcastData: () => void; // Helper to force broadcast
  undoLastAction: () => void;
}

const KumiteContext = createContext<KumiteContextType | undefined>(undefined);

// --- Provider ---

export const KumiteProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { config } = useConfig();

  // Broadcast Channel
  const postMessage = useBroadcastChannel("kumite-channel");

  // --- Logic Helpers ---

  const startTimer = useCallback(() => {
    if (!state.timer.temporizadorIniciado && state.timer.selectedTime > 0) {
      dispatch({
        type: "SET_TIMER",
        payload: {
          temporizadorIniciado: true,
          tiempoRestante: state.timer.selectedTime,
        },
      });
    }
  }, [state.timer.temporizadorIniciado, state.timer.selectedTime]);

  const stopTimer = useCallback(() => {
    dispatch({ type: "SET_TIMER", payload: { temporizadorIniciado: false } });
  }, []);

  const resetTimer = useCallback(() => {
    if (state.timer.selectedTime > 0) {
      dispatch({
        type: "SET_TIMER",
        payload: {
          temporizadorIniciado: false,
          tiempoRestante: state.timer.selectedTime,
        },
      });
    }
  }, [state.timer.selectedTime]);

  const selectTime = useCallback((time: number) => {
    dispatch({
      type: "SET_TIMER",
      payload: {
        selectedTime: time,
        tiempoRestante: time,
        temporizadorIniciado: false,
      },
    });
  }, []);

  const setArea = useCallback((area: string) => {
    dispatch({
      type: "UPDATE_MATCH",
      payload: { area, areaSeleccionada: true },
    });
  }, []);

  const closeWinnerModal = useCallback(() => {
    dispatch({ type: "UPDATE_MATCH", payload: { showGanador: false } });
  }, []);

  // Bracket & Winner Logic
  const updateBracketWithWinner = useCallback(
    (ganador: any) => {
      const newBracket = [...state.bracket];

      if (
        !newBracket[state.currentRoundIndex] ||
        !newBracket[state.currentRoundIndex][state.currentMatchIndex]
      )
        return;

      const currentMatch =
        newBracket[state.currentRoundIndex][state.currentMatchIndex];

      currentMatch.winner = ganador;

      if (state.currentRoundIndex + 1 < newBracket.length) {
        const nextRoundIndex = state.currentRoundIndex + 1;
        const nextMatchIndex = Math.floor(state.currentMatchIndex / 2);
        const nextMatch = newBracket[nextRoundIndex][nextMatchIndex];
        const positionInPair = state.currentMatchIndex % 2;

        nextMatch.pair[positionInPair] = ganador;
      }
      dispatch({ type: "SET_BRACKET", payload: newBracket });
    },
    [state.bracket, state.currentRoundIndex, state.currentMatchIndex],
  );

  const setWinner = useCallback(
    (ganador: "aka" | "shiro", nombreCompetidor?: string) => {
      if (!state.bracket.length) return;

      const currentMatch =
        state.bracket[state.currentRoundIndex][state.currentMatchIndex];

      if (!currentMatch) return;

      const ganadorCompetidor =
        ganador === "aka" ? currentMatch.pair[0] : currentMatch.pair[1];
      const ganadorNombre =
        nombreCompetidor ||
        (typeof ganadorCompetidor === "object"
          ? ganadorCompetidor.Nombre
          : ganadorCompetidor);

      dispatch({
        type: "UPDATE_MATCH",
        payload: { ganador, showGanador: true, ganadorNombre },
      });
      stopTimer();
      updateBracketWithWinner(ganadorCompetidor);
    },
    [
      state.bracket,
      state.currentRoundIndex,
      state.currentMatchIndex,
      startTimer,
      stopTimer,
      updateBracketWithWinner,
    ],
  );

  // Automated Score Intepretation (Winner Check)
  useEffect(() => {
    if (!state.bracket.length || state.match.ganador) return;

    const puntajeAka = state.scores.aka.wazari * 0.5 + state.scores.aka.ippon;
    const puntajeShiro =
      state.scores.shiro.wazari * 0.5 + state.scores.shiro.ippon;

    const { winThreshold } = config.kumite;

    if (puntajeAka >= winThreshold) {
      // Helper for getting name
      const currentMatch =
        state.bracket[state.currentRoundIndex]?.[state.currentMatchIndex];

      if (!currentMatch) return;
      const akaCompetidor = currentMatch.pair[0];
      const akaNombre =
        typeof akaCompetidor === "object"
          ? akaCompetidor.Nombre
          : akaCompetidor;

      setWinner("aka", akaNombre);
    } else if (puntajeShiro >= winThreshold) {
      const currentMatch =
        state.bracket[state.currentRoundIndex]?.[state.currentMatchIndex];

      if (!currentMatch) return;
      const shiroCompetidor = currentMatch.pair[1];
      const shiroNombre =
        typeof shiroCompetidor === "object"
          ? shiroCompetidor.Nombre
          : shiroCompetidor;

      setWinner("shiro", shiroNombre);
    }
  }, [
    state.scores,
    state.bracket,
    state.match.ganador,
    state.currentRoundIndex,
    state.currentMatchIndex,
    setWinner,
    config.kumite,
  ]);

  const nextMatch = useCallback(() => {
    let newMatchIndex = state.currentMatchIndex + 1;
    let newRoundIndex = state.currentRoundIndex;

    if (
      state.bracket[state.currentRoundIndex] &&
      newMatchIndex >= state.bracket[state.currentRoundIndex].length
    ) {
      newRoundIndex += 1;
      newMatchIndex = 0;
    }

    if (newRoundIndex >= state.bracket.length) {
      console.log("Fin del torneo");

      return;
    }

    dispatch({
      type: "NEXT_MATCH",
      payload: {
        currentMatchIndex: newMatchIndex,
        currentRoundIndex: newRoundIndex,
      },
    });

    const nextMatchItem = state.bracket[newRoundIndex][newMatchIndex];
    const [aka, shiro] = nextMatchItem.pair;

    dispatch({
      type: "UPDATE_SCORE",
      competitor: "aka",
      payload: { nombre: typeof aka === "object" ? aka.Nombre : aka },
    });
    dispatch({
      type: "UPDATE_SCORE",
      competitor: "shiro",
      payload: { nombre: typeof shiro === "object" ? shiro.Nombre : shiro },
    });

    resetTimer();
  }, [
    state.currentMatchIndex,
    state.currentRoundIndex,
    state.bracket,
    resetTimer,
  ]);

  const updateScore = useCallback(
    (competitor: "aka" | "shiro", type: string, value?: any) => {
      if (state.match.ganador) return;

      // Handle specific logic like incrementing
      if (type === "wazari") {
        const newValue = state.scores[competitor].wazari + 1;

        dispatch({
          type: "ADD_HISTORY",
          payload: {
            id: Date.now(),
            timestamp: Date.now(),
            competitor,
            actionType: "wazari",
            description: "Waza-ari (+1)",
            previousValue: state.scores[competitor].wazari,
            newValue,
          }
        });

        dispatch({
          type: "UPDATE_SCORE",
          competitor,
          payload: { wazari: newValue },
        });
      } else if (type === "ippon") {
        const newValue = state.scores[competitor].ippon + 1;

        dispatch({
          type: "ADD_HISTORY",
          payload: {
            id: Date.now(),
            timestamp: Date.now(),
            competitor,
            actionType: "ippon",
            description: "Ippon (+1)",
            previousValue: state.scores[competitor].ippon,
            newValue,
          }
        });

        dispatch({
          type: "UPDATE_SCORE",
          competitor,
          payload: { ippon: newValue },
        });
      } else {
        // Bool flags or direct values
        const newValue = value !== undefined ? value : true;
        const prevValue = state.scores[competitor][type as keyof typeof state.scores.aka];

        dispatch({
          type: "ADD_HISTORY",
          payload: {
            id: Date.now(),
            timestamp: Date.now(),
            competitor,
            actionType: type,
            description: `${type} (${newValue})`,
            previousValue: prevValue,
            newValue: newValue,
          }
        });

        dispatch({
          type: "UPDATE_SCORE",
          competitor,
          payload: { [type]: newValue },
        });
      }

      // Logic side effects (Hansoku triggers winner)
      const opponent = competitor === "aka" ? "shiro" : "aka";

      if (
        (type === "kinshiHansoku" ||
          type === "atenaiHansoku" ||
          type === "shikaku" ||
          type === "kiken") &&
        config.kumite.autoWinnerOnPenalty
      ) {
        // If AKA gets Hansoku, SHIRO wins
        const currentMatch =
          state.bracket[state.currentRoundIndex]?.[state.currentMatchIndex];

        if (currentMatch) {
          const winnerCompetitor =
            currentMatch.pair[opponent === "aka" ? 0 : 1];
          const winnerName =
            typeof winnerCompetitor === "object"
              ? winnerCompetitor.Nombre
              : winnerCompetitor;

          setWinner(opponent, winnerName);
        }
      }
    },
    [
      state.match.ganador,
      state.scores,
      state.bracket,
      state.currentMatchIndex,
      state.currentRoundIndex,
      setWinner,
      config.kumite,
    ],
  );

  const undoLastAction = useCallback(() => {
    dispatch({ type: "UNDO_LAST_ACTION" });
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;

      if (!data) return;

      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const categoriaCell = worksheet["B1"];

      const competidoresExtraidos: Competidor[] = [];
      let row = 3;
      let id = 1;

      while (true) {
        const nombreCell = worksheet[`A${row}`];
        const edadCell = worksheet[`B${row}`];

        if (!nombreCell || !nombreCell.v) break;
        competidoresExtraidos.push({
          id: id++,
          Nombre: nombreCell.v.toString(),
          Edad: edadCell ? parseInt(edadCell.v.toString()) || 0 : 0,
        });
        row++;
      }

      if (competidoresExtraidos.length > 0) {
        const bracketData = generateBracket(competidoresExtraidos);

        if (bracketData.length > 0 && bracketData[0].length > 0) {
          const primerCombate = bracketData[0][0];

          dispatch({
            type: "UPDATE_SCORE",
            competitor: "aka",
            payload: {
              nombre:
                typeof primerCombate.pair[0] === "object"
                  ? primerCombate.pair[0].Nombre
                  : primerCombate.pair[0],
            },
          });
          dispatch({
            type: "UPDATE_SCORE",
            competitor: "shiro",
            payload: {
              nombre:
                typeof primerCombate.pair[1] === "object"
                  ? primerCombate.pair[1].Nombre
                  : primerCombate.pair[1],
            },
          });
        }
        dispatch({ type: "SET_BRACKET", payload: bracketData });
        if (categoriaCell) {
          dispatch({
            type: "UPDATE_MATCH",
            payload: { categoria: categoriaCell.v },
          });
        }
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const resetAll = useCallback(() => {
    dispatch({ type: "RESET_ALL" });
    // Reset timer local state if needed?
  }, []);

  // Broadcast logic
  const broadcastData = useCallback(() => {
    // Construct data object
    const currentMatch =
      state.bracket[state.currentRoundIndex]?.[state.currentMatchIndex];
    const nextMatch =
      state.bracket[state.currentRoundIndex]?.[state.currentMatchIndex + 1] ||
      state.bracket[state.currentRoundIndex + 1]?.[0];

    const data = {
      scores: state.scores,
      timer: {
        isRunning: state.timer.temporizadorIniciado,
        time: state.timer.tiempoRestante,
      },
      matchInfo: { current: currentMatch, next: nextMatch },
    };

    postMessage(data);
  }, [state, postMessage]);

  useEffect(() => {
    broadcastData();
  }, [
    state.scores,
    state.timer.tiempoRestante,
    state.timer.temporizadorIniciado,
    state.match,
    broadcastData,
  ]);

  return (
    <KumiteContext.Provider
      value={{
        state,
        dispatch,
        startTimer,
        stopTimer,
        resetTimer,
        selectTime,
        handleFileUpload,
        updateScore,
        setWinner,
        nextMatch,
        resetAll,
        setArea,
        closeWinnerModal,
        broadcastData,
        undoLastAction,
      }}
    >
      {children}
    </KumiteContext.Provider>
  );
};

export const useKumite = () => {
  const context = useContext(KumiteContext);

  if (!context) {
    throw new Error("useKumite must be used within a KumiteProvider");
  }

  return context;
};
