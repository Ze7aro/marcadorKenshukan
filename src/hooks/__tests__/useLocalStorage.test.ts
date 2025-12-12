import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../useLocalStorage";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const TEST_KEY = "test-key";
const INITIAL_VALUE = "initial";

describe("useLocalStorage Hook", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("should return initial value if no value in localStorage", () => {
    const { result } = renderHook(() =>
      useLocalStorage(TEST_KEY, INITIAL_VALUE)
    );
    expect(result.current[0]).toBe(INITIAL_VALUE);
  });

  it("should return value from localStorage if exists", () => {
    window.localStorage.setItem(TEST_KEY, JSON.stringify("stored"));
    const { result } = renderHook(() =>
      useLocalStorage(TEST_KEY, INITIAL_VALUE)
    );
    expect(result.current[0]).toBe("stored");
  });

  it("should update value and localStorage", () => {
    const { result } = renderHook(() =>
      useLocalStorage(TEST_KEY, INITIAL_VALUE)
    );

    act(() => {
      result.current[1]("new value");
    });

    expect(result.current[0]).toBe("new value");
    expect(window.localStorage.getItem(TEST_KEY)).toBe(
      JSON.stringify("new value")
    );
  });

  it("should support functional updates", () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 1));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
    expect(window.localStorage.getItem(TEST_KEY)).toBe(JSON.stringify(2));
  });

  it("should remove value from localStorage", () => {
    window.localStorage.setItem(TEST_KEY, JSON.stringify("stored"));
    const { result } = renderHook(() =>
      useLocalStorage(TEST_KEY, INITIAL_VALUE)
    );

    act(() => {
      result.current[2](); // removeValue
    });

    expect(result.current[0]).toBe(INITIAL_VALUE);
    expect(window.localStorage.getItem(TEST_KEY)).toBeNull();
  });

  // Testing synchronization/event dispatching
  it("should dispatch custom event on update", () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    const { result } = renderHook(() =>
      useLocalStorage(TEST_KEY, INITIAL_VALUE)
    );

    act(() => {
      result.current[1]("update");
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
    expect(event.type).toBe("local-storage");
    expect(event.detail).toEqual({ key: TEST_KEY, value: "update" });
  });

  it("should sync state when custom event is fired", () => {
    const { result } = renderHook(() =>
      useLocalStorage(TEST_KEY, INITIAL_VALUE)
    );

    act(() => {
      window.dispatchEvent(
        new CustomEvent("local-storage", {
          detail: { key: TEST_KEY, value: "synced" },
        })
      );
    });

    expect(result.current[0]).toBe("synced");
  });

  it("should sync state when storage event is fired", () => {
    const { result } = renderHook(() =>
      useLocalStorage(TEST_KEY, INITIAL_VALUE)
    );

    act(() => {
      // Simulate storage event from another tab
      const event = new StorageEvent("storage", {
        key: TEST_KEY,
        newValue: JSON.stringify("external"),
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe("external");
  });
});
