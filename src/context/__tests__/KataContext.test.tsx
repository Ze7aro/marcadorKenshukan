import { renderHook, act } from "@testing-library/react";
import { KataProvider, useKata } from "../KataContext";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock hooks used in provider
vi.mock("@/hooks", () => ({
    useLocalStorage: (key: string, initial: any) => {
        // Simple mock implementation
        return [initial, vi.fn(), vi.fn()];
    },
    useBroadcastChannel: () => vi.fn(),
}));

describe("KataContext Integration", () => {
    // wrapper is needed to provide the context
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <KataProvider>{children}</KataProvider>
    );

    it("should initialize with default values", () => {
        const { result } = renderHook(() => useKata(), { wrapper });
        expect(result.current.state.numJudges).toBe(5);
        expect(result.current.state.base).toBe(6);
        expect(result.current.state.competidores).toEqual([]);
        expect(result.current.state.judges).toHaveLength(5);
    });

    it("should calculate score correctly for 5 judges (drop high/low)", () => {
        const { result } = renderHook(() => useKata(), { wrapper });

        act(() => {
            // Set 5 judges scores
            // 7.0, 8.0, 7.5, 7.5, 7.0
            // Sorted: 7.0, 7.0, 7.5, 7.5, 8.0
            // Drop: 7.0 (low) and 8.0 (high)
            // Sum: 7.0 + 7.5 + 7.5 = 22.0
            result.current.updateJudge(0, "7.0");
            result.current.updateJudge(1, "8.0");
            result.current.updateJudge(2, "7.5");
            result.current.updateJudge(3, "7.5");
            result.current.updateJudge(4, "7.0");
        });

        act(() => {
            result.current.calculateScore();
        });

        expect(result.current.state.score).toBe("22");
        expect(result.current.state.lowScore).toBe("7.0");
        expect(result.current.state.highScore).toBe("8.0");
    });

    it("should calculate score correctly for 3 judges (sum all)", () => {
        const { result } = renderHook(() => useKata(), { wrapper });

        act(() => {
            result.current.dispatch({ type: "SET_NUM_JUDGES", payload: 3 });
        });

        expect(result.current.state.numJudges).toBe(3);

        act(() => {
            // Set 3 judges scores
            // 7.0, 8.0, 7.5
            // Sum: 22.5
            result.current.updateJudge(0, "7.0");
            result.current.updateJudge(1, "8.0");
            result.current.updateJudge(2, "7.5");
        });

        act(() => {
            result.current.calculateScore();
        });

        expect(result.current.state.score).toBe("22.5");
        // With 3 judges, low/high are not dropped/displayed in the same way (logic sets them to empty string in ClearScores but calculateScore sets payload)
        // Looking at Context logic for 3 judges: 
        // payload: { low: "", high: "", final: ... }
        expect(result.current.state.lowScore).toBe("");
        expect(result.current.state.highScore).toBe("");
    });

    it("should add a competitor", () => {
        const { result } = renderHook(() => useKata(), { wrapper });

        const newCompetitor = {
            id: 123,
            Nombre: "Test Player",
            Edad: 20,
            Categoria: "Senior",
            TituloCategoria: "Senior Male",
            PuntajeFinal: null,
            PuntajesJueces: [null, null, null, null, null],
            Kiken: false
        };

        act(() => {
            result.current.dispatch({ type: 'ADD_COMPETIDOR', payload: newCompetitor });
        });

        expect(result.current.state.competidores).toHaveLength(1);
        expect(result.current.state.competidores[0].Nombre).toBe("Test Player");
    });

    it("should handle Kiken correctly", () => {
        const { result } = renderHook(() => useKata(), { wrapper });

        const competitor1 = {
            id: 1,
            Nombre: "Player 1",
            Edad: 20,
            Categoria: "Senior",
            TituloCategoria: "Senior",
            PuntajeFinal: null,
            PuntajesJueces: [],
            Kiken: false
        };

        act(() => {
            result.current.dispatch({ type: 'ADD_COMPETIDOR', payload: competitor1 });
        });

        act(() => {
            // Need to be "current competitor" logic (find !PuntajeFinal && !Kiken)
            result.current.handleKiken();
        });

        expect(result.current.state.competidores[0].Kiken).toBe(true);
        expect(result.current.state.competidores[0].PuntajeFinal).toBe(0.0);
    });
});
