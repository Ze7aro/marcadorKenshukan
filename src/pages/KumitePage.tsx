import { useState, useEffect, useRef, useReducer } from "react";
import { Button, Input, Select, SelectItem, Image } from "@heroui/react";
import * as XLSX from "xlsx";

import { PanelCard } from "./KumiteComponents/PanelCard";
import ModalLlaves from "./KataComponents/ModalLlaves";
import { Ganador } from "./KumiteComponents/Ganador";
import { Temporizador } from "./KumiteComponents/Temporizador";

import Logo from "@/assets/images/kenshukan-logo.png";
import Bell from "@/assets/bell.wav";
import Bell3 from "@/assets/bell3.wav";
import ShiroBelt from "@/assets/images/shiroStill.gif";
import AkaBelt from "@/assets/images/akaStill.gif";
import DefaultLayout from "@/layouts/default";
import { MenuComponent } from "@/components/MenuComponent";
import { CommonInput } from "@/components/CommonInput";

const kumiteChannel = new BroadcastChannel("kumite-channel");

const initialState = {
  timer: {
    tiempoRestante: 180,
    tiempoInicial: 180,
    temporizadorIniciado: false,
    timerStarted: false,
    timerPaused: false,
    selectedTime: 180,
  },
  scores: {
    aka: {
      wazari: 0,
      ippon: 0,
      kinshi: false,
      kinshiNi: false,
      kinshiChui: false,
      kinshiHansoku: false,
      atenai: false,
      atenaiChui: false,
      atenaiHansoku: false,
      shikaku: false,
      kiken: false,
      nombre: "",
    },
    shiro: {
      wazari: 0,
      ippon: 0,
      kinshi: false,
      kinshiNi: false,
      kinshiChui: false,
      kinshiHansoku: false,
      atenai: false,
      atenaiChui: false,
      atenaiHansoku: false,
      shikaku: false,
      kiken: false,
      nombre: "",
    },
  },
  match: {
    ganador: null,
    showGanador: false,
    categoria: "",
    area: "",
    areaSeleccionada: false,
  },
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "SET_TIMER":
      return {
        ...state,
        timer: { ...state.timer, ...action.payload },
      };
    case "UPDATE_SCORE":
      return {
        ...state,
        scores: {
          ...state.scores,
          [action.competitor]: {
            ...state.scores[action.competitor],
            ...action.payload,
          },
        },
      };
    case "UPDATE_MATCH":
      return {
        ...state,
        match: { ...state.match, ...action.payload },
      };
    case "RESET_ALL":
      return initialState;
    default:
      return state;
  }
}

interface Competidor {
  id: number;
  Nombre: string;
  Edad: number;
}

export default function KumitePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioFinalRef = useRef<HTMLAudioElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTime, setSelectedTime] = useState(180);
  const [competidores, setCompetidores] = useState<Competidor[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const items = [
    { key: "1", label: "Area 1" },
    { key: "2", label: "Area 2" },
    { key: "3", label: "Area 3" },
    { key: "4", label: "Area 4" },
    { key: "5", label: "Area 5" },
  ];

  // Efecto para manejar la barra espaciadora
  useEffect(() => {
    const handleKeyPress = (e: any) => {
      if (e.code === "Space" && !state.match.ganador) {
        if (isRunning) {
          detenerTemporizador();
        } else if (selectedTime > 0) {
          iniciarTemporizador();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isRunning, selectedTime, state.match.ganador]);

  const handleTimeEnd = (type: any) => {
    if (type === "30sec") {
      sonarCampana();
    } else if (type === "end") {
      setIsRunning(false);
      sonarCampanaFinal();
    }
  };

  useEffect(() => {
    const puntajeAka = calcularPuntaje(
      state.scores.aka.wazari,
      state.scores.aka.ippon
    );
    const puntajeShiro = calcularPuntaje(
      state.scores.shiro.wazari,
      state.scores.shiro.ippon
    );

    if (puntajeAka >= 3) {
      dispatch({
        type: "UPDATE_MATCH",
        payload: { ganador: "aka", showGanador: true },
      });
      detenerTemporizador();
    } else if (puntajeShiro >= 3) {
      dispatch({
        type: "UPDATE_MATCH",
        payload: { ganador: "shiro", showGanador: true },
      });
      detenerTemporizador();
    }
  }, [
    state.scores.aka.wazari,
    state.scores.aka.ippon,
    state.scores.shiro.wazari,
    state.scores.shiro.ippon,
  ]);

  const iniciarTemporizador = () => {
    if (!isRunning && selectedTime > 0) {
      setIsRunning(true);
      dispatch({
        type: "SET_TIMER",
        payload: {
          temporizadorIniciado: true,
          tiempoRestante: selectedTime,
        },
      });
    }
  };

  const detenerTemporizador = () => {
    setIsRunning(false);
    dispatch({
      type: "SET_TIMER",
      payload: {
        temporizadorIniciado: false,
      },
    });
  };

  const reiniciarTemporizador = async () => {
    if (selectedTime > 0) {
      setIsRunning(false);
      setCurrentTime(selectedTime);
      setResetKey((prev) => prev + 1);
      dispatch({
        type: "SET_TIMER",
        payload: {
          temporizadorIniciado: false,
          tiempoRestante: selectedTime,
        },
      });
    }
  };

  const seleccionarTiempo = (tiempo: any) => {
    setIsRunning(false);
    setSelectedTime(tiempo);
    setCurrentTime(tiempo);
    setResetKey((prev) => prev + 1);
  };

  function resetAll() {
    setIsRunning(false);
    setSelectedTime(0);
    setCurrentTime(0);
    setResetKey((prev) => prev + 1);
    dispatch({
      type: "RESET_ALL",
    });
  }

  const sonarCampana = () => {
    audioRef.current?.play();
  };

  const sonarCampanaFinal = () => {
    audioFinalRef.current?.play();
  };

  const calcularPuntaje = (wazari: any, ippon: any) => {
    return wazari * 0.5 + ippon;
  };

  const handleAkaWazari = () => {
    if (!state.match.ganador) {
      dispatch({
        type: "UPDATE_SCORE",
        competitor: "aka",
        payload: { wazari: state.scores.aka.wazari + 1 },
      });
    }
  };

  const handleAkaIppon = () => {
    if (!state.match.ganador) {
      dispatch({
        type: "UPDATE_SCORE",
        competitor: "aka",
        payload: { ippon: state.scores.aka.ippon + 1 },
      });
    }
  };

  const handleShiroWazari = () => {
    if (!state.match.ganador) {
      dispatch({
        type: "UPDATE_SCORE",
        competitor: "shiro",
        payload: { wazari: state.scores.shiro.wazari + 1 },
      });
    }
  };

  const handleShiroIppon = () => {
    if (!state.match.ganador) {
      dispatch({
        type: "UPDATE_SCORE",
        competitor: "shiro",
        payload: { ippon: state.scores.shiro.ippon + 1 },
      });
    }
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const categoriaCell = worksheet["B1"];
        const akaCell = worksheet["A3"];
        const shiroCell = worksheet["A4"];

        // Extraer competidores del Excel
        const competidoresExtraidos: Competidor[] = [];
        let row = 3; // Empezar desde la fila 3
        let id = 1;

        while (true) {
          const nombreCell = worksheet[`A${row}`];
          const edadCell = worksheet[`B${row}`];

          if (!nombreCell || !nombreCell.v) break;

          competidoresExtraidos.push({
            id: id++,
            Nombre: nombreCell.v.toString(),
            Edad: edadCell ? parseInt(edadCell.v.toString()) || 0 : 0,
          });

          row++;
        }

        // Actualizar el estado con los competidores extraídos
        if (competidoresExtraidos.length > 0) {
          setCompetidores(competidoresExtraidos);
        }

        if (categoriaCell || akaCell || shiroCell) {
          dispatch({
            type: "UPDATE_MATCH",
            payload: { categoria: categoriaCell?.v || "" },
          });

          dispatch({
            type: "UPDATE_SCORE",
            competitor: "aka",
            payload: { nombre: akaCell?.v || "" },
          });

          dispatch({
            type: "UPDATE_SCORE",
            competitor: "shiro",
            payload: { nombre: shiroCell?.v || "" },
          });

          handleOpenKumiteDisplay();
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleAreaChange = (e: any) => {
    dispatch({
      type: "UPDATE_MATCH",
      payload: { area: e.target.value, areaSeleccionada: true },
    });
  };

  const handleAkaShikaku = () => {
    dispatch({
      type: "UPDATE_MATCH",
      payload: { ganador: "shiro", showGanador: true },
    });
    detenerTemporizador();
  };

  const handleAkaKiken = () => {
    dispatch({
      type: "UPDATE_MATCH",
      payload: { ganador: "shiro", showGanador: true },
    });
    detenerTemporizador();
  };

  const handleShiroShikaku = () => {
    dispatch({
      type: "UPDATE_MATCH",
      payload: { ganador: "aka", showGanador: true },
    });
    detenerTemporizador();
  };

  const handleShiroKiken = () => {
    dispatch({
      type: "UPDATE_MATCH",
      payload: { ganador: "aka", showGanador: true },
    });
    detenerTemporizador();
  };

  const handleAkaKinshiHansoku = () => {
    dispatch({
      type: "UPDATE_SCORE",
      competitor: "aka",
      payload: { kinshiHansoku: true },
    });
    dispatch({
      type: "UPDATE_MATCH",
      payload: { ganador: "shiro", showGanador: true },
    });
    detenerTemporizador();
  };

  const handleAkaAtenaiHansoku = () => {
    dispatch({
      type: "UPDATE_SCORE",
      competitor: "aka",
      payload: { atenaiHansoku: true },
    });
    dispatch({
      type: "UPDATE_MATCH",
      payload: { ganador: "shiro", showGanador: true },
    });
    detenerTemporizador();
  };

  const handleShiroKinshiHansoku = () => {
    dispatch({
      type: "UPDATE_SCORE",
      competitor: "shiro",
      payload: { kinshiHansoku: true },
    });
    dispatch({
      type: "UPDATE_MATCH",
      payload: { ganador: "aka", showGanador: true },
    });
    detenerTemporizador();
  };

  const handleShiroAtenaiHansoku = () => {
    dispatch({
      type: "UPDATE_SCORE",
      competitor: "shiro",
      payload: { atenaiHansoku: true },
    });
    dispatch({
      type: "UPDATE_MATCH",
      payload: { ganador: "aka", showGanador: true },
    });
    detenerTemporizador();
  };

  const handleAkaHantei = () => {
    dispatch({
      type: "UPDATE_MATCH",
      payload: { ganador: "aka", showGanador: true },
    });
    detenerTemporizador();
  };

  const handleShiroHantei = () => {
    dispatch({
      type: "UPDATE_MATCH",
      payload: { ganador: "shiro", showGanador: true },
    });
    detenerTemporizador();
  };

  const handleOpenKumiteDisplay = async () => {
    const nuevaVentana = window.open(
      "/kumite-display",
      "_blank",
      "width=1280,height=800"
    );

    const dataParaEnviar = {
      scores: {
        aka: {
          wazari: state.scores.aka.wazari,
          ippon: state.scores.aka.ippon,
          nombre: state.scores.aka.nombre,
          kinshi: state.scores.aka.kinshi,
          kinshiNi: state.scores.aka.kinshiNi,
          kinshiChui: state.scores.aka.kinshiChui,
          kinshiHansoku: state.scores.aka.kinshiHansoku,
          atenai: state.scores.aka.atenai,
          atenaiChui: state.scores.aka.atenaiChui,
          atenaiHansoku: state.scores.aka.atenaiHansoku,
          shikaku: state.scores.aka.shikaku,
          kiken: state.scores.aka.kiken,
        },
        shiro: {
          wazari: state.scores.shiro.wazari,
          ippon: state.scores.shiro.ippon,
          nombre: state.scores.shiro.nombre,
          kinshi: state.scores.shiro.kinshi,
          kinshiNi: state.scores.shiro.kinshiNi,
          kinshiChui: state.scores.shiro.kinshiChui,
          kinshiHansoku: state.scores.shiro.kinshiHansoku,
          atenai: state.scores.shiro.atenai,
          atenaiChui: state.scores.shiro.atenaiChui,
          atenaiHansoku: state.scores.shiro.atenaiHansoku,
          shikaku: state.scores.shiro.shikaku,
          kiken: state.scores.shiro.kiken,
        },
      },
      timer: {
        isRunning: isRunning,
        time: currentTime || selectedTime,
      },
    };

    const interval = setInterval(() => {
      if (nuevaVentana?.document?.readyState === "complete") {
        nuevaVentana?.dispatchEvent(
          new CustomEvent("update-kumite", { detail: dataParaEnviar })
        );
        clearInterval(interval);
      }
    }, 100);

    setTimeout(() => {
      nuevaVentana?.dispatchEvent(
        new CustomEvent("update-kumite", { detail: dataParaEnviar })
      );
    }, 500);
  };

  const updateSecondaryWindow = (currentTimeValue: any) => {
    setCurrentTime(currentTimeValue);
  };

  useEffect(() => {
    const dataParaEnviar = {
      scores: {
        aka: {
          wazari: state.scores.aka.wazari,
          ippon: state.scores.aka.ippon,
          nombre: state.scores.aka.nombre,
          kinshi: state.scores.aka.kinshi,
          kinshiNi: state.scores.aka.kinshiNi,
          kinshiChui: state.scores.aka.kinshiChui,
          kinshiHansoku: state.scores.aka.kinshiHansoku,
          atenai: state.scores.aka.atenai,
          atenaiChui: state.scores.aka.atenaiChui,
          atenaiHansoku: state.scores.aka.atenaiHansoku,
          shikaku: state.scores.aka.shikaku,
          kiken: state.scores.aka.kiken,
        },
        shiro: {
          wazari: state.scores.shiro.wazari,
          ippon: state.scores.shiro.ippon,
          nombre: state.scores.shiro.nombre,
          kinshi: state.scores.shiro.kinshi,
          kinshiNi: state.scores.shiro.kinshiNi,
          kinshiChui: state.scores.shiro.kinshiChui,
          kinshiHansoku: state.scores.shiro.kinshiHansoku,
          atenai: state.scores.shiro.atenai,
          atenaiChui: state.scores.shiro.atenaiChui,
          atenaiHansoku: state.scores.shiro.atenaiHansoku,
          shikaku: state.scores.shiro.shikaku,
          kiken: state.scores.shiro.kiken,
        },
      },
      timer: {
        isRunning: isRunning,
        time: currentTime || selectedTime,
      },
    };

    kumiteChannel.postMessage(dataParaEnviar);
  }, [state.scores, isRunning, currentTime, selectedTime]);

  return (
    <DefaultLayout>
      <div className="w-full h-screen justify-between flex flex-col p-10 bg-gradient-to-b from-blue-500/30 to-blue-800/90">
        <div className="w-full flex justify-between">
          <div className="w-[10%] h-[10%]">
            <Image
              alt="Logo"
              className="w-full h-full object-cover rounded-full"
              src={Logo}
            />
          </div>
          <div className="flex gap-16 self-center">
            <div className="flex gap-4">
              <h3 className="font-semibold self-center text-2xl">Categoría:</h3>
              <CommonInput
                isReadOnly
                label="Categoria"
                value={state.match.categoria}
              />
              <input
                accept=".xlsx,.xls"
                className="hidden"
                id="excel-upload"
                type="file"
                onChange={handleFileUpload}
              />
              <Button
                className="bg-green-700 text-white self-center"
                onPress={() =>
                  document?.getElementById("excel-upload")?.click()
                }
              >
                Cargar Excel
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <h2 className="text-black dark:text-white font-semibold text-3xl">
                Area:
              </h2>
              {state.match.areaSeleccionada ? (
                <Input
                  isReadOnly
                  className="rounded-md text-center font-bold"
                  value={state.match.area}
                />
              ) : (
                <Select
                  className="rounded-md"
                  label="Area"
                  placeholder="Seleccionar Area"
                  value={state.match.area}
                  onChange={handleAreaChange}
                >
                  {items.map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                  ))}
                </Select>
              )}
            </div>
            <div className="flex items-center gap-4">
              <ModalLlaves competidores={competidores} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 self-center">
            <MenuComponent handleOpenKumiteDisplay={handleOpenKumiteDisplay} />
          </div>
        </div>
        <div className="w-full flex justify-between items-start gap-4">
          <div className="w-3/5">
            <PanelCard
              atenai={state.scores.aka.atenai}
              atenaiChui={state.scores.aka.atenaiChui}
              atenaiHansoku={state.scores.aka.atenaiHansoku}
              cinto="aka"
              disabled={state.match.ganador !== null}
              imagen={AkaBelt}
              ippon={state.scores.aka.ippon}
              kiken={state.scores.aka.kiken}
              kinshi={state.scores.aka.kinshi}
              kinshiChui={state.scores.aka.kinshiChui}
              kinshiHansoku={state.scores.aka.kinshiHansoku}
              kinshiNi={state.scores.aka.kinshiNi}
              nombre={state.scores.aka.nombre}
              shikaku={state.scores.aka.shikaku}
              wazari={state.scores.aka.wazari}
              onAtenai={() =>
                dispatch({
                  type: "UPDATE_SCORE",
                  competitor: "aka",
                  payload: { atenai: true },
                })
              }
              onAtenaiChui={() =>
                dispatch({
                  type: "UPDATE_SCORE",
                  competitor: "aka",
                  payload: { atenaiChui: true },
                })
              }
              onAtenaiHansoku={handleAkaAtenaiHansoku}
              onHantei={handleAkaHantei}
              onIppon={handleAkaIppon}
              onKiken={handleAkaKiken}
              onKinshi={() =>
                dispatch({
                  type: "UPDATE_SCORE",
                  competitor: "aka",
                  payload: { kinshi: true },
                })
              }
              onKinshiChui={() =>
                dispatch({
                  type: "UPDATE_SCORE",
                  competitor: "aka",
                  payload: { kinshiChui: true },
                })
              }
              onKinshiHansoku={handleAkaKinshiHansoku}
              onKinshiNi={() =>
                dispatch({
                  type: "UPDATE_SCORE",
                  competitor: "aka",
                  payload: { kinshiNi: true },
                })
              }
              onShikaku={handleAkaShikaku}
              onWazari={handleAkaWazari}
            />
          </div>
          <div className="w-3/5 flex flex-col justify-center items-center gap-2">
            <div className="flex gap-4 justify-center">
              <Button
                isDisabled={state.match.ganador !== null || isRunning}
                onPress={() => seleccionarTiempo(180)}
              >
                3:00
              </Button>
              <Button
                isDisabled={state.match.ganador !== null || isRunning}
                onPress={() => seleccionarTiempo(120)}
              >
                2:00
              </Button>
              <Button
                isDisabled={state.match.ganador !== null || isRunning}
                onPress={() => seleccionarTiempo(60)}
              >
                1:00
              </Button>
            </div>

            <Temporizador
              initialTime={currentTime || selectedTime}
              isRunning={isRunning}
              resetKey={resetKey}
              onTimeEnd={handleTimeEnd}
              onTimeUpdate={updateSecondaryWindow}
            />

            <div className="flex gap-4 justify-center">
              <Button
                isDisabled={
                  state.match.ganador !== null ||
                  isRunning ||
                  selectedTime === 0
                }
                onPress={iniciarTemporizador}
              >
                {isRunning ? "Reanudar" : "Iniciar"}
              </Button>
              <Button
                isDisabled={state.match.ganador !== null || !isRunning}
                onPress={detenerTemporizador}
              >
                Detener
              </Button>
              <Button
                isDisabled={
                  state.match.ganador !== null ||
                  isRunning ||
                  selectedTime === 0
                }
                onPress={reiniciarTemporizador}
              >
                Reiniciar
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Button onPress={resetAll}>Reiniciar Todo</Button>
              <div className="flex gap-10 justify-center">
                <Button
                  isDisabled={state.match.ganador !== null}
                  variant="light"
                  onPress={sonarCampana}
                >
                  Campana 30 seg
                </Button>
                <Button
                  isDisabled={state.match.ganador !== null}
                  variant="light"
                  onPress={sonarCampanaFinal}
                >
                  Campana fin del tiempo
                </Button>
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
          <div className="w-3/5">
            <PanelCard
              atenai={state.scores.shiro.atenai}
              atenaiChui={state.scores.shiro.atenaiChui}
              atenaiHansoku={state.scores.shiro.atenaiHansoku}
              cinto="shiro"
              disabled={state.match.ganador !== null}
              imagen={ShiroBelt}
              ippon={state.scores.shiro.ippon}
              kiken={state.scores.shiro.kiken}
              kinshi={state.scores.shiro.kinshi}
              kinshiChui={state.scores.shiro.kinshiChui}
              kinshiHansoku={state.scores.shiro.kinshiHansoku}
              kinshiNi={state.scores.shiro.kinshiNi}
              nombre={state.scores.shiro.nombre}
              shikaku={state.scores.shiro.shikaku}
              wazari={state.scores.shiro.wazari}
              onAtenai={() =>
                dispatch({
                  type: "UPDATE_SCORE",
                  competitor: "shiro",
                  payload: { atenai: true },
                })
              }
              onAtenaiChui={() =>
                dispatch({
                  type: "UPDATE_SCORE",
                  competitor: "shiro",
                  payload: { atenaiChui: true },
                })
              }
              onAtenaiHansoku={handleShiroAtenaiHansoku}
              onHantei={handleShiroHantei}
              onIppon={handleShiroIppon}
              onKiken={handleShiroKiken}
              onKinshi={() =>
                dispatch({
                  type: "UPDATE_SCORE",
                  competitor: "shiro",
                  payload: { kinshi: true },
                })
              }
              onKinshiChui={() =>
                dispatch({
                  type: "UPDATE_SCORE",
                  competitor: "shiro",
                  payload: { kinshiChui: true },
                })
              }
              onKinshiHansoku={handleShiroKinshiHansoku}
              onKinshiNi={() =>
                dispatch({
                  type: "UPDATE_SCORE",
                  competitor: "shiro",
                  payload: { kinshiNi: true },
                })
              }
              onShikaku={handleShiroShikaku}
              onWazari={handleShiroWazari}
            />
          </div>
        </div>
        <Ganador
          ganador={state.match.ganador}
          isOpen={state.match.showGanador}
          onClose={() =>
            dispatch({ type: "UPDATE_MATCH", payload: { showGanador: false } })
          }
        />
      </div>
    </DefaultLayout>
  );
}
