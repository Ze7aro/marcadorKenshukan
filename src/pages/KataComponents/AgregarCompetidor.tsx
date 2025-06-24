import { useState, FC, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";

interface ModalProps {
  showDialog: boolean;
  onClose: () => void;
  onSubmit: (competidor: {
    Nombre: string;
    Edad: number;
    Categoria: string;
  }) => void;
}

export const AgregarCompetidor: FC<ModalProps> = ({
  showDialog,
  onClose,
  onSubmit,
}) => {
  const [ordinal, setOrdinal] = useState("1er");
  const [categoriaTipo, setCategoriaTipo] = useState("KYU");
  const [competidor, setCompetidor] = useState({
    Nombre: "",
    Edad: 0,
    Categoria: "1er KYU",
  });
  const oridinalArray = [
    { key: "1er", label: "1er" },
    { key: "2do", label: "2do" },
    { key: "3er", label: "3er" },
    { key: "4to", label: "4to" },
    { key: "5to", label: "5to" },
    { key: "6to", label: "6to" },
    { key: "7mo", label: "7mo" },
    { key: "8vo", label: "8vo" },
    { key: "9no", label: "9no" },
    { key: "10mo", label: "10mo" },
  ];
  const categoriaArray = [
    { key: "KYU", label: "KYU" },
    { key: "DAN", label: "DAN" },
  ];
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  useEffect(() => {
    setCompetidor((c) => ({ ...c, Categoria: `${ordinal} ${categoriaTipo}` }));
  }, [ordinal, categoriaTipo]);

  const handleSubmit = () => {
    if (
      competidor.Nombre === "" ||
      competidor.Edad === 0 ||
      competidor.Categoria === ""
    ) {
      return;
    }
    onSubmit(competidor);
    setCompetidor({ Nombre: "", Edad: 0, Categoria: "" });
    setOrdinal("");
    setCategoriaTipo("");
  };

  return (
    <Modal className="absolute z-[999]" isOpen={showDialog} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Agregar Nuevo Competidor</ModalHeader>
        <ModalBody>
          <Input
            isRequired
            errorMessage="Ingresa un nombre valido"
            label="Nombre:"
            labelPlacement="outside"
            name="nombre"
            placeholder="Nombre del competidor"
            validate={(value) => {
              if (!regex.test(value)) {
                return "Ingresa un nombre valido";
              }
            }}
            value={competidor.Nombre}
            onChange={(e) =>
              setCompetidor({ ...competidor, Nombre: e.target.value })
            }
          />
          <div className="w-full flex gap-2">
            <Input
              isRequired
              errorMessage="Solo numeros permitidos"
              label="Edad:"
              labelPlacement="outside"
              maxLength={2}
              min={0}
              name="edad"
              placeholder="Edad del competidor"
              type="number"
              value={competidor.Edad.toString()}
              onChange={(e) =>
                setCompetidor({ ...competidor, Edad: Number(e.target.value) })
              }
            />
            <Select
              isRequired
              aria-label="Ordinal"
              label="Categoria:"
              labelPlacement="outside"
              placeholder="Ordinal"
              onChange={(e) => {
                setOrdinal(e.target.value);
              }}
            >
              {oridinalArray.map((ordinal) => (
                <SelectItem key={ordinal.key}>{ordinal.label}</SelectItem>
              ))}
            </Select>
            <Select
              isRequired
              aria-label="Categoria"
              placeholder="KYU/DAN"
              onChange={(e) => {
                setCategoriaTipo(e.target.value);
              }}
            >
              {categoriaArray.map((categoria) => (
                <SelectItem key={categoria.key}>{categoria.label}</SelectItem>
              ))}
            </Select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="bg-red-500 text-white font-semibold hover:bg-red-400"
            onPress={() => {
              onClose();
              setCompetidor({ Nombre: "", Edad: 0, Categoria: "" });
            }}
          >
            Cancelar
          </Button>
          <Button
            className="bg-white-500 text-zinc-800 font-semibold hover:bg-gray-400"
            type="submit"
            onPress={() => handleSubmit()}
          >
            Agregar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
