import { renderHook, act } from "@testing-library/react";
import { KumiteProvider, useKumite } from "../KumiteContext";
import { ConfigProvider } from "../ConfigContext";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock hooks
vi.mock("@/hooks/useBroadcastChannel", () => ({
    useBroadcastChannel: () => vi.fn(),
}));

describe("KumiteContext Integration", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ConfigProvider>
            <KumiteProvider>{children}</KumiteProvider>
        </ConfigProvider>
    );

    it("should initialize default state", () => {
        const { result } = renderHook(() => useKumite(), { wrapper });
        expect(result.current.state.scores.aka.wazari).toBe(0);
        expect(result.current.state.scores.shiro.ippon).toBe(0);
    });

    it("should update scores correctly", () => {
        const { result } = renderHook(() => useKumite(), { wrapper });

        act(() => {
            // Add Wazari to AKA
            result.current.updateScore("aka", "wazari");
        });

        expect(result.current.state.scores.aka.wazari).toBe(1);

        act(() => {
            // Add Ippon to SHIRO
            result.current.updateScore("shiro", "ippon");
        });

        expect(result.current.state.scores.shiro.ippon).toBe(1);
    });

    it("should declare winner automatically if difference is >= winThreshold (default 6)", () => {
        const { result } = renderHook(() => useKumite(), { wrapper });

        // Init bracket so there is a match to set winner for
        act(() => {
            result.current.dispatch({ type: "INIT_DEFAULT_BRACKET" });
        });

        act(() => {
            // 6 points needed (assuming default config)
            // 2 Ippons = 6 points
            result.current.dispatch({
                type: "UPDATE_SCORE",
                competitor: "aka",
                payload: { ippon: 6 }
            });
        });

        expect(result.current.state.match.ganador).toBe("aka");
        expect(result.current.state.match.showGanador).toBe(true);
    });

    it("should specific penalties trigger opponent win", () => {
        const { result } = renderHook(() => useKumite(), { wrapper });

        act(() => {
            result.current.dispatch({ type: "INIT_DEFAULT_BRACKET" });
        });

        act(() => {
            // AKA gets Shikaku (Disqualification) -> SHIRO wins
            result.current.updateScore("aka", "shikaku", true);
        });

        expect(result.current.state.match.ganador).toBe("shiro");
    });
});
