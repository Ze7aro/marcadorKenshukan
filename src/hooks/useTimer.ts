import { useState, useEffect, useCallback, useRef } from "react";

export interface UseTimerOptions {
  initialTime: number;
  onTimeEnd?: (type: "30sec" | "end") => void;
  autoStart?: boolean;
}

export interface UseTimerReturn {
  time: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (newTime?: number) => void;
  setTime: (time: number) => void;
}

/**
 * Hook personalizado para manejar temporizadores
 * @param options - Opciones de configuración del temporizador
 * @returns Objeto con el estado y funciones de control del temporizador
 */
export function useTimer({
  initialTime,
  onTimeEnd,
  autoStart = false,
}: UseTimerOptions): UseTimerReturn {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeEndRef = useRef(onTimeEnd);
  const has30SecWarningFired = useRef(false);

  // Actualizar la referencia del callback
  useEffect(() => {
    onTimeEndRef.current = onTimeEnd;
  }, [onTimeEnd]);

  // Lógica del temporizador
  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;

          // Disparar evento cuando quedan 30 segundos
          if (newTime === 30 && !has30SecWarningFired.current) {
            has30SecWarningFired.current = true;
            onTimeEndRef.current?.("30sec");
          }

          // Disparar evento cuando el tiempo termina
          if (newTime === 0) {
            setIsRunning(false);
            onTimeEndRef.current?.("end");
          }

          return newTime;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  // Función para iniciar el temporizador
  const start = useCallback(() => {
    if (time > 0) {
      setIsRunning(true);
    }
  }, [time]);

  // Función para pausar el temporizador
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Función para reiniciar el temporizador
  const reset = useCallback(
    (newTime?: number) => {
      setIsRunning(false);
      setTime(newTime ?? initialTime);
      has30SecWarningFired.current = false;
    },
    [initialTime]
  );

  // Función para establecer un tiempo específico
  const setTimeValue = useCallback((newTime: number) => {
    setTime(newTime);
    has30SecWarningFired.current = false;
  }, []);

  return {
    time,
    isRunning,
    start,
    pause,
    reset,
    setTime: setTimeValue,
  };
}
