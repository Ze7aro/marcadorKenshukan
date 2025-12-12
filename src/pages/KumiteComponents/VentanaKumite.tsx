import { useState, useEffect } from "react";
import { Image } from "@heroui/react";

import { Match } from "@/types";
import AkaBelt from "@/assets/images/akaStill.gif";
import ShiroBelt from "@/assets/images/shiroStill.gif";

const kumiteChannel = new BroadcastChannel("kumite-channel");

const OptimizedImage = ({ src, alt, width, height }: any) => {
  return (
    <Image
      alt={alt}
      className="justify-start"
      height={height}
      src={src}
      width={width}
    />
  );
};

interface KumiteData {
  scores: {
    aka: {
      wazari: number;
      ippon: number;
      nombre: string;
      kinshi: boolean;
      kinshiNi: boolean;
      kinshiChui: boolean;
      kinshiHansoku: boolean;
      atenai: boolean;
      atenaiChui: boolean;
      atenaiHansoku: boolean;
      shikaku: boolean;
      kiken: boolean;
    };
    shiro: {
      wazari: number;
      ippon: number;
      nombre: string;
      kinshi: boolean;
      kinshiNi: boolean;
      kinshiChui: boolean;
      kinshiHansoku: boolean;
      atenai: boolean;
      atenaiChui: boolean;
      atenaiHansoku: boolean;
      shikaku: boolean;
      kiken: boolean;
    };
  };
  timer: {
    isRunning: boolean;
    time: number;
  };
  matchInfo: {
    current: Match | null;
    next: Match | null;
  };
}

const KumiteDisplay = () => {
  const [data, setData] = useState<KumiteData>({
    scores: {
      aka: {
        wazari: 0,
        ippon: 0,
        nombre: "",
        kinshi: false,
        kinshiNi: false,
        kinshiChui: false,
        kinshiHansoku: false,
        atenai: false,
        atenaiChui: false,
        atenaiHansoku: false,
        shikaku: false,
        kiken: false,
      },
      shiro: {
        wazari: 0,
        ippon: 0,
        nombre: "",
        kinshi: false,
        kinshiNi: false,
        kinshiChui: false,
        kinshiHansoku: false,
        atenai: false,
        atenaiChui: false,
        atenaiHansoku: false,
        shikaku: false,
        kiken: false,
      },
    },
    timer: {
      isRunning: false,
      time: 0,
    },
    matchInfo: {
      current: null,
      next: null,
    },
  });

  const updateData = (newData: any) => {
    setData((prevData) => {
      if (
        !newData.timer.isRunning &&
        newData.timer.time !== prevData.timer.time
      ) {
        return {
          ...newData,
          timer: {
            ...newData.timer,
            time: newData.timer.time,
          },
        };
      }

      if (newData.timer.isRunning) {
        return {
          ...newData,
          timer: {
            ...newData.timer,
            time: newData.timer.time,
          },
        };
      }

      return {
        ...newData,
        timer: {
          ...newData.timer,
          time: prevData.timer.time,
        },
      };
    });
  };

  useEffect(() => {
    kumiteChannel.onmessage = (event) => {
      if (event.data) {
        updateData(event.data);
      }
    };

    const handleCustomEvent = (event: any) => {
      if (event.detail) {
        updateData(event.detail);
      }
    };

    window.addEventListener("update-kumite", handleCustomEvent);

    const handleTauriEvent = (event: any) => {
      if (event.data) {
        updateData(event.data);
      }
    };

    window.addEventListener("tauri://update-kumite", handleTauriEvent);

    return () => {
      kumiteChannel.onmessage = null;
      window.removeEventListener("update-kumite", handleCustomEvent);
      window.removeEventListener("tauri://update-kumite", handleTauriEvent);
    };
  }, []);

  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const calcularKinshis = (scores: any) => {
    let kinshis = 0;

    if (scores.kinshi) kinshis++;
    if (scores.kinshiNi) kinshis++;
    if (scores.kinshiChui) kinshis++;
    if (scores.kinshiHansoku) kinshis++;

    return kinshis;
  };

  const calcularAtenai = (scores: any) => {
    let atenai = 0;

    if (scores.atenai) atenai++;
    if (scores.atenaiChui) atenai++;
    if (scores.atenaiHansoku) atenai++;

    return atenai;
  };

  const ScoreDisplay = ({ competitor, image, scores }: any) => (
    <div className="w-1/2 bg-white shadow-lg rounded-lg p-4">
      <div className="w-full flex flex-col items-center gap-4">
        <div className="w-full bg-black flex flex-row justify-between items-center gap-4">
          <OptimizedImage
            alt={`${competitor} belt`}
            height="100%"
            src={image}
            width="100%"
          />
          <h1 className="text-4xl text-white font-semibold px-4">
            {scores.nombre.toUpperCase() || `${competitor.toUpperCase()}`}
          </h1>
        </div>
        <div className="flex flex-row justify-between w-full gap-10">
          <div className="flex flex-col justify-start gap-5 self-center">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Advertencias</h2>
              <h2 className="text-xl font-bold">{calcularKinshis(scores)}/4</h2>
            </div>
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">
                Advertencias <br />
                por contacto
              </h2>
              <h2 className="text-xl font-bold">{calcularAtenai(scores)}/3</h2>
            </div>
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">
                {scores.shikaku ? "SHIKAKU" : scores.kiken ? "KIKEN" : ""}
              </h2>
            </div>
          </div>
          <div className="flex justify-center gap-10 px-10">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-3xl font-semibold">WAZARI</h2>
              <h2 className="text-4xl font-bold">{scores.wazari}</h2>
            </div>
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-3xl font-semibold">IPPON</h2>
              <h2 className="text-4xl font-bold">{scores.ippon}</h2>
            </div>
          </div>
        </div>
        <h2 className="text-3xl font-bold self-end px-20">
          Total: {(scores.wazari * 0.5 + scores.ippon).toFixed(1)}
        </h2>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-around w-full h-screen bg-gradient-to-b from-blue-500/40 to-blue-800/90 gap-4 p-4">
      <div className="w-full flex items-start justify-end">
        <div className="rounded-lg p-2 shadow-lg">
          <h2 className="text-xl font-bold uppercase text-gray-800 flex items-center gap-2">
            <span>PRÓXIMO COMBATE:</span>
            {data.matchInfo?.next && data.matchInfo.next.pair[0] !== "--" ? (
              <>
                <span className="text-red-500">
                  {typeof data.matchInfo.next.pair[0] === "object"
                    ? data.matchInfo.next.pair[0].Nombre
                    : data.matchInfo.next.pair[0]}
                </span>
                <span>VS</span>
                <span className="text-white">
                  {typeof data.matchInfo.next.pair[1] === "object"
                    ? data.matchInfo.next.pair[1].Nombre
                    : data.matchInfo.next.pair[1]}
                </span>
              </>
            ) : (
              <span className="text-gray-500">No hay más combates</span>
            )}
          </h2>
        </div>
      </div>
      <div className="w-full flex justify-center pb-4">
        <div className="w-1/4 flex flex-col justify-center items-center gap-2 bg-white rounded-lg p-4">
          <div>
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-2xl font-bold">TIEMPO</h2>
              <h2 className="text-4xl font-bold">
                {formatTime(data.timer.time)}
              </h2>
              <h2 className="text-lg">
                {data.timer.isRunning ? "En curso" : "Detenido"}
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className=" w-full flex items-center gap-4">
        <ScoreDisplay
          competitor="aka"
          image={AkaBelt}
          scores={data.scores.aka}
        />
        <ScoreDisplay
          competitor="shiro"
          image={ShiroBelt}
          scores={data.scores.shiro}
        />
      </div>
    </div>
  );
};

export default KumiteDisplay;
