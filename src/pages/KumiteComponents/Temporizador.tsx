import { FC, useState, useEffect } from "react";

interface TemporizadorProps {
  initialTime: number;
  isRunning: boolean;
  onTimeEnd: (type: "30sec" | "end") => void;
  onTimeUpdate: (time: number) => void;
  resetKey?: number;
}

export const Temporizador: FC<TemporizadorProps> = ({
  initialTime,
  isRunning,
  onTimeEnd,
  onTimeUpdate,
  resetKey = 0,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime, resetKey]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;

          // Notificar el tiempo actual
          if (onTimeUpdate) {
            onTimeUpdate(newTime);
          }

          // Notificar eventos especiales
          if (newTime === 30) {
            onTimeEnd("30sec");
          } else if (newTime === 0) {
            onTimeEnd("end");
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, timeLeft, onTimeEnd, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white p-4 rounded-lg box-shadow-lg">
      <div className="text-center">
        <div className="text-lg mb-2">TIEMPO</div>
        <div className="text-8xl font-bold">{formatTime(timeLeft)}</div>
        <div className="text-lg mt-2">
          {isRunning ? "En curso" : "Detenido"}
        </div>
      </div>
    </div>
  );
};
