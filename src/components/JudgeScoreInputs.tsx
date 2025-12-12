// ... imports
import React from "react";
import { Input } from "@heroui/react";
import { MdCancel } from "react-icons/md";

interface JudgeScoreInputsProps {
  judges: string[];
  numJudges: number;
  submitted: boolean;
  onJudgeChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onJudgeClear: (index: number) => void;
  onJudgeBlur: (index: number) => void;
}

/**
 * Componente para los inputs de puntajes de jueces
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
export const JudgeScoreInputs = React.memo<JudgeScoreInputsProps>(
  ({
    judges,
    numJudges,
    submitted,
    onJudgeChange,
    onJudgeClear,
    onJudgeBlur,
  }) => {
    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      index: number,
    ) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const nextTabIndex = index + 2; // index is 0-based, tabIndex is 1-based, so next is +2
        const nextElement = document.querySelector(
          `[tabindex="${nextTabIndex}"]`,
        ) as HTMLElement;

        if (nextElement) {
          nextElement.focus();
        }
      }
    };

    return (
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 justify-between lg:gap-4">
        {judges.slice(0, numJudges).map((judge, index) => (
          <div key={index} className="flex flex-col gap-1 w-full">
            <span className="text-md font-semibold pl-1 uppercase">
              {index === 0 ? "Juez 1 (Principal)" : `Juez ${index + 1}`}
            </span>
            <Input
              isClearable
              aria-label={`Puntaje del Juez ${index + 1}`}
              className="w-full"
              endContent={<MdCancel />}
              errorMessage={
                <p className="text-shadow-lg/30 font-semibold text-xs">
                  Puntaje requerido
                </p>
              }
              isInvalid={submitted && !judge}
              maxLength={3}
              placeholder="0.0"
              size="lg"
              tabIndex={index + 1}
              type="text"
              value={judge}
              variant="faded"
              onBlur={() => onJudgeBlur(index)}
              onChange={(e) => onJudgeChange(index, e)}
              onClear={() => onJudgeClear(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          </div>
        ))}
      </div>
    );
  },
);

JudgeScoreInputs.displayName = "JudgeScoreInputs";
