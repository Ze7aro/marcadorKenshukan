import { useRef, useEffect, useState } from "react";
import { Button, Image } from "@heroui/react";
import { MdLockReset, MdUndo } from "react-icons/md";

import { PanelCard } from "./KumiteComponents/PanelCard";
import ModalLlaves from "./KumiteComponents/ModalLlaves";
import { Ganador } from "./KumiteComponents/Ganador";
import { Temporizador } from "./KumiteComponents/Temporizador";

import { MenuComponent } from "@/components/MenuComponent";
import { CommonInput } from "@/components/CommonInput";
import { AreaSelector } from "@/components/AreaSelector";
import { ExcelUploader } from "@/components/ExcelUploader";
import { TimerControls } from "@/components/TimerControls";
import { AnimatedPage } from "@/components/AnimatedPage";
import { ConfigModal } from "@/components/ConfigModal";
import { HistoryLog } from "@/components/HistoryLog";

import Logo from "@/assets/images/kenshukan-logo.png";
import Bell from "@/assets/bell.wav";
import Bell3 from "@/assets/bell3.wav";
import ShiroBelt from "@/assets/images/shiroStill.gif";
import AkaBelt from "@/assets/images/akaStill.gif";
import { useBreakpoint } from "@/config/useBreakpoint";
import { KumiteProvider, useKumite } from "@/context/KumiteContext";

function KumitePageContent() {
  const {
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
  } = useKumite();

  const { timer, scores, match, bracket } = state;

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioFinalRef = useRef<HTMLAudioElement>(null);

  // Local UI state for resetKey if needed, but we try to rely on timer state
  const [resetKey, setResetKey] = useState(0);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const breakpoints = useBreakpoint();
  const isSm =
    breakpoints === "sm" || breakpoints === "md" || breakpoints === "lg";
  const isLgUp = ["xl", "2xl"].includes(breakpoints);

  // Sync resetKey when timer is reset (optional, but helps if Temporizador needs it)
  useEffect(() => {
    if (
      !timer.temporizadorIniciado &&
      timer.tiempoRestante === timer.selectedTime
    ) {
      setResetKey((prev) => prev + 1);
    }
  }, [timer.temporizadorIniciado, timer.tiempoRestante, timer.selectedTime]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && !match.ganador) {
        if (timer.temporizadorIniciado) {
          stopTimer();
        } else if (timer.tiempoRestante > 0) {
          startTimer();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    timer.temporizadorIniciado,
    timer.tiempoRestante,
    match.ganador,
    startTimer,
    stopTimer,
  ]);

  const sonarCampana = () => {
    audioRef.current?.play();
  };

  const sonarCampanaFinal = () => {
    audioFinalRef.current?.play();
  };

  const handleTimeEnd = (type: "30sec" | "end") => {
    if (type === "30sec") {
      sonarCampana();
    } else if (type === "end") {
      stopTimer();
      sonarCampanaFinal();
    }
  };

  const onTimeUpdate = (time: number) => {
    // Update context with current time so broadcast works
    dispatch({ type: "SET_TIMER", payload: { tiempoRestante: time } });
  };

  const handleOpenKumiteDisplay = () => {
    window.open("/kumite-display", "_blank", "width=1280,height=800");
    setTimeout(() => {
      broadcastData();
    }, 1000);
  };

  return (
    <AnimatedPage className="w-full min-h-screen flex flex-col px-2 sm:px-4 md:px-6 lg:px-10 py-2 bg-gradient-to-b from-blue-500/30 to-blue-800/90">
      {/* Header Section */}
      <div className="w-full flex flex-col lg:flex-row justify-between gap-4 mb-4">
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-[10%] lg:h-[10%] ${isSm ? "mx-auto lg:mx-0" : ""}`}
        >
          <Image
            alt="Logo"
            className="w-full h-full object-cover rounded-full"
            src={Logo}
          />
        </div>

        <div className="w-full flex flex-row lg:flex-row justify-center gap-4 lg:gap-16 self-center">
          <div className="flex flex-row sm:flex-row gap-2 sm:gap-4 justify-center items-center">
            <h3 className="font-semibold self-center text-lg sm:text-xl lg:text-2xl">
              Categoría:
            </h3>
            <CommonInput isReadOnly label="Categoria" value={match.categoria} />
            <ExcelUploader
              disabled={!match.areaSeleccionada}
              onUpload={(e) => {
                const file = e.target.files?.[0];

                if (file) handleFileUpload(file);
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center">
            <h2 className="text-black dark:text-white font-semibold text-xl sm:text-2xl lg:text-3xl">
              Area:
            </h2>
            <AreaSelector
              disabled={match.areaSeleccionada}
              value={match.area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 justify-center">
            <ModalLlaves bracket={bracket} />
          </div>
          <div className="grid grid-cols-2 gap-2 self-center">
            <MenuComponent
              handleOpenConfig={() => setIsConfigOpen(true)}
              handleOpenKumiteDisplay={handleOpenKumiteDisplay}
              onExportExcel={() =>
                import("@/utils/exportUtils").then((m) =>
                  m.exportResultsToExcel(bracket),
                )
              }
              onExportPDF={() =>
                import("@/utils/exportUtils").then(m =>
                  m.exportResultsToPDF(bracket, match.categoria)
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`w-full flex ${isSm ? "flex-col" : "py-20 flex flex-col xl:flex-row"} overflow-hidden justify-between items-start gap-4 flex-1`}
      >
        {/* ... (rest of content) ... */}
        {/* (Bottom of function) */}
        <Ganador
          ganador={match.ganador}
          isOpen={match.showGanador}
          nombreGanador={match.ganadorNombre}
          onClose={closeWinnerModal}
        />
        <ConfigModal
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
        />
        <div className="w-full xl:flex-1 order-2 xl:order-1">
          <PanelCard
            atenai={scores.aka.atenai}
            atenaiChui={scores.aka.atenaiChui}
            atenaiHansoku={scores.aka.atenaiHansoku}
            cinto="aka"
            disabled={match.ganador !== null}
            imagen={AkaBelt}
            ippon={scores.aka.ippon}
            kiken={scores.aka.kiken}
            kinshi={scores.aka.kinshi}
            kinshiChui={scores.aka.kinshiChui}
            kinshiHansoku={scores.aka.kinshiHansoku}
            kinshiNi={scores.aka.kinshiNi}
            nombre={scores.aka.nombre}
            shikaku={scores.aka.shikaku}
            wazari={scores.aka.wazari}
            // Penalties
            // Handlers
            onAtenai={() => updateScore("aka", "atenai")}
            onAtenaiChui={() => updateScore("aka", "atenaiChui")}
            onAtenaiHansoku={() => updateScore("aka", "atenaiHansoku")} // Handled in context logic to trigger winner
            onHantei={() => setWinner("aka")} // Hantei = manual winner selection
            onIppon={() => updateScore("aka", "ippon")}
            onKiken={() => updateScore("aka", "kiken")}
            onKinshi={() => updateScore("aka", "kinshi")}
            onKinshiChui={() => updateScore("aka", "kinshiChui")}
            onKinshiHansoku={() => updateScore("aka", "kinshiHansoku")}
            onKinshiNi={() => updateScore("aka", "kinshiNi")}
            onShikaku={() => updateScore("aka", "shikaku")}
            onWazari={() => updateScore("aka", "wazari")}
          />
        </div>
        {/* Timer Section (Reordered based on breakpoint for visual consistency with original) */}
        <div
          className={`w-full ${isSm ? "flex flex-col order-1" : "xl:w-[20%] flex flex-col order-1 xl:order-2"} justify-center items-center gap-2 min-h-[200px] sm:min-h-[250px] xl:min-h-[400px]`}
        >
          {isLgUp && (
            <div className="flex gap-2 lg:gap-4 justify-center flex-wrap">
              {[180, 120, 60].map((t) => (
                <Button
                  key={t}
                  className="text-xs lg:text-sm"
                  isDisabled={
                    match.ganador !== null || timer.temporizadorIniciado
                  }
                  size="sm"
                  onPress={() => selectTime(t)}
                >
                  {t === 180 ? "3:00" : t === 120 ? "2:00" : "1:00"}
                </Button>
              ))}
            </div>
          )}
          {!isLgUp && (
            <TimerControls
              hasWinner={match.ganador !== null}
              isRunning={timer.temporizadorIniciado}
              selectedTime={timer.selectedTime}
              onReset={resetTimer}
              onSelectTime={selectTime}
              onStart={startTimer}
              onStop={stopTimer}
            />
          )}

          <Temporizador
            initialTime={timer.tiempoRestante}
            isRunning={timer.temporizadorIniciado}
            resetKey={resetKey}
            onTimeEnd={handleTimeEnd}
            onTimeUpdate={onTimeUpdate}
          />

          {isLgUp && (
            <div className="flex gap-2 lg:gap-4 justify-center flex-wrap">
              <Button
                className="text-xs lg:text-sm"
                isDisabled={
                  match.ganador !== null ||
                  timer.temporizadorIniciado ||
                  timer.selectedTime === 0
                }
                size="sm"
                onPress={startTimer}
              >
                {timer.temporizadorIniciado ? "Reanudar" : "Iniciar"}
              </Button>
              <Button
                className="text-xs lg:text-sm"
                isDisabled={
                  match.ganador !== null || !timer.temporizadorIniciado
                }
                size="sm"
                onPress={stopTimer}
              >
                Detener
              </Button>
              <Button
                className="text-xs lg:text-sm"
                isDisabled={
                  match.ganador !== null ||
                  timer.temporizadorIniciado ||
                  timer.selectedTime === 0
                }
                size="sm"
                onPress={resetTimer}
              >
                Reiniciar
              </Button>
            </div>
          )}

          {match.ganador && (
            <Button
              className="text-xs sm:text-sm"
              color="success"
              size="sm"
              onPress={nextMatch}
            >
              Siguiente Combate
            </Button>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex gap-2 lg:gap-4 justify-center flex-wrap">
              <Button
                className="text-xs"
                isDisabled={match.ganador !== null}
                size="sm"
                variant="light"
                onPress={sonarCampana}
              >
                Campana 30 seg
              </Button>
              <Button
                aria-label="Reiniciar Todo"
                size="sm"
                variant="light"
                onPress={resetAll}
              >
                <MdLockReset className="text-lg sm:text-xl lg:text-2xl" />
              </Button>
              <Button
                className="text-xs"
                isDisabled={match.ganador !== null}
                size="sm"
                variant="light"
                onPress={sonarCampanaFinal}
              >
                Campana fin del tiempo
              </Button>
            </div>
            <div className="flex gap-2 justify-center w-full">
              <Button
                color="warning"
                isDisabled={state.history.length === 0}
                size="sm"
                startContent={<MdUndo className="text-xl" />}
                variant="flat"
                onPress={undoLastAction}
              >
                Deshacer
              </Button>
            </div>
            <div className="w-full mt-2 h-40">
              <HistoryLog />
            </div>
            <audio ref={audioRef}>
              <source src={Bell} type="audio/wav" />
              <track kind="captions" label="Español" src="" />
            </audio>
            <audio ref={audioFinalRef}>
              <source src={Bell3} type="audio/wav" />
              <track kind="captions" label="Español" src="" />
            </audio>
          </div>
        </div>
        <div className="w-full xl:flex-1 order-3 xl:order-3">
          <PanelCard
            atenai={scores.shiro.atenai}
            atenaiChui={scores.shiro.atenaiChui}
            atenaiHansoku={scores.shiro.atenaiHansoku}
            cinto="shiro"
            disabled={match.ganador !== null}
            imagen={ShiroBelt}
            ippon={scores.shiro.ippon}
            kiken={scores.shiro.kiken}
            kinshi={scores.shiro.kinshi}
            kinshiChui={scores.shiro.kinshiChui}
            kinshiHansoku={scores.shiro.kinshiHansoku}
            kinshiNi={scores.shiro.kinshiNi}
            nombre={scores.shiro.nombre}
            shikaku={scores.shiro.shikaku}
            wazari={scores.shiro.wazari}
            // Penalties
            // Handlers
            onAtenai={() => updateScore("shiro", "atenai")}
            onAtenaiChui={() => updateScore("shiro", "atenaiChui")}
            onAtenaiHansoku={() => updateScore("shiro", "atenaiHansoku")}
            onHantei={() => setWinner("shiro")}
            onIppon={() => updateScore("shiro", "ippon")}
            onKiken={() => updateScore("shiro", "kiken")}
            onKinshi={() => updateScore("shiro", "kinshi")}
            onKinshiChui={() => updateScore("shiro", "kinshiChui")}
            onKinshiHansoku={() => updateScore("shiro", "kinshiHansoku")}
            onKinshiNi={() => updateScore("shiro", "kinshiNi")}
            onShikaku={() => updateScore("shiro", "shikaku")}
            onWazari={() => updateScore("shiro", "wazari")}
          />
        </div>
      </div>

      <Ganador
        ganador={match.ganador}
        isOpen={match.showGanador}
        nombreGanador={match.ganadorNombre}
        onClose={closeWinnerModal}
      />
    </AnimatedPage>
  );
}

export default function KumitePage() {
  return (
    <KumiteProvider>
      <KumitePageContent />
    </KumiteProvider>
  );
}
