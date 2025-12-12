import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip,
  Image,
} from "@heroui/react";

import Bracket from "./Bracket";

import Llaves from "@/assets/images/brackets-tree.svg";
import { Match } from "@/types";

export interface ModalLlavesProps {
  bracket: Match[][];
}

export default function ModalLlaves({ bracket }: ModalLlavesProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Tooltip color="success" content="Llaves">
        <Button isIconOnly className="px-1" variant="bordered" onPress={onOpen}>
          <Image alt="Llaves" className="rounded-none -mr-3" src={Llaves} />
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} size="5xl" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Llaves de Competencia
              </ModalHeader>
              <ModalBody>
                <Bracket bracket={bracket} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
