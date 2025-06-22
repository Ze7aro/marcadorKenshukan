import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Card,
  CardBody,
  Image,
} from "@heroui/react";

import Logo from "@/assets/images/kenshukan-logo.png";

interface Competidor {
  id: number;
  Nombre: string;
  Edad: number;
  Categoria: string;
  PuntajeFinal: number | null;
  Kiken?: boolean;
}

// Crear el canal de broadcast fuera del componente para que sea único por pestaña
const kataChannel = new BroadcastChannel("kata-channel");

const KataDisplay = () => {
  const [data, setData] = useState<{
    competidor: string;
    categoria: string;
    puntajes: (string | number)[];
    puntajeFinal: string | number;
    puntajeMenor: string | number;
    puntajeMayor: string | number;
    competidores: Competidor[];
  }>({
    competidor: "",
    categoria: "",
    puntajes: Array(5).fill(""),
    puntajeFinal: "",
    puntajeMenor: "",
    puntajeMayor: "",
    competidores: [],
  });

  // Escuchar mensajes del canal y actualizar el estado
  useEffect(() => {
    kataChannel.onmessage = (event) => {
      if (event.data) {
        setData(event.data);
      }
    };

    return () => {
      kataChannel.onmessage = null;
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-500/40 to-blue-800/90 gap-4 p-4">
      <div className="w-[15%] h-[15%]">
        <Image
          alt="Logo"
          className="w-full h-full object-cover rounded-full"
          src={Logo}
        />
      </div>
      {!data?.competidor && !data?.categoria ? (
        <Card className="w-1/2 h-1/2 shadow-lg">
          <CardBody className="flex flex-col items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-semibold mb-4 text-gray-600">
                Esperando datos...
              </h1>
              <p className="text-lg text-gray-500">
                La ventana se actualizará automáticamente cuando haya datos
                disponibles
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="flex w-full items-center justify-center h-screen gap-4">
          <Card className="w-1/2 h-1/2 shadow-lg">
            <CardBody className="flex flex-col justify-around text-2xl">
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-semibold mb-2">
                  Categoria: {data?.categoria || "Sin categoría"}
                </h1>
                <p className="text-2xl font-semibold">
                  {data?.competidor || "Sin competidor"}
                </p>
              </div>
              <div className="grid grid-cols-5 gap-4">
                {data?.puntajes?.map((puntaje, index) => (
                  <div key={index} className="text-center">
                    <p className="text-lg font-semibold">JUEZ {index + 1}</p>
                    <p className="text-3xl font-bold">{puntaje || "-"}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-around w-full">
                <div className="text-center">
                  <p className="text-lg font-semibold">MENOR</p>
                  <p className="text-3xl font-bold">
                    {data?.puntajeMenor || "-"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">MAYOR</p>
                  <p className="text-3xl font-bold">
                    {data?.puntajeMayor || "-"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">FINAL</p>
                  <p className="text-4xl font-bold text-blue-600">
                    {data?.puntajeFinal || "-"}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="w-1/3 min-h-1/2 shadow-lg">
            <CardBody>
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>EDAD</TableColumn>
                    <TableColumn>KYU/DAN</TableColumn>
                    <TableColumn>PUNTAJE FINAL</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {data?.competidores?.map((competidor) => (
                      <TableRow
                        key={competidor.id}
                        className={
                          competidor.PuntajeFinal !== null ? "bg-blue-100" : ""
                        }
                      >
                        <TableCell className="font-medium">
                          {competidor.Nombre}
                        </TableCell>
                        <TableCell>{competidor.Edad}</TableCell>
                        <TableCell>{competidor.Categoria}</TableCell>
                        <TableCell>
                          {competidor.Kiken ? (
                            <p className="text-red-600 font-bold">KIKEN</p>
                          ) : competidor.PuntajeFinal ? (
                            (
                              Math.round(competidor.PuntajeFinal * 10) / 10
                            ).toFixed(1)
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default KataDisplay;
