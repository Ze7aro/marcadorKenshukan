import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Image,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { read } from "xlsx";
import { MdCancel } from "react-icons/md";

import { AgregarCompetidor } from "./KataComponents/AgregarCompetidor";
import ResultadosFinales from "./KataComponents/ResultadosFinales";

import DefaultLayout from "@/layouts/default";
import Logo from "@/assets/images/kenshukan-logo.png";
import { CommonInput } from "@/components/CommonInput";
import { MenuComponent } from "@/components/MenuComponent";

interface Competidor {
  id: number;
  Nombre: string;
  Edad: number;
  Categoria: string;
  TituloCategoria: string;
  PuntajeFinal: number | null;
  PuntajesJueces: (string | null)[];
  Kiken: boolean;
}

interface NuevoCompetidor {
  Nombre: string;
  Edad: number;
  Categoria: string;
}

// Crear el canal de broadcast fuera del componente para que sea único por pestaña
const kataChannel = new BroadcastChannel("kata-channel");

export default function KataPage() {
  const [competidores, setCompetidores] = useState<Competidor[]>(() => {
    const saved = localStorage.getItem("kataCompetidores");

    return saved ? JSON.parse(saved) : [];
  });
  const [judges, setJudges] = useState<string[]>(() => {
    const saved = localStorage.getItem("kataJudges");

    return saved ? JSON.parse(saved) : Array(5).fill("");
  });
  const [numJudges, setNumJudges] = useState(() => {
    const saved = localStorage.getItem("kataNumJudges");

    return saved ? parseInt(saved) : 5;
  });
  const [lowScore, setLowScore] = useState<string>(() => {
    const saved = localStorage.getItem("kataLowScore");

    return saved || "";
  });
  const [highScore, setHighScore] = useState<string>(() => {
    const saved = localStorage.getItem("kataHighScore");

    return saved || "";
  });
  const [score, setScore] = useState<string>(() => {
    const saved = localStorage.getItem("kataScore");

    return saved || "";
  });
  const [base, setBase] = useState<number>(() => {
    const saved = localStorage.getItem("kataBase");

    return saved ? parseInt(saved) : 6;
  });
  const [categoria, setCategoria] = useState<string>(() => {
    const saved = localStorage.getItem("kataCategoria");

    return saved || "";
  });
  const [tituloCategoria, setTituloCategoria] = useState<string>(() => {
    const saved = localStorage.getItem("kataTituloCategoria");

    return saved || "";
  });
  const [categorias, setCategorias] = useState<{
    mayores: string[];
    menores: string[];
  }>(() => {
    const saved = localStorage.getItem("kataCategorias");

    return saved
      ? JSON.parse(saved)
      : {
          mayores: [],
          menores: [],
        };
  });

  const [showResults, setShowResults] = useState(false);
  const [showAgregarDialog, setShowAgregarDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Memoizar los valores calculados
  const competidorActual = useMemo(() => {
    return competidores.find(
      (comp: Competidor) => !comp.PuntajeFinal && !comp.Kiken
    );
  }, [competidores]);

  // Separar los efectos por responsabilidad
  useEffect(() => {
    localStorage.setItem("kataCompetidores", JSON.stringify(competidores));
  }, [competidores]);

  useEffect(() => {
    localStorage.setItem("kataJudges", JSON.stringify(judges));
    localStorage.setItem("kataNumJudges", numJudges.toString());
  }, [judges, numJudges]);

  useEffect(() => {
    if (lowScore) localStorage.setItem("kataLowScore", lowScore);
    if (highScore) localStorage.setItem("kataHighScore", highScore);
    if (score) localStorage.setItem("kataScore", score);
  }, [lowScore, highScore, score]);

  useEffect(() => {
    localStorage.setItem("kataBase", base.toString());
    localStorage.setItem("kataCategoria", categoria);
    localStorage.setItem("kataTituloCategoria", tituloCategoria);
  }, [base, categoria, tituloCategoria]);

  useEffect(() => {
    localStorage.setItem("kataCategorias", JSON.stringify(categorias));
  }, [categorias]);

  // Enviar datos por BroadcastChannel cada vez que cambian los datos relevantes
  useEffect(() => {
    const dataParaEnviar = {
      competidor: competidorActual?.Nombre || "",
      categoria: categoria || "",
      puntajes: judges.map((judge) => judge || ""),
      puntajeFinal: score || "",
      puntajeMenor: lowScore || "",
      puntajeMayor: highScore || "",
      competidores: competidores,
    };

    kataChannel.postMessage(dataParaEnviar);
  }, [competidores, categoria, judges, score, lowScore, highScore]);

  // Memoizar los handlers
  const handleChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      if (submitted) {
        setSubmitted(false);
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

      const updatedJudges = [...judges];

      updatedJudges[index] = processedValue;
      setJudges(updatedJudges);
    },
    [judges, base, submitted]
  );

  const handleClear = (index: number) => {
    if (submitted) {
      setSubmitted(false);
    }
    const updatedJudges = [...judges];

    updatedJudges[index] = "";
    setJudges(updatedJudges);
  };

  const handleBlur = (index: number) => {
    const currentValue = judges[index];

    // Si el valor termina en punto, agregar "0"
    if (currentValue && currentValue.endsWith(".")) {
      const updatedJudges = [...judges];

      updatedJudges[index] = currentValue + "0";
      setJudges(updatedJudges);
    }
  };

  const calc = () => {
    setSubmitted(true);
    const updatedJudges = judges.map((judge: string) => {
      if (judge.endsWith(".")) {
        return judge + "0";
      }

      return judge;
    });

    setJudges(updatedJudges);

    const sortedJudges = updatedJudges
      .filter((judge: string) => judge !== "")
      .sort((a: string, b: string) => parseFloat(a) - parseFloat(b));

    if (sortedJudges.length !== numJudges) {
      return;
    }

    if (numJudges === 3) {
      const total = sortedJudges.reduce(
        (sum: number, judge: string) => sum + parseFloat(judge),
        0
      );

      setScore((Math.round(total * 10) / 10).toString());
    } else if (numJudges === 5) {
      const total = sortedJudges
        .slice(1, -1)
        .reduce((sum: number, judge: string) => sum + parseFloat(judge), 0);
      const low = sortedJudges[0];
      const high = sortedJudges[sortedJudges.length - 1];

      setLowScore(low);
      setHighScore(high);
      setScore((Math.round(total * 10) / 10).toString());
    }
    setSubmitted(false);
  };

  const clearAll = () => {
    setJudges(Array(numJudges).fill(""));
    setLowScore("");
    setHighScore("");
    setScore("");
    localStorage.removeItem("kataJudges");
    localStorage.removeItem("kataLowScore");
    localStorage.removeItem("kataHighScore");
    localStorage.removeItem("kataScore");
    if (submitted) {
      setSubmitted(false);
    }
  };

  const handleSave = () => {
    if (!categoria) {
      alert("Por favor ingrese una categoría");

      return;
    }

    const competidorSinPuntaje = competidores.find(
      (comp: Competidor) => !comp.PuntajeFinal && !comp.Kiken
    );

    if (!competidorSinPuntaje) {
      alert("No hay competidores pendientes de puntaje");

      return;
    }

    const competidoresActualizados = competidores.map((comp: Competidor) => {
      if (comp.id === competidorSinPuntaje.id) {
        const puntajeFinal = score
          ? Math.round(parseFloat(score) * 10) / 10
          : null;

        return {
          ...comp,
          PuntajeFinal: puntajeFinal,
          PuntajesJueces: [...judges],
        };
      }

      return comp;
    });

    const competidoresOrdenados = competidoresActualizados.sort(
      (a: Competidor, b: Competidor) => {
        if (a.Kiken && !b.Kiken) return 1;
        if (!a.Kiken && b.Kiken) return -1;
        if (a.Kiken && b.Kiken) return 0;
        if (!a.PuntajeFinal) return 1;
        if (!b.PuntajeFinal) return -1;

        return b.PuntajeFinal! - a.PuntajeFinal!;
      }
    );

    setCompetidores(competidoresOrdenados);
    clearAll();

    const todosCompletados = competidoresOrdenados.every(
      (comp: Competidor) => comp.PuntajeFinal !== null || comp.Kiken
    );

    if (todosCompletados) {
      setShowResults(true);
    } else {
      const siguienteCompetidor = competidoresOrdenados.find(
        (comp: Competidor) => !comp.PuntajeFinal && !comp.Kiken
      );

      if (siguienteCompetidor) {
        setTituloCategoria(siguienteCompetidor.TituloCategoria || "CATEGORIA");
      }
    }
  };

  const handleKiken = () => {
    if (!categoria) {
      alert("Por favor ingrese una categoría");

      return;
    }

    const competidorSinPuntaje = competidores.find(
      (comp: Competidor) => !comp.PuntajeFinal && !comp.Kiken
    );

    if (!competidorSinPuntaje) {
      alert("No hay competidores pendientes de puntaje");

      return;
    }

    const competidoresActualizados = competidores.map((comp: Competidor) => {
      if (comp.id === competidorSinPuntaje.id) {
        return {
          ...comp,
          Kiken: true,
          PuntajeFinal: 0.0,
          PuntajesJueces: [null, null, null, null, null],
        };
      }

      return comp;
    });

    const competidoresOrdenados = competidoresActualizados.sort(
      (a: Competidor, b: Competidor) => {
        if (a.Kiken && !b.Kiken) return 1;
        if (!a.Kiken && b.Kiken) return -1;
        if (a.Kiken && b.Kiken) return 0;
        if (!a.PuntajeFinal) return 1;
        if (!b.PuntajeFinal) return -1;

        return b.PuntajeFinal! - a.PuntajeFinal!;
      }
    );

    setCompetidores(competidoresOrdenados);
    clearAll();

    const todosCompletados = competidoresOrdenados.every(
      (comp: Competidor) => comp.PuntajeFinal !== null || comp.Kiken
    );

    if (todosCompletados) {
      setShowResults(true);
    } else {
      const siguienteCompetidor = competidoresOrdenados.find(
        (comp: Competidor) => !comp.PuntajeFinal && !comp.Kiken
      );

      if (siguienteCompetidor) {
        /*  setCategoria(siguienteCompetidor.Categoria); */
        setTituloCategoria(siguienteCompetidor.TituloCategoria || "CATEGORIA");
      }
    }
  };

  const resetAll = () => {
    localStorage.removeItem("kataCompetidores");
    localStorage.removeItem("kataJudges");
    localStorage.removeItem("kataLowScore");
    localStorage.removeItem("kataHighScore");
    localStorage.removeItem("kataScore");
    localStorage.removeItem("kataBase");
    localStorage.removeItem("kataCategoria");
    localStorage.removeItem("kataTituloCategoria");
    localStorage.removeItem("kataCategorias");
    localStorage.removeItem("kataNumJudges");

    setCompetidores([]);
    setJudges(Array(5).fill(""));
    setNumJudges(5);
    setLowScore("");
    setHighScore("");
    setScore("");
    setBase(6);
    setCategoria("");
    setTituloCategoria("");
    setCategorias({ mayores: [], menores: [] });
  };

  const agregarCompetidor = () => {
    setShowAgregarDialog(true);
  };

  const handleAgregarSubmit = (nuevoCompetidor: NuevoCompetidor) => {
    if (
      !nuevoCompetidor.Nombre ||
      !nuevoCompetidor.Edad ||
      !nuevoCompetidor.Categoria
    ) {
      alert("Por favor complete todos los campos");

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

    setCompetidores([...competidores, competidor]);
    setShowAgregarDialog(false);
  };

  const handleOpenKataDisplay = () => {
    const nuevaVentana = window.open(
      "/kata-display",
      "_blank",
      "width=1280,height=800"
    );

    const competidorActual = competidores.find(
      (comp: Competidor) => !comp.PuntajeFinal && !comp.Kiken
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
          new CustomEvent("update-kata", { detail: dataParaEnviar })
        );
        clearInterval(interval);
      }
    }, 100);

    // También enviar a la ventana actual por si acaso
    setTimeout(() => {
      nuevaVentana?.dispatchEvent(
        new CustomEvent("update-kata", { detail: dataParaEnviar })
      );
    }, 500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const data = e.target?.result;

        if (data) {
          const workbook = read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const categoriaCell = worksheet["B1"];

          if (categoriaCell) {
            setCategoria(categoriaCell.v);
            setTituloCategoria(categoriaCell.v);
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
            setCompetidores(competidoresData);
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

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
              <h3 className="font-semibold self-center  text-2xl">
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
                className="bg-green-700 text-white self-center"
                onPress={() =>
                  document?.getElementById("excel-upload")?.click()
                }
              >
                Cargar Excel
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 self-center">
            <MenuComponent handleOpenKataDisplay={handleOpenKataDisplay} />
          </div>
        </div>
        <div className="w-full flex justify-center gap-6">
          <div className="w-2/3 flex gap-2 justify-center">
            <h3 className="font-semibold text-xl">COMPETIDORES:</h3>
            <div className="min-w-[50%] overflow-auto">
              <Table
                fullWidth
                isCompact
                isHeaderSticky
                classNames={{
                  base: "max-h-[250px] overflowY-scroll",
                }}
              >
                <TableHeader className="text-center">
                  <TableColumn>NOMBRE</TableColumn>
                  <TableColumn className="text-center">EDAD</TableColumn>
                  <TableColumn className="text-center">KYU/DAN</TableColumn>
                  <TableColumn className="text-center">
                    PUNTAJE FINAL
                  </TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No hay competidores cargados."}>
                  {competidores.map((competidor) => (
                    <TableRow
                      key={competidor.id}
                      className={`${competidor.PuntajeFinal !== null ? "bg-blue-100" : ""} text-center`}
                    >
                      <TableCell>{competidor.Nombre}</TableCell>
                      <TableCell className="text-center">
                        {competidor.Edad}
                      </TableCell>
                      <TableCell className="text-center">
                        {competidor.Categoria}
                      </TableCell>
                      <TableCell className="text-center">
                        {competidor.Kiken
                          ? "KIKEN"
                          : competidor.PuntajeFinal
                            ? (
                                Math.round(competidor.PuntajeFinal * 10) / 10
                              ).toFixed(1)
                            : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Select
              className="col-span-2 h-7"
              label="PUNTUACION MEDIA:"
              labelPlacement="outside"
              placeholder="Seleccione"
              selectedKeys={[base.toString()]}
              onChange={(e) => {
                setBase(parseInt(e.target.value));
              }}
            >
              <SelectItem key={6}>6</SelectItem>
              <SelectItem key={7}>7</SelectItem>
              <SelectItem key={8}>8</SelectItem>
            </Select>
            <div className="col-span-2 text-xs text-gray-600 text-center">
              {base === 6 && "Rango permitido: 5.0 - 7.0"}
              {base === 7 && "Rango permitido: 6.0 - 8.0"}
              {base === 8 && "Rango permitido: 7.0 - 9.0"}
            </div>
            <Button
              size="md"
              onPress={() => {
                setJudges(Array(3).fill(""));
                setNumJudges(3);
              }}
            >
              3 Jueces
            </Button>
            <Button
              size="md"
              onPress={() => {
                setJudges(Array(5).fill(""));
                setNumJudges(5);
              }}
            >
              5 Jueces
            </Button>
            <Button
              className="bg-green-500 text-white font-semibold hover:bg-green-400 rounded-md col-span-2"
              size="md"
              onPress={agregarCompetidor}
            >
              + Agregar competidor
            </Button>
          </div>
        </div>

        <div className="flex justify-between">
          {judges.map((judge, index) => (
            <Input
              key={index}
              isClearable
              className={`w-auto`}
              endContent={<MdCancel />}
              errorMessage={
                <p className="text-shadow-lg/30 font-semibold">
                  Puntaje requerido
                </p>
              }
              isInvalid={submitted && !judge}
              label={`JUEZ ${index === 0 ? "PRINCIPAL" : index}`}
              labelPlacement="outside"
              maxLength={3}
              placeholder={`JUEZ ${index === 0 ? "PRINCIPAL" : index}`}
              size="lg"
              tabIndex={index + 1}
              type="text"
              value={judge}
              variant="faded"
              onBlur={() => handleBlur(index)}
              onChange={(e) => handleChange(index, e)}
              onClear={() => handleClear(index)}
            />
          ))}
          <div className="flex flex-col gap-4">
            <Button
              className="bg-gray-500 text-white font-semibold hover:bg-gray-400 rounded-md"
              tabIndex={judges.length + 1}
              onPress={calc}
            >
              Calcular
            </Button>
            <Button
              className="bg-red-500 text-white font-semibold hover:bg-red-400"
              tabIndex={judges.length + 2}
              onPress={handleKiken}
            >
              Kiken
            </Button>
          </div>
        </div>

        <div
          className={`flex ${judges.length === 5 ? "justify-between" : "justify-end"} ${judges.length === 5 ? "gap-0" : "gap-96"}`}
        >
          {judges.length !== 3 && (
            <Input
              className="w-auto h-5 rounded-md text-7xl"
              label="Menor puntaje:"
              labelPlacement="outside"
              placeholder="Menor"
              size="lg"
              value={lowScore}
            />
          )}
          {judges.length !== 3 && (
            <Input
              className="w-auto h-5 rounded-md text-7xl"
              label="Mayor puntaje:"
              labelPlacement="outside"
              placeholder="Mayor"
              size="lg"
              value={highScore}
            />
          )}
          <Input
            className="w-auto h-5 rounded-md text-7xl justify-end"
            label="Puntaje Final:"
            labelPlacement="outside"
            placeholder="Total"
            size="lg"
            value={score}
          />
          <div className="grid grid-cols-2 gap-4">
            <Button onPress={clearAll}>Limpiar</Button>
            <Button
              className="bg-blue-500 text-white font-semibold hover:bg-blue-400"
              onPress={handleSave}
            >
              Guardar
            </Button>
            <Button className="col-span-2" onPress={resetAll}>
              Reiniciar Todo
            </Button>
          </div>
        </div>
        <ResultadosFinales
          competidores={competidores}
          judges={judges}
          showDialog={showResults}
          tituloCategoria={tituloCategoria}
          onClose={() => setShowResults(false)}
        />
        <AgregarCompetidor
          showDialog={showAgregarDialog}
          onClose={() => setShowAgregarDialog(false)}
          onSubmit={handleAgregarSubmit}
        />
      </div>
    </DefaultLayout>
  );
}
