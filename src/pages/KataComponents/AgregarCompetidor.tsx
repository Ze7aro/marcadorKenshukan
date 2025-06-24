import { useState, FC, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  NumberInput,
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
  const [ordinal, setOrdinal] = useState("");
  const [categoriaTipo, setCategoriaTipo] = useState("");
  const [competidor, setCompetidor] = useState({
    Nombre: "",
    Edad: 0,
    Categoria: "",
  });

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
            <NumberInput
              isRequired
              label="Edad:"
              labelPlacement="outside"
              maxValue={100}
              minValue={0}
              placeholder="Edad"
              onChange={(e) => {
                setCompetidor({ ...competidor, Edad: Number(e) });
              }}
            />

            <Input
              isReadOnly
              isRequired
              className="w-48"
              endContent={
                <div className="flex items-center">
                  <label className="sr-only" htmlFor="currency">
                    Currency
                  </label>
                  <select
                    aria-label="Select currency"
                    className="outline-none border-0 bg-transparent text-zinc-700 text-small"
                    defaultValue="KYU"
                    id="currency"
                    name="currency"
                    onChange={(e) => {
                      setCategoriaTipo(e.target.value);
                    }}
                  >
                    <option aria-label="KYU" value="KYU">
                      KYU
                    </option>
                    <option aria-label="DAN" value="DAN">
                      DAN
                    </option>
                  </select>
                </div>
              }
              label="Categoria:"
              labelPlacement="outside"
              startContent={
                <div className="flex items-center">
                  <label className="sr-only" htmlFor="currency">
                    Currency
                  </label>
                  <select
                    aria-label="Select currency"
                    className="outline-none border-0 bg-transparent zinc-700 text-small"
                    defaultValue="KYU"
                    id="currency"
                    name="currency"
                    onChange={(e) => {
                      setOrdinal(e.target.value);
                    }}
                  >
                    <option aria-label="1er" value="1er">
                      1er
                    </option>
                    <option aria-label="2do" value="2do">
                      2do
                    </option>
                    <option aria-label="3er" value="3er">
                      3er
                    </option>
                    <option aria-label="4to" value="4to">
                      4to
                    </option>
                    <option aria-label="5to" value="5to">
                      5to
                    </option>
                    <option aria-label="6to" value="6to">
                      6to
                    </option>
                    <option aria-label="7mo" value="7mo">
                      7mo
                    </option>
                    <option aria-label="8vo" value="8vo">
                      8vo
                    </option>
                    <option aria-label="9no" value="9no">
                      9no
                    </option>
                    <option aria-label="10mo" value="10mo">
                      10mo
                    </option>
                  </select>
                </div>
              }
            />
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
