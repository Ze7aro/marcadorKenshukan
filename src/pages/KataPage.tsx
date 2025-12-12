import { useEffect, useCallback, useState } from "react";
import { Button, Image, Input, Select, SelectItem } from "@heroui/react";
import { read } from "xlsx";

import { AgregarCompetidor } from "./KataComponents/AgregarCompetidor";
import ResultadosFinales from "./KataComponents/ResultadosFinales";

import Logo from "@/assets/images/kenshukan-logo.png";
import { CommonInput } from "@/components/CommonInput";
import { MenuComponent } from "@/components/MenuComponent";
import { showToast } from "@/utils/toast";
import { JudgeScoreInputs } from "@/components/JudgeScoreInputs";
import { CompetitorTable } from "@/components/CompetitorTable";
import { AreaSelector } from "@/components/AreaSelector";
import { AnimatedPage } from "@/components/AnimatedPage";
import { KataProvider, useKata, Competidor } from "@/context/KataContext";

// Interface for new competitor dialog
interface NuevoCompetidor {
  Nombre: string;
  Edad: number;
  Categoria: string;
}

function KataPageContent() {
  const {
    state,
    dispatch,
    updateJudge,
    clearJudge,
    calculateScore,
    clearAllScores,
    saveScore,
    handleKiken,
    resetAll,
  } = useKata();

  const {
    competidores,
    judges,
    numJudges,
    lowScore,
    highScore,
    score,
    base,
    categoria,
    tituloCategoria,
    area,
    areaSeleccionada,
    showResults,
    showAgregarDialog,
    submitted,
  } = state;

  // Local UI state (not persisted/shared)
  const [isLoading, setIsLoading] = useState(false);

  // Memoizar los handlers
  const handleChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      if (submitted) {
        dispatch({ type: "SET_SUBMITTED", payload: false });
      }
      const value = e.target.value;

      // Validar formato: solo números, punto y máximo un punto
      const formatoValido = /^\d*\.?\d*$/.test(value);

      if (!formatoValido) {
        return;
      }

      // Agregar automáticamente el punto después del primer número
      let processedValue = value;

      if (value.length === 1 && /^\d$/.test(value)) {
        processedValue = value + ".";
      }

      // Si hay un valor, validar el rango según la media
      if (processedValue && processedValue !== ".") {
        const puntaje = parseFloat(processedValue);

        // Definir rangos según la media
        let minPuntaje: number;
        let maxPuntaje: number;

        switch (base) {
          case 6:
            minPuntaje = 5;
            maxPuntaje = 7;
            break;
          case 7:
            minPuntaje = 6;
            maxPuntaje = 8;
            break;
          case 8:
            minPuntaje = 7;
            maxPuntaje = 9;
            break;
          default:
            minPuntaje = 5;
            maxPuntaje = 7;
        }

        // Validar que el puntaje esté dentro del rango
        if (puntaje < minPuntaje || puntaje > maxPuntaje) {
          return;
        }
      }

      updateJudge(index, processedValue);
    },
    [judges, base, submitted, dispatch, updateJudge],
  );

  const handleClear = (index: number) => {
    if (submitted) {
      dispatch({ type: "SET_SUBMITTED", payload: false });
    }
    clearJudge(index);
  };

  const handleBlur = (index: number) => {
    const currentValue = judges[index];

    // Si el valor termina en punto, agregar "0"
    if (currentValue && currentValue.endsWith(".")) {
      updateJudge(index, currentValue + "0");
    }
  };

  // Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        saveScore();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveScore]);

  const agregarCompetidor = () => {
    dispatch({ type: "SET_SHOW_AGREGAR_DIALOG", payload: true });
  };

  const handleAgregarSubmit = (nuevoCompetidor: NuevoCompetidor) => {
    if (
      !nuevoCompetidor.Nombre ||
      !nuevoCompetidor.Edad ||
      !nuevoCompetidor.Categoria
    ) {
      showToast.error("Por favor complete todos los campos");

      return;
    }

    const competidor: Competidor = {
      id: Date.now(),
      ...nuevoCompetidor,
      TituloCategoria: nuevoCompetidor.Categoria,
      PuntajeFinal: null,
      PuntajesJueces: [null, null, null, null, null],
      Kiken: false,
    };

    dispatch({ type: "ADD_COMPETIDOR", payload: competidor });
    dispatch({ type: "SET_SHOW_AGREGAR_DIALOG", payload: false });
  };

  const handleOpenKataDisplay = () => {
    const nuevaVentana = window.open(
      "/kata-display",
      "_blank",
      "width=1280,height=800",
    );

    const competidorActual = competidores.find(
      (comp: Competidor) => !comp.PuntajeFinal && !comp.Kiken,
    );

    const dataParaEnviar = {
      competidor: competidorActual?.Nombre || "",
      categoria: categoria || "",
      puntajes: judges.map((judge: string) => judge || ""),
      puntajeFinal: score || "",
      puntajeMenor: lowScore || "",
      puntajeMayor: highScore || "",
      competidores: competidores,
    };

    // Enviar datos inmediatamente cuando se abra la ventana
    const interval = setInterval(() => {
      if (nuevaVentana?.document?.readyState === "complete") {
        nuevaVentana.dispatchEvent(
          new CustomEvent("update-kata", { detail: dataParaEnviar }),
        );
        clearInterval(interval);
      }
    }, 100);

    // También enviar a la ventana actual por si acaso
    setTimeout(() => {
      nuevaVentana?.dispatchEvent(
        new CustomEvent("update-kata", { detail: dataParaEnviar }),
      );
    }, 500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setIsLoading(true);
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Simular carga para mostrar skeleton
        setTimeout(() => {
          const data = e.target?.result;

          if (data) {
            const workbook = read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const categoriaCell = worksheet["B1"];

            if (categoriaCell) {
              dispatch({ type: "SET_CATEGORIA", payload: categoriaCell.v });
              dispatch({
                type: "SET_TITULO_CATEGORIA",
                payload: categoriaCell.v,
              });
            }

            const competidoresData: Competidor[] = [];
            let row = 3;

            while (worksheet[`A${row}`]) {
              competidoresData.push({
                id: Date.now() + row,
                Nombre: worksheet[`A${row}`]?.v || "",
                Edad: worksheet[`B${row}`]?.v || "",
                Categoria: worksheet[`C${row}`]?.v || "",
                TituloCategoria: categoriaCell?.v || "",
                PuntajeFinal: null,
                PuntajesJueces: [null, null, null, null, null],
                Kiken: false,
              });
              row++;
            }

            if (competidoresData.length > 0) {
              dispatch({ type: "SET_COMPETIDORES", payload: competidoresData });
            }
          }
          setIsLoading(false);
        }, 500);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleAreaChange = (e: any) => {
    dispatch({ type: "SET_AREA", payload: e.target.value });
    dispatch({ type: "SET_AREA_SELECCIONADA", payload: true });
  };

  return (
    <AnimatedPage className="w-full min-h-screen justify-around flex flex-col px-2 sm:px-4 md:px-6 lg:px-10 py-2 bg-gradient-to-b from-blue-500/30 to-blue-800/90">
      <div className="w-full flex flex-col lg:flex-row justify-between gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-[10%] lg:h-[10%] self-center lg:self-start">
          <Image
            alt="Logo"
            className="w-full h-full object-cover rounded-full"
            src={Logo}
          />
        </div>
        <div className="w-full flex flex-row lg:flex-row justify-center gap-4 lg:gap-16 self-center">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
            <h3 className="font-semibold self-center text-lg sm:text-xl lg:text-2xl">
              Categoría:
            </h3>
            <CommonInput isReadOnly label="Categoria" value={categoria} />
            <input
              accept=".xlsx,.xls"
              className="hidden"
              id="excel-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <Button
              aria-label="Cargar archivo Excel con competidores"
              className="bg-green-700 text-white self-center text-sm sm:text-base"
              isDisabled={!areaSeleccionada || isLoading}
              isLoading={isLoading}
              onPress={() => document?.getElementById("excel-upload")?.click()}
            >
              {isLoading ? "Cargando..." : "Cargar Excel"}
            </Button>
          </div>
          <div className="w-1/6 flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <h2 className="text-black dark:text-white font-semibold text-xl sm:text-2xl lg:text-3xl">
              Area:
            </h2>
            <AreaSelector
              disabled={areaSeleccionada}
              value={area}
              onChange={handleAreaChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 self-center">
            <MenuComponent handleOpenKataDisplay={handleOpenKataDisplay} />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col lg:flex-row justify-center gap-4 lg:gap-6">
        <div className="w-full lg:w-2/3 flex flex-col sm:flex-row gap-2 justify-center">
          <h3 className="font-semibold text-lg sm:text-xl pt-2 sm:pt-5 text-center sm:text-left">
            COMPETIDORES:
          </h3>
          <CompetitorTable competidores={competidores} isLoading={isLoading} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 pl-1 uppercase">
            PUNTUACION MEDIA:
          </span>
          <Select
            className="col-span-2 h-7"
            placeholder="Seleccione"
            selectedKeys={[base.toString()]}
            onChange={(e) => {
              dispatch({ type: "SET_BASE", payload: parseInt(e.target.value) });
            }}
          >
            <SelectItem key={6}>6</SelectItem>
            <SelectItem key={7}>7</SelectItem>
            <SelectItem key={8}>8</SelectItem>
          </Select>
          <div className="col-span-2 text-xs text-gray-600 dark:text-white text-center">
            {base === 6 && "Rango permitido: 5.0 - 7.0"}
            {base === 7 && "Rango permitido: 6.0 - 8.0"}
            {base === 8 && "Rango permitido: 7.0 - 9.0"}
          </div>
          <Button
            aria-label="Seleccionar 3 jueces"
            className="text-xs sm:text-sm"
            size="md"
            onPress={() => {
              dispatch({ type: "SET_NUM_JUDGES", payload: 3 });
            }}
          >
            3 Jueces
          </Button>
          <Button
            aria-label="Seleccionar 5 jueces"
            className="text-xs sm:text-sm"
            size="md"
            onPress={() => {
              dispatch({ type: "SET_NUM_JUDGES", payload: 5 });
            }}
          >
            5 Jueces
          </Button>
          <Button
            aria-label="Agregar nuevo competidor manualmente"
            className="bg-green-500 text-white font-semibold hover:bg-green-400 rounded-md col-span-2 text-xs sm:text-sm"
            size="sm"
            onPress={agregarCompetidor}
          >
            + Agregar competidor
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-4 sm:pt-8">
        <JudgeScoreInputs
          judges={judges}
          numJudges={numJudges}
          submitted={submitted}
          onJudgeBlur={handleBlur}
          onJudgeChange={handleChange}
          onJudgeClear={handleClear}
        />
        <div className="flex flex-row lg:flex-col gap-2 lg:gap-4 justify-center">
          <Button
            aria-label="Calcular puntaje final"
            className="bg-gray-500 text-white font-semibold hover:bg-gray-400 rounded-md text-xs sm:text-sm"
            size="sm"
            tabIndex={judges.length + 1}
            onPress={calculateScore}
          >
            Calcular
          </Button>
          <Button
            aria-label="Marcar competidor como Kiken (Abandono)"
            className="bg-red-500 text-white font-semibold hover:bg-red-400 text-xs sm:text-sm"
            size="sm"
            tabIndex={judges.length + 2}
            onPress={handleKiken}
          >
            Kiken
          </Button>
        </div>
      </div>

      <div
        className={`flex flex-col lg:flex-row ${judges.length === 5 ? "justify-between" : "justify-end"} gap-4`}
      >
        {judges.length !== 3 && (
          <div className="w-3/4 lg:w-auto flex flex-col gap-1">
            <span className="text-lg font-semibold pl-1">Menor puntaje:</span>
            <Input
              className="w-3/4"
              classNames={{
                input: "text-4xl lg:text-6xl font-bold text-center",
                inputWrapper: "h-16 lg:h-24",
              }}
              labelPlacement="outside"
              placeholder="0.0"
              size="lg"
              value={lowScore}
            />
          </div>
        )}
        {judges.length !== 3 && (
          <div className="w-3/4 lg:w-auto flex flex-col gap-1">
            <span className="text-lg font-semibold pl-1">Mayor puntaje:</span>
            <Input
              className="w-3/4"
              classNames={{
                input: "text-4xl lg:text-6xl font-bold text-center",
                inputWrapper: "h-16 lg:h-24",
              }}
              labelPlacement="outside"
              placeholder="0.0"
              size="lg"
              value={highScore}
            />
          </div>
        )}
        <div className="w-3/4 lg:w-auto flex flex-col gap-1">
          <span className="text-lg font-semibold pl-1">Puntaje Final:</span>
          <Input
            className="w-3/4"
            classNames={{
              input: "text-4xl lg:text-6xl font-bold text-center",
              inputWrapper: "h-16 lg:h-24",
            }}
            labelPlacement="outside"
            placeholder="Total"
            size="lg"
            value={score}
          />
        </div>
        <div className="w-1/4 grid grid-cols-2 gap-3 lg:gap-4">
          <Button
            aria-label="Limpiar todos los campos"
            size="sm"
            onPress={clearAllScores}
          >
            Limpiar
          </Button>
          <Button
            aria-label="Guardar puntaje del competidor actual (Ctrl + Enter)"
            className="bg-blue-500 text-white font-semibold hover:bg-blue-400 text-xs sm:text-sm"
            isDisabled={isLoading}
            isLoading={isLoading}
            size="sm"
            title="Ctrl + Enter"
            onPress={saveScore}
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            aria-label="Reiniciar toda la competencia"
            className="w-full col-span-2 text-xs sm:text-sm"
            size="sm"
            onPress={resetAll}
          >
            Reiniciar Todo
          </Button>
        </div>
      </div>
      <ResultadosFinales
        competidores={competidores}
        judges={judges}
        showDialog={showResults}
        tituloCategoria={tituloCategoria}
        onClose={() => dispatch({ type: "SET_SHOW_RESULTS", payload: false })}
      />
      <AgregarCompetidor
        showDialog={showAgregarDialog}
        onClose={() =>
          dispatch({ type: "SET_SHOW_AGREGAR_DIALOG", payload: false })
        }
        onSubmit={handleAgregarSubmit}
      />
    </AnimatedPage>
  );
}

export default function KataPage() {
  return (
    <KataProvider>
      <KataPageContent />
    </KataProvider>
  );
}
