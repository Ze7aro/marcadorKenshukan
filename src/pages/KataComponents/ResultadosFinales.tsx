import { FC } from "react";
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { MdCircle } from "react-icons/md";

interface ResultadosFinalesProps {
  showDialog: boolean;
  onClose: () => void;
  competidores: any[];
  tituloCategoria: string;
  judges: any[];
}

export const ResultadosFinales: FC<ResultadosFinalesProps> = ({
  showDialog,
  onClose,
  competidores,
  tituloCategoria,
  judges,
}) => {
  // Función para obtener los puntajes válidos (sin el mayor y menor)
  const getPuntajesValidos = (puntajes: (string | null)[]) => {
    if (!Array.isArray(puntajes)) return "No disponible";

    // Ordenar todos los puntajes
    const puntajesOrdenados = [...puntajes]
      .map((p) => parseFloat(p || "0"))
      .sort((a, b) => a - b);

    // Obtener solo los 3 puntajes del medio (eliminando el mayor y menor de los 5)
    let puntajesValidos;

    if (judges.length === 5) {
      puntajesValidos = puntajesOrdenados.slice(1, -1);
    } else {
      puntajesValidos = puntajesOrdenados;
    }

    return (
      <div className="flex gap-2">
        <p className="text-blue-600">{puntajesValidos[0]}</p>
        <p>{" - "}</p>
        <p>{puntajesValidos[1]}</p>
        <p>{" - "}</p>
        <p className="text-green-600">{puntajesValidos[2]}</p>
      </div>
    );
  };

  // Ordenar competidores: primero por Kiken (no Kiken primero) y luego por puntaje
  const competidoresOrdenados = [...competidores].sort((a, b) => {
    if (a.Kiken && !b.Kiken) return 1;
    if (!a.Kiken && b.Kiken) return -1;
    if (a.Kiken && b.Kiken) return 0;
    return (b.PuntajeFinal || 0) - (a.PuntajeFinal || 0);
  });

  return (
    <Modal isOpen={showDialog} size="2xl" onClose={onClose}>
      <ModalContent>
        <ModalHeader>Resultados Finales - {tituloCategoria}</ModalHeader>
        <ModalBody>
          <div className="flex flex-col  gap-4">
            {competidoresOrdenados.map((competidor, index) => {
              const medalla =
                !competidor.Kiken &&
                (index === 0
                  ? "🥇"
                  : index === 1
                    ? "🥈"
                    : index === 2
                      ? "🥉"
                      : "👏");

              return (
                <div
                  key={competidor.id}
                  className="w-full flex justify-between gap-4 border-b-2 border-gray-200 pb-4"
                >
                  <div className="w-full flex justify-between gap-4">
                    <div className="flex font-semibold justify-between gap-4">
                      <p>{medalla || "❌"}</p>
                      <div className="flex gap-4">
                        <p>{competidor.Nombre}</p>
                        <p>{competidor.Categoria}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 font-bold">
                      {competidor.Kiken ? (
                        <p className="text-red-600">KIKEN</p>
                      ) : (
                        <div className="flex gap-16">
                          <p>
                            {typeof competidor.PuntajeFinal === "number"
                              ? competidor.PuntajeFinal.toFixed(1)
                              : "-"}
                          </p>
                          <p>
                            Puntajes:{" "}
                            {getPuntajesValidos(competidor.PuntajesJueces)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="w-full flex justify-between">
            <div className="flex gap-4">
              <div className="flex gap-1 self-center">
                <MdCircle className="self-center" color="blue" />{" "}
                <p>Puntaje Menor</p>
              </div>
              <div className="flex gap-1 self-center">
                <MdCircle className="self-center" color="green" />{" "}
                <p>Puntaje Mayor</p>
              </div>
              <div className="flex gap-1 self-center">
                <MdCircle className="self-center" color="red" />{" "}
                <p>Eliminado</p>
              </div>
            </div>
            <Button
              className="font-semibold text-zinc-700"
              variant="light"
              onPress={onClose}
            >
              Cerrar
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ResultadosFinales;
