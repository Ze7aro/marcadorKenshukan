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
import MY_LOGO from "@/assets/images/Logo-3.png";
import Kata from "@/assets/images/kata.png";
import Kumite from "@/assets/images/kumite.png";
import KataKanshi from "@/assets/images/kata-kanshi.png";
import KumiKanshi from "@/assets/images/kumi-kanshi.png";
import TeKanshi from "@/assets/images/te-kanshi.png";
import ExcelKata from "@/assets/images/Ejemplo excel kata.jpg";
import ExcelKumite from "@/assets/images/Ejemplo excel kumite.jpg";
import Reglamento from "@/assets/World Union of Karate TRADUCCION  Final (1).pdf";
import PDFReader from "@/components/PDFReader";

const styleButton =
  "w-[45%] sm:w-[35%] md:w-[30%] lg:w-[25%] xl:w-[20%] h-[80%] cursor-pointer font-bold text-center shadow-md hover:shadow-lg italic flex flex-col hover:text-white";

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
          <p className="text-gray-700 dark:text-white">
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
          <ul className="list-disc list-inside space-y-1 text-gray-700  dark:text-white">
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
      title: "Excel para Kata",
      content: (
        <div className="w-full bg-gray-100 rounded-lg flex items-center justify-start text-gray-500">
          <div className="flex flex-col gap-2">
            <p>
              Para cargar los competidores, se debe usar el siguiente formato de
              Excel:
            </p>
            <Image alt="Excel Kata" src={ExcelKata} />
            <p>
              Con el excel en ese formato, la aplicacion puede cargar
              competidores sin problema. Sin embargo si falta algun competidor
              se puede agregar desde la interfaz de la aplicacion.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Excel para Kumite",
      content: (
        <div className="w-full bg-gray-100 rounded-lg flex items-center justify-start text-gray-500">
          <div className="flex flex-col gap-2">
            <p>
              Para cargar los competidores, se debe usar el siguiente formato de
              Excel:
            </p>
            <Image alt="Excel Kumite" src={ExcelKumite} />
            <p>
              Con el excel en ese formato, la aplicacion puede cargar
              competidores sin problema. NO SE PUEDEN AGREGAR COMPETIDORES DESDE
              LA INTERFAZ DE LA APLICACION, asique en caso de faltar se debe
              modificar el excel antes que empiece la competencia.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Reglamento",
      content: <PDFReader fileUrl={Reglamento} />,
    },
    {
      title: "",
      content: (
        <Image
          alt="Logo"
          className="w-full h-[40%] pt-10 object-contain"
          src={MY_LOGO}
        />
      ),
    },
  ];

  return (
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
      <div className="w-full h-full flex items-center relative justify-center">
        <Button
          className={`${styleButton} pl-4 sm:pl-8 md:pl-10 lg:pl-12 xl:pl-14 items-start rounded-l-full bg-gradient-to-r from-zinc-100 to-blue-600 hover:bg-gradient-to-r hover:from-zinc-200 hover:to-blue-700`}
          onPress={handleKataClick}
        >
          <Image
            isZoomed
            alt="Kata"
            className="w-20 sm:w-28 md:w-32 lg:w-36 xl:w-40"
            classNames={{ img: "rounded-lg fill-white stroke-white" }}
            src={Kata}
          />
          <div className="flex gap-1">
            <Image
              alt="Kata-Kanshi"
              className="size-5 sm:size-6 md:size-7"
              src={KataKanshi}
            />
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">
              Kata
            </h2>
          </div>
        </Button>
        <div
          className={`pointer-events-none w-[15%] sm:w-[12%] md:w-[10%] absolute ${isOpen ? "z-0" : "z-[9999]"}`}
        >
          <Image alt="Logo" className="rounded-full" src={Logo} />
        </div>
        <Button
          className={`${styleButton} pr-4 sm:pr-8 md:pr-10 lg:pr-12 xl:pr-14 items-end rounded-r-full bg-gradient-to-r from-blue-600 to-zinc-300 hover:bg-gradient-to-r hover:from-blue-700 hover:to-zinc-200`}
          onPress={handleKumiteClick}
        >
          <Image
            isZoomed
            alt="Kumite"
            className="w-20 sm:w-28 md:w-32 lg:w-36 xl:w-40"
            classNames={{ img: "rounded-lg fill-white stroke-white" }}
            src={Kumite}
          />
          <div className="flex">
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mr-1">
              Kumite
            </h2>
            <Image
              alt="Kumi-Kanshi"
              className="size-5 sm:size-6 md:size-7"
              src={KumiKanshi}
            />
            <Image
              alt="Te-Kanshi"
              className="size-5 sm:size-6 md:size-7"
              src={TeKanshi}
            />
          </div>
        </Button>
      </div>

      <Modal
        className="w-[95%] max-w-[500px] min-h-[400px] max-h-[90vh] mx-auto"
        isOpen={isOpen}
        scrollBehavior="inside"
        size="2xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Image
                    alt="Logo"
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
                    src={Logo}
                  />
                  <span className="text-sm sm:text-base font-medium">
                    Marcador Kata Kumite - Kenshukan
                  </span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="min-h-[200px] sm:min-h-[350px]">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-600 mb-3 sm:mb-4">
                    {carouselContent[activePage - 1]?.title}
                  </h3>
                  <div className="text-sm sm:text-base">
                    {carouselContent[activePage - 1]?.content}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex gap-2 justify-between flex-wrap">
                <div className="flex gap-2" />
                <div className="flex flex-col gap-2 self-center">
                  <ul className="flex gap-1 sm:gap-2 items-center">
                    {range.map((page) => {
                      if (page === PaginationItemType.NEXT) {
                        return (
                          <li
                            key={page}
                            aria-label="next page"
                            className="w-3 h-3 sm:w-4 sm:h-4"
                          >
                            <button
                              className="w-full h-full bg-default-200 rounded-full flex items-center justify-center"
                              onClick={handleNext}
                            >
                              <ChevronIcon className="rotate-180 w-2 h-2 sm:w-3 sm:h-3" />
                            </button>
                          </li>
                        );
                      }

                      if (page === PaginationItemType.PREV) {
                        return (
                          <li
                            key={page}
                            aria-label="previous page"
                            className="w-3 h-3 sm:w-4 sm:h-4"
                          >
                            <button
                              className="w-full h-full bg-default-200 rounded-full flex items-center justify-center"
                              onClick={handlePrevious}
                            >
                              <ChevronIcon className="w-2 h-2 sm:w-3 sm:h-3" />
                            </button>
                          </li>
                        );
                      }

                      if (page === PaginationItemType.DOTS) {
                        return (
                          <li
                            key={page}
                            className="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center text-xs sm:text-sm"
                          >
                            ...
                          </li>
                        );
                      }

                      return (
                        <li
                          key={page}
                          aria-label={`page ${page}`}
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        >
                          <button
                            className={`w-full h-full bg-default-300 rounded-full ${
                              activePage === page && "bg-primary"
                            }`}
                            onClick={() => setPage(page)}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <Button
                  className="text-xs sm:text-sm"
                  color="primary"
                  size="sm"
                  onPress={onClose}
                >
                  Entendido
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
