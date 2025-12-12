import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useEffect, useState } from "react";

import AkaBelt from "@/assets/images/akaStill.gif";
import ShiroBelt from "@/assets/images/shiroStill.gif";

interface GanadorProps {
  ganador: "shiro" | "aka" | null;
  nombreGanador?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Ganador = ({
  ganador,
  isOpen,
  onClose,
  nombreGanador,
}: GanadorProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true);
    } else {
      setShowAnimation(false);
    }
  }, [isOpen]);

  const getGanadorInfo = () => {
    if (ganador === "aka") {
      return {
        nombre: "(AKA)",
        color: "text-red-600",
        bgColor: "bg-red-100",
        borderColor: "border-red-500",
        image: AkaBelt,
      };
    } else if (ganador === "shiro") {
      return {
        nombre: "(SHIRO)",
        color: "text-gray-700",
        bgColor: "bg-gray-100",
        borderColor: "border-gray-500",
        image: ShiroBelt,
      };
    }

    return null;
  };

  const ganadorInfo = getGanadorInfo();

  if (!ganador || !ganadorInfo) return null;

  return (
    <Modal
      classNames={{
        base: "bg-white dark:bg-gray-900",
        header: "border-b border-gray-200 dark:border-gray-700",
        body: "py-6",
        footer: "border-t border-gray-200 dark:border-gray-700",
      }}
      isOpen={isOpen}
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-center">Fin del combate</h2>
        </ModalHeader>
        <ModalBody>
          <div
            className={`flex flex-col items-center justify-center p-8 ${ganadorInfo.bgColor} rounded-lg border-4 ${ganadorInfo.borderColor} transition-all duration-500 ${showAnimation ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
          >
            <h1 className={`text-4xl font-bold mb-4 ${ganadorInfo.color}`}>
              ¡GANADOR!
            </h1>
            <h1 className={`text-4xl font-semibold mb-4 ${ganadorInfo.color}`}>
              {nombreGanador} {ganadorInfo.nombre}
            </h1>
            <div className="text-center">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                ¡Felicitaciones al ganador!
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="w-full" color="primary" onPress={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
