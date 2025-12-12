import { renderHook, act } from "@testing-library/react";
import { useTimer } from "../useTimer";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("useTimer Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize with given time", () => {
    const { result } = renderHook(() => useTimer({ initialTime: 60 }));
    expect(result.current.time).toBe(60);
    expect(result.current.isRunning).toBe(false);
  });

  it("should start and decrement time", () => {
    const { result } = renderHook(() => useTimer({ initialTime: 60 }));

    act(() => {
      result.current.start();
    });

    expect(result.current.isRunning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.time).toBe(59);
  });

  it("should pause the timer", () => {
    const { result } = renderHook(() =>
      useTimer({ initialTime: 60, autoStart: true })
    );

    expect(result.current.isRunning).toBe(true);

    act(() => {
      result.current.pause();
    });

    expect(result.current.isRunning).toBe(false);

    // Time should not change after pause
    const currentTime = result.current.time;
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.time).toBe(currentTime);
  });

  it("should call onTimeEnd when time reaches 0", () => {
    const onTimeEnd = vi.fn();
    const { result } = renderHook(() =>
      useTimer({ initialTime: 2, onTimeEnd, autoStart: true })
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.time).toBe(0);
    expect(onTimeEnd).toHaveBeenLastCalledWith("end");
    expect(result.current.isRunning).toBe(false);
  });

  it("should call onTimeEnd with '30sec' when time reaches 30", () => {
    const onTimeEnd = vi.fn();
    // Start at 32 seconds
    const { result } = renderHook(() =>
      useTimer({ initialTime: 32, onTimeEnd, autoStart: true })
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.time).toBe(30);
    expect(onTimeEnd).toHaveBeenCalledWith("30sec");
  });

  it("should reset the timer", () => {
    const { result } = renderHook(() => useTimer({ initialTime: 60 }));

    // Start timer
    act(() => {
      result.current.start();
    });

    // Advance time separately to ensure state update has processed
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.time).toBe(55);

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.time).toBe(60);
    expect(result.current.isRunning).toBe(false);
  });

  it("should reset with new time if provided", () => {
    const { result } = renderHook(() => useTimer({ initialTime: 60 }));

    act(() => {
      result.current.reset(120);
    });

    expect(result.current.time).toBe(120);
  });
});
