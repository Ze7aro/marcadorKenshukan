import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";

import { useLocalStorage, useBroadcastChannel } from "@/hooks";

// Tipos
interface Competidor {
  id: number;
  Nombre: string;
  Edad: number;
  Categoria: string;
  TituloCategoria: string;
  PuntajeFinal: number | null;
  PuntajesJueces: (string | null)[];
  Kiken: boolean;
}

interface KataState {
  // Competidores
  competidores: Competidor[];

  // Puntajes
  judges: string[];
  numJudges: number;
  lowScore: string;
  highScore: string;
  score: string;
  base: number;

  // Categoría y área
  categoria: string;
  tituloCategoria: string;
  area: string;
  areaSeleccionada: boolean;

  // UI State
  showResults: boolean;
  showAgregarDialog: boolean;
  submitted: boolean;
}

// Acciones
type KataAction =
  | { type: "SET_COMPETIDORES"; payload: Competidor[] }
  | { type: "ADD_COMPETIDOR"; payload: Competidor }
  | {
      type: "UPDATE_COMPETIDOR";
      payload: { id: number; data: Partial<Competidor> };
    }
  | { type: "SET_JUDGES"; payload: string[] }
  | { type: "UPDATE_JUDGE"; payload: { index: number; value: string } }
  | { type: "CLEAR_JUDGE"; payload: number }
  | { type: "SET_NUM_JUDGES"; payload: number }
  | {
      type: "SET_SCORES";
      payload: { low: string; high: string; final: string };
    }
  | { type: "CLEAR_SCORES" }
  | { type: "SET_BASE"; payload: number }
  | { type: "SET_CATEGORIA"; payload: string }
  | { type: "SET_TITULO_CATEGORIA"; payload: string }
  | { type: "SET_AREA"; payload: string }
  | { type: "SET_AREA_SELECCIONADA"; payload: boolean }
  | { type: "SET_SHOW_RESULTS"; payload: boolean }
  | { type: "SET_SHOW_AGREGAR_DIALOG"; payload: boolean }
  | { type: "SET_SUBMITTED"; payload: boolean }
  | { type: "RESET_ALL" };

// Estado inicial
const initialState: KataState = {
  competidores: [],
  judges: Array(5).fill(""),
  numJudges: 5,
  lowScore: "",
  highScore: "",
  score: "",
  base: 6,
  categoria: "",
  tituloCategoria: "",
  area: "",
  areaSeleccionada: false,
  showResults: false,
  showAgregarDialog: false,
  submitted: false,
};

// Reducer
function kataReducer(state: KataState, action: KataAction): KataState {
  switch (action.type) {
    case "SET_COMPETIDORES":
      return { ...state, competidores: action.payload };

    case "ADD_COMPETIDOR":
      return {
        ...state,
        competidores: [...state.competidores, action.payload],
      };

    case "UPDATE_COMPETIDOR":
      return {
        ...state,
        competidores: state.competidores.map((comp) =>
          comp.id === action.payload.id
            ? { ...comp, ...action.payload.data }
            : comp,
        ),
      };

    case "SET_JUDGES":
      return { ...state, judges: action.payload };

    case "UPDATE_JUDGE":
      const newJudges = [...state.judges];

      newJudges[action.payload.index] = action.payload.value;

      return { ...state, judges: newJudges, submitted: false };

    case "CLEAR_JUDGE":
      const clearedJudges = [...state.judges];

      clearedJudges[action.payload] = "";

      return { ...state, judges: clearedJudges, submitted: false };

    case "SET_NUM_JUDGES":
      return {
        ...state,
        numJudges: action.payload,
        judges: Array(action.payload).fill(""),
      };

    case "SET_SCORES":
      return {
        ...state,
        lowScore: action.payload.low,
        highScore: action.payload.high,
        score: action.payload.final,
        submitted: false,
      };

    case "CLEAR_SCORES":
      return {
        ...state,
        judges: Array(state.numJudges).fill(""),
        lowScore: "",
        highScore: "",
        score: "",
        submitted: false,
      };

    case "SET_BASE":
      return { ...state, base: action.payload };

    case "SET_CATEGORIA":
      return { ...state, categoria: action.payload };

    case "SET_TITULO_CATEGORIA":
      return { ...state, tituloCategoria: action.payload };

    case "SET_AREA":
      return { ...state, area: action.payload };

    case "SET_AREA_SELECCIONADA":
      return { ...state, areaSeleccionada: action.payload };

    case "SET_SHOW_RESULTS":
      return { ...state, showResults: action.payload };

    case "SET_SHOW_AGREGAR_DIALOG":
      return { ...state, showAgregarDialog: action.payload };

    case "SET_SUBMITTED":
      return { ...state, submitted: action.payload };

    case "RESET_ALL":
      return initialState;

    default:
      return state;
  }
}

// Context
interface KataContextType {
  state: KataState;
  dispatch: React.Dispatch<KataAction>;
  // Helper functions
  updateJudge: (index: number, value: string) => void;
  clearJudge: (index: number) => void;
  calculateScore: () => void;
  clearAllScores: () => void;
  saveScore: () => void;
  handleKiken: () => void;
  resetAll: () => void;
}

const KataContext = createContext<KataContextType | undefined>(undefined);

// Provider
export function KataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(kataReducer, initialState);

  // Persistencia con useLocalStorage
  const [, setCompetidoresLS] = useLocalStorage<Competidor[]>(
    "kataCompetidores",
    [],
  );
  const [, setJudgesLS] = useLocalStorage<string[]>(
    "kataJudges",
    Array(5).fill(""),
  );
  const [, setNumJudgesLS] = useLocalStorage<number>("kataNumJudges", 5);
  const [, setLowScoreLS] = useLocalStorage<string>("kataLowScore", "");
  const [, setHighScoreLS] = useLocalStorage<string>("kataHighScore", "");
  const [, setScoreLS] = useLocalStorage<string>("kataScore", "");
  const [, setBaseLS] = useLocalStorage<number>("kataBase", 6);
  const [, setCategoriaLS] = useLocalStorage<string>("kataCategoria", "");
  const [, setTituloCategoriaLS] = useLocalStorage<string>(
    "kataTituloCategoria",
    "",
  );
  const [, setAreaLS] = useLocalStorage<string>("kataArea", "");

  // Sincronizar con localStorage
  useEffect(() => {
    setCompetidoresLS(state.competidores);
  }, [state.competidores, setCompetidoresLS]);

  useEffect(() => {
    setJudgesLS(state.judges);
    setNumJudgesLS(state.numJudges);
  }, [state.judges, state.numJudges, setJudgesLS, setNumJudgesLS]);

  useEffect(() => {
    setLowScoreLS(state.lowScore);
    setHighScoreLS(state.highScore);
    setScoreLS(state.score);
  }, [
    state.lowScore,
    state.highScore,
    state.score,
    setLowScoreLS,
    setHighScoreLS,
    setScoreLS,
  ]);

  useEffect(() => {
    setBaseLS(state.base);
    setCategoriaLS(state.categoria);
    setTituloCategoriaLS(state.tituloCategoria);
  }, [
    state.base,
    state.categoria,
    state.tituloCategoria,
    setBaseLS,
    setCategoriaLS,
    setTituloCategoriaLS,
  ]);

  useEffect(() => {
    setAreaLS(state.area);
  }, [state.area, setAreaLS]);

  // BroadcastChannel
  const postKataMessage = useBroadcastChannel("kata-channel");

  useEffect(() => {
    const competidorActual = state.competidores.find(
      (comp) => !comp.PuntajeFinal && !comp.Kiken,
    );

    const dataParaEnviar = {
      competidor: competidorActual?.Nombre || "",
      categoria: state.categoria || "",
      puntajes: state.judges.map((judge) => judge || ""),
      puntajeFinal: state.score || "",
      puntajeMenor: state.lowScore || "",
      puntajeMayor: state.highScore || "",
      competidores: state.competidores,
    };

    postKataMessage(dataParaEnviar);
  }, [
    state.competidores,
    state.categoria,
    state.judges,
    state.score,
    state.lowScore,
    state.highScore,
    postKataMessage,
  ]);

  // Helper functions
  const updateJudge = (index: number, value: string) => {
    dispatch({ type: "UPDATE_JUDGE", payload: { index, value } });
  };

  const clearJudge = (index: number) => {
    dispatch({ type: "CLEAR_JUDGE", payload: index });
  };

  const calculateScore = () => {
    dispatch({ type: "SET_SUBMITTED", payload: true });

    const updatedJudges = state.judges.map((judge: string) => {
      if (judge.endsWith(".")) {
        return judge + "0";
      }

      return judge;
    });

    dispatch({ type: "SET_JUDGES", payload: updatedJudges });

    const sortedJudges = updatedJudges
      .filter((judge: string) => judge !== "")
      .sort((a: string, b: string) => parseFloat(a) - parseFloat(b));

    if (sortedJudges.length !== state.numJudges) {
      return;
    }

    if (state.numJudges === 3) {
      const total = sortedJudges.reduce(
        (sum: number, judge: string) => sum + parseFloat(judge),
        0,
      );

      dispatch({
        type: "SET_SCORES",
        payload: {
          low: "",
          high: "",
          final: (Math.round(total * 10) / 10).toString(),
        },
      });
    } else if (state.numJudges === 5) {
      const total = sortedJudges
        .slice(1, -1)
        .reduce((sum: number, judge: string) => sum + parseFloat(judge), 0);
      const low = sortedJudges[0];
      const high = sortedJudges[sortedJudges.length - 1];

      dispatch({
        type: "SET_SCORES",
        payload: {
          low,
          high,
          final: (Math.round(total * 10) / 10).toString(),
        },
      });
    }

    dispatch({ type: "SET_SUBMITTED", payload: false });
  };

  const clearAllScores = () => {
    dispatch({ type: "CLEAR_SCORES" });
  };

  const saveScore = () => {
    const competidorSinPuntaje = state.competidores.find(
      (comp: Competidor) => !comp.PuntajeFinal && !comp.Kiken,
    );

    if (!competidorSinPuntaje) return;

    const puntajeFinal = state.score
      ? Math.round(parseFloat(state.score) * 10) / 10
      : null;

    const competidoresActualizados = state.competidores.map(
      (comp: Competidor) => {
        if (comp.id === competidorSinPuntaje.id) {
          return {
            ...comp,
            PuntajeFinal: puntajeFinal,
            PuntajesJueces: [...state.judges],
          };
        }

        return comp;
      },
    );

    const competidoresOrdenados = competidoresActualizados.sort(
      (a: Competidor, b: Competidor) => {
        if (a.Kiken && !b.Kiken) return 1;
        if (!a.Kiken && b.Kiken) return -1;
        if (a.Kiken && b.Kiken) return 0;
        if (!a.PuntajeFinal) return 1;
        if (!b.PuntajeFinal) return -1;

        return b.PuntajeFinal! - a.PuntajeFinal!;
      },
    );

    dispatch({ type: "SET_COMPETIDORES", payload: competidoresOrdenados });
    clearAllScores();

    const todosCompletados = competidoresOrdenados.every(
      (comp: Competidor) => comp.PuntajeFinal !== null || comp.Kiken,
    );

    if (todosCompletados) {
      dispatch({ type: "SET_SHOW_RESULTS", payload: true });
    } else {
      const siguienteCompetidor = competidoresOrdenados.find(
        (comp: Competidor) => !comp.PuntajeFinal && !comp.Kiken,
      );

      if (siguienteCompetidor) {
        dispatch({
          type: "SET_TITULO_CATEGORIA",
          payload: siguienteCompetidor.TituloCategoria || "CATEGORIA",
        });
      }
    }
  };

  const handleKiken = () => {
    const competidorSinPuntaje = state.competidores.find(
      (comp: Competidor) => !comp.PuntajeFinal && !comp.Kiken,
    );

    if (!competidorSinPuntaje) return;

    const competidoresActualizados = state.competidores.map(
      (comp: Competidor) => {
        if (comp.id === competidorSinPuntaje.id) {
          return {
            ...comp,
            Kiken: true,
            PuntajeFinal: 0.0,
            PuntajesJueces: [null, null, null, null, null],
          };
        }

        return comp;
      },
    );

    const competidoresOrdenados = competidoresActualizados.sort(
      (a: Competidor, b: Competidor) => {
        if (a.Kiken && !b.Kiken) return 1;
        if (!a.Kiken && b.Kiken) return -1;
        if (a.Kiken && b.Kiken) return 0;
        if (!a.PuntajeFinal) return 1;
        if (!b.PuntajeFinal) return -1;

        return b.PuntajeFinal! - a.PuntajeFinal!;
      },
    );

    dispatch({ type: "SET_COMPETIDORES", payload: competidoresOrdenados });
    clearAllScores();

    const todosCompletados = competidoresOrdenados.every(
      (comp: Competidor) => comp.PuntajeFinal !== null || comp.Kiken,
    );

    if (todosCompletados) {
      dispatch({ type: "SET_SHOW_RESULTS", payload: true });
    } else {
      const siguienteCompetidor = competidoresOrdenados.find(
        (comp: Competidor) => !comp.PuntajeFinal && !comp.Kiken,
      );

      if (siguienteCompetidor) {
        dispatch({
          type: "SET_TITULO_CATEGORIA",
          payload: siguienteCompetidor.TituloCategoria || "CATEGORIA",
        });
      }
    }
  };

  const resetAll = () => {
    dispatch({ type: "RESET_ALL" });
  };

  const value: KataContextType = {
    state,
    dispatch,
    updateJudge,
    clearJudge,
    calculateScore,
    clearAllScores,
    saveScore,
    handleKiken,
    resetAll,
  };

  return <KataContext.Provider value={value}>{children}</KataContext.Provider>;
}

// Hook personalizado
export function useKata() {
  const context = useContext(KataContext);

  if (context === undefined) {
    throw new Error("useKata must be used within a KataProvider");
  }

  return context;
}

export type { Competidor, KataState, KataAction };
