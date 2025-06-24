import { useState, FC, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Form,
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
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  useEffect(() => {
    setCompetidor((c) => ({ ...c, Categoria: `${ordinal} ${categoriaTipo}` }));
  }, [ordinal, categoriaTipo]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(competidor);
    setCompetidor({ Nombre: "", Edad: 0, Categoria: "1er KYU" });
    setOrdinal("1er");
    setCategoriaTipo("KYU");
  };

  return (
    <Modal isOpen={showDialog} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Agregar Nuevo Competidor</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
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
                label="Categoria:"
                labelPlacement="outside"
                placeholder="Ordinal"
                value={ordinal}
                onChange={(e) => {
                  setOrdinal(e.target.value);
                }}
              >
                <SelectItem key="1er">1er</SelectItem>
                <SelectItem key="2do">2do</SelectItem>
                <SelectItem key="3er">3er</SelectItem>
                <SelectItem key="4to">4to</SelectItem>
                <SelectItem key="5to">5to</SelectItem>
                <SelectItem key="6to">6to</SelectItem>
                <SelectItem key="7mo">7mo</SelectItem>
                <SelectItem key="8vo">8vo</SelectItem>
                <SelectItem key="9no">9no</SelectItem>
                <SelectItem key="10mo">10mo</SelectItem>
              </Select>
              <Select
                isRequired
                placeholder="KYU/DAN"
                value={categoriaTipo}
                onChange={(e) => {
                  setCategoriaTipo(e.target.value);
                }}
              >
                <SelectItem key="KYU">KYU</SelectItem>
                <SelectItem key="DAN">DAN</SelectItem>
              </Select>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            className="bg-red-500 text-white font-semibold hover:bg-red-400"
            onPress={() => {
              onClose();
              setCompetidor({ Nombre: "", Edad: 0, Categoria: "1er KYU" });
            }}
          >
            Cancelar
          </Button>
          <Button
            className="bg-white-500 text-zinc-800 font-semibold hover:bg-gray-400"
            type="submit"
            onPress={() => {
              onSubmit(competidor);
              setCompetidor({ Nombre: "", Edad: 0, Categoria: "1er KYU" });
              setOrdinal("1er");
              setCategoriaTipo("KYU");
            }}
          >
            Agregar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
