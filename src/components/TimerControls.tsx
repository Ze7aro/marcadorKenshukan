import React from "react";
import { Button } from "@heroui/react";

interface TimerControlsProps {
  selectedTime: number;
  isRunning: boolean;
  hasWinner: boolean;
  onSelectTime: (time: number) => void;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

/**
 * Componente para controles del temporizador de Kumite
 * Incluye botones de selección de tiempo y controles de inicio/pausa/reset
 * Optimizado con React.memo
 */
export const TimerControls = React.memo<TimerControlsProps>(
  ({
    selectedTime,
    isRunning,
    hasWinner,
    onSelectTime,
    onStart,
    onStop,
    onReset,
  }) => {
    return (
      <div className="flex flex-col gap-2 lg:gap-4 w-full">
        {/* Time Selection Buttons */}
        <div className="flex gap-2 lg:gap-4 justify-center flex-wrap">
          <Button
            aria-label="Seleccionar tiempo 3 minutos"
            className="text-xs lg:text-sm"
            isDisabled={hasWinner || isRunning}
            size="sm"
            onPress={() => onSelectTime(180)}
          >
            3:00
          </Button>

          <Button
            aria-label="Seleccionar tiempo 2 minutos"
            className="text-xs lg:text-sm"
            isDisabled={hasWinner || isRunning}
            size="sm"
            onPress={() => onSelectTime(120)}
          >
            2:00
          </Button>

          <Button
            aria-label="Seleccionar tiempo 1 minuto"
            className="text-xs lg:text-sm"
            isDisabled={hasWinner || isRunning}
            size="sm"
            onPress={() => onSelectTime(60)}
          >
            1:00
          </Button>

          <Button
            aria-label="Seleccionar tiempo 1 minuto 30 segundos"
            className="text-xs lg:text-sm"
            isDisabled={hasWinner || isRunning}
            size="sm"
            onPress={() => onSelectTime(90)}
          >
            1:30
          </Button>

          <Button
            aria-label="Seleccionar tiempo 30 segundos"
            className="text-xs lg:text-sm"
            isDisabled={hasWinner || isRunning}
            size="sm"
            onPress={() => onSelectTime(30)}
          >
            0:30
          </Button>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2 lg:gap-4 justify-center flex-wrap">
          <Button
            aria-label={isRunning ? "Pausar temporizador" : "Iniciar temporizador"}
            className="text-xs lg:text-sm"
            isDisabled={hasWinner || isRunning || selectedTime === 0}
            size="sm"
            onPress={onStart}
          >
            {isRunning ? "Reanudar" : "Iniciar"}
          </Button>

          <Button
            aria-label="Detener temporizador"
            className="text-xs lg:text-sm"
            isDisabled={hasWinner || !isRunning}
            size="sm"
            onPress={onStop}
          >
            Detener
          </Button>

          <Button
            aria-label="Reiniciar temporizador"
            className="text-xs lg:text-sm"
            isDisabled={hasWinner || isRunning || selectedTime === 0}
            size="sm"
            onPress={onReset}
          >
            Reiniciar
          </Button>
        </div>
      </div>
    );
  },
);

TimerControls.displayName = "TimerControls";
