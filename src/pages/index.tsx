import { useNavigate } from "react-router-dom";
import {
  Image,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  usePagination,
  PaginationItemType,
} from "@heroui/react";
import { RiInformationLine } from "react-icons/ri";

import Logo from "@/assets/images/kenshukan-logo.png";
import Kata from "@/assets/images/kata.png";
import Kumite from "@/assets/images/kumite.png";
import KataKanshi from "@/assets/images/kata-kanshi.png";
import KumiKanshi from "@/assets/images/kumi-kanshi.png";
import TeKanshi from "@/assets/images/te-kanshi.png";
import DefaultLayout from "@/layouts/default";

const styleButton =
  "w-[20%] h-[80%] cursor-pointer font-bold text-center shadow-md hover:shadow-lg italic flex flex-col hover:text-white";

export const ChevronIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M15.5 19l-7-7 7-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default function IndexPage() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { activePage, range, setPage, onNext, onPrevious } = usePagination({
    total: 6,
    showControls: true,
    siblings: 10,
    boundaries: 10,
  });

  const handleKataClick = async () => {
    navigate("/kata");
  };

  const handleKumiteClick = async () => {
    navigate("/kumite");
  };

  // Funciones para carrusel infinito
  const handleNext = () => {
    if (activePage === 6) {
      setPage(1);
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (activePage === 1) {
      setPage(6);
    } else {
      onPrevious();
    }
  };

  // Contenido del carrusel
  const carouselContent = [
    {
      title: "¿Qué es esta aplicación?",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Esta es una aplicación de marcador para competencias de Karate Do,
            específicamente diseñada para eventos de Kata y Kumite. Permite
            gestionar competidores, crear llaves de competencia y llevar el
            control de puntuaciones en tiempo real.
          </p>
        </div>
      ),
    },
    {
      title: "Funcionalidades principales",
      content: (
        <div className="space-y-4">
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>
              <strong>Kata:</strong> Gestión de competidores, creación de llaves
              y evaluación de katas
            </li>
            <li>
              <strong>Kumite:</strong> Control de combates con temporizador y
              sistema de puntuación
            </li>
            <li>
              <strong>Llaves:</strong> Generación automática de brackets de
              competencia
            </li>
            <li>
              <strong>Resultados:</strong> Visualización de resultados finales
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Desarrollado por",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Kenshukan Dojo - Sistema de marcador para competencias de Karate Do
          </p>
        </div>
      ),
    },
    {
      title: "Información adicional 1",
      content: (
        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
          Div en blanco 1
        </div>
      ),
    },
    {
      title: "Información adicional 2",
      content: (
        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
          Div en blanco 2
        </div>
      ),
    },
    {
      title: "Información adicional 3",
      content: (
        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
          Div en blanco 3
        </div>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="w-screen h-screen flex flex-col justify-between bg-gradient-to-b from-blue-500/30 to-blue-800/90 relative">
        <div className="absolute top-4 right-4 z-10">
          <Button
            isIconOnly
            className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            color="primary"
            variant="bordered"
            onPress={onOpen}
          >
            <RiInformationLine size={24} />
          </Button>
        </div>

        <div
          className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
            isOpen ? "z-0" : "z-[9999]"
          }`}
        >
          <Image alt="Logo" className="w-60 rounded-full" src={Logo} />
        </div>
        <div className="w-full h-full flex items-center relative justify-center">
          <Button
            className={`${styleButton} pl-20 items-start rounded-l-full bg-gradient-to-r from-zinc-100 to-blue-600 hover:bg-gradient-to-r hover:from-zinc-200 hover:to-blue-700`}
            onPress={handleKataClick}
          >
            <Image
              isZoomed
              alt="Kata"
              className="size-40"
              classNames={{ img: "rounded-lg fill-white stroke-white" }}
              src={Kata}
            />
            <div className="flex gap-1">
              <Image alt="Kata-Kanshi" className="size-7" src={KataKanshi} />
              <h2 className="text-xl font-bold">Kata</h2>
            </div>
          </Button>
          <Button
            className={`${styleButton} pr-20 items-end rounded-r-full bg-gradient-to-r from-blue-600 to-zinc-300 hover:bg-gradient-to-r hover:from-blue-700 hover:to-zinc-200`}
            onPress={handleKumiteClick}
          >
            <Image
              isZoomed
              alt="Kumite"
              className="size-40"
              classNames={{ img: "rounded-lg fill-white stroke-white" }}
              src={Kumite}
            />
            <div className="flex">
              <h2 className="text-xl font-bold mr-1">Kumite</h2>
              <Image alt="Kumi-Kanshi" className="size-7" src={KumiKanshi} />
              <Image alt="Te-Kanshi" className="size-7" src={TeKanshi} />
            </div>
          </Button>
        </div>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Image
                      alt="Logo"
                      className="w-8 h-8 rounded-full"
                      src={Logo}
                    />
                    <span>Marcador Kata Kumite - Kenshukan</span>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <div className="min-h-[300px]">
                    <h3 className="text-lg font-semibold text-blue-600 mb-4">
                      {carouselContent[activePage - 1]?.title}
                    </h3>
                    {carouselContent[activePage - 1]?.content}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <div className="flex flex-col gap-2 self-center pr-36">
                    <ul className="flex gap-2 items-center">
                      {range.map((page) => {
                        if (page === PaginationItemType.NEXT) {
                          return (
                            <li
                              key={page}
                              aria-label="next page"
                              className="w-4 h-4"
                            >
                              <button
                                className="w-full h-full bg-default-200 rounded-full"
                                onClick={handleNext}
                              >
                                <ChevronIcon className="rotate-180" />
                              </button>
                            </li>
                          );
                        }

                        if (page === PaginationItemType.PREV) {
                          return (
                            <li
                              key={page}
                              aria-label="previous page"
                              className="w-4 h-4"
                            >
                              <button
                                className="w-full h-full bg-default-200 rounded-full"
                                onClick={handlePrevious}
                              >
                                <ChevronIcon />
                              </button>
                            </li>
                          );
                        }

                        if (page === PaginationItemType.DOTS) {
                          return (
                            <li key={page} className="w-4 h-4">
                              ...
                            </li>
                          );
                        }

                        return (
                          <li
                            key={page}
                            aria-label={`page ${page}`}
                            className="w-4 h-4"
                          >
                            <button
                              className={`w-full h-full bg-default-300 rounded-full ${
                                activePage === page && "bg-secondary"
                              }`}
                              onClick={() => setPage(page)}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <Button color="primary" onPress={onClose}>
                    Entendido
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </DefaultLayout>
  );
}
