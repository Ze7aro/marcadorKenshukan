import { useState, FC } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Form,
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
  const [numero, setNumero] = useState("");
  const [ordinal, setOrdinal] = useState("er");
  const [categoriaTipo, setCategoriaTipo] = useState("KYU");
  const [competidor, setCompetidor] = useState({
    Nombre: "",
    Edad: 0,
    Categoria: "",
  });
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  const actualizarCategoria = (num: string, ord: string, cat: string) => {
    // Validar que el número esté entre 1 y 10 antes de setear
    const numeroValido = Number(num);

    if (numeroValido >= 1 && numeroValido <= 10) {
      setCompetidor({
        ...competidor,
        Categoria: `${numeroValido}${ord} ${cat}`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(competidor);
    setCompetidor({ Nombre: "", Edad: 0, Categoria: "" });
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
            <Input
              isRequired
              endContent={
                <div className="flex items-center gap-4">
                  <select
                    className="outline-none border-0 bg-transparent text-default-400 text-small"
                    id="ordinal"
                    name="ordinal"
                    value={ordinal}
                    onChange={(e) => {
                      setOrdinal(e.target.value);
                      actualizarCategoria(
                        numero,
                        e.target.value,
                        categoriaTipo
                      );
                    }}
                  >
                    <option value="er">er</option>
                    <option value="do">do</option>
                    <option value="to">to</option>
                    <option value="mo">mo</option>
                    <option value="vo">vo</option>
                    <option value="no">no</option>
                  </select>
                  <select
                    className="outline-none border-0 bg-transparent text-default-400 text-small"
                    id="category"
                    name="category"
                    value={categoriaTipo}
                    onChange={(e) => {
                      setCategoriaTipo(e.target.value);
                      actualizarCategoria(numero, ordinal, e.target.value);
                    }}
                  >
                    <option value="KYU">KYU</option>
                    <option value="DAN">DAN</option>
                  </select>
                </div>
              }
              errorMessage="Solo válidos números del 1 al 10"
              label="KYU/DAN:"
              labelPlacement="outside"
              max={10}
              maxLength={2}
              min={1}
              minLength={1}
              placeholder="Ingrese el número"
              type="number"
              value={numero}
              onChange={(e) => {
                const val = e.target.value;

                setNumero(val);
                actualizarCategoria(val, ordinal, categoriaTipo);
              }}
            />
          </Form>
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
            onPress={() => {
              onSubmit(competidor);
              setCompetidor({ Nombre: "", Edad: 0, Categoria: "" });
            }}
          >
            Agregar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
