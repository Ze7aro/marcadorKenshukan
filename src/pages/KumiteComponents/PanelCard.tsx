import React, { memo } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Image,
} from "@heroui/react";
import { RiCloseCircleLine } from "react-icons/ri";
import { BsCircleFill, BsCircle } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

interface PanelCardProps {
  cinto: "aka" | "shiro";
  imagen: string;
  nombre: string;
  ippon: number;
  wazari: number;
  kiken: boolean;
  kinshi: boolean;
  kinshiChui: boolean;
  kinshiHansoku: boolean;
  kinshiNi: boolean;
  shikaku: boolean;
  atenai: boolean;
  atenaiChui: boolean;
  atenaiHansoku: boolean;
  disabled: boolean;
  onIppon: () => void;
  onWazari: () => void;
  onKiken: () => void;
  onKinshi: () => void;
  onKinshiNi: () => void;
  onKinshiChui: () => void;
  onKinshiHansoku: () => void;
  onShikaku: () => void;
  onAtenai: () => void;
  onAtenaiChui: () => void;
  onAtenaiHansoku: () => void;
  onHantei: () => void;
}

const ScoreButton = memo(
  ({
    isDisabled,
    label,
    onClick,
    ariaLabel,
  }: {
    label: string;
    onClick: () => void;
    isDisabled: boolean;
    ariaLabel?: string;
  }) => (
    <Button
      aria-label={ariaLabel || label}
      as={motion.button}
      className="text-xs sm:text-sm"
      isDisabled={isDisabled}
      size="sm"
      whileTap={{ scale: 0.95 }}
      onPress={onClick}
    >
      {label}
    </Button>
  ),
);

ScoreButton.displayName = "ScoreButton";

const PenaltyButton = memo(
  ({
    isActive,
    isDisabled,
    label,
    onClick,
    ariaLabel,
  }: {
    label: string;
    onClick: () => void;
    isDisabled: boolean;
    isActive: boolean;
    ariaLabel?: string;
  }) => (
    <Button
      aria-label={ariaLabel || label}
      as={motion.button}
      className="text-xs sm:text-sm"
      isDisabled={isDisabled}
      size="sm"
      whileTap={{ scale: 0.95 }}
      onPress={onClick}
    >
      {isActive ? <RiCloseCircleLine /> : label}
    </Button>
  ),
);

PenaltyButton.displayName = "PenaltyButton";

const ScoreIndicator = memo(
  ({ count, Icon }: { count: number; Icon: React.ElementType }) => (
    <div className="flex gap-1 sm:gap-2 w-full justify-center">
      <AnimatePresence>
        {[...Array(count)].map((_, index) => (
          <motion.div
            key={index}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            initial={{ scale: 0 }}
          >
            <Icon className="text-lg sm:text-xl lg:text-2xl" color="white" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  ),
);

ScoreIndicator.displayName = "ScoreIndicator";

const PenaltySection = memo(
  ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center">
      <div className="font-bold whitespace-nowrap text-white text-xs sm:text-sm">
        {label}:
      </div>
      <div className="flex gap-1 flex-wrap">{children}</div>
    </div>
  ),
);

PenaltySection.displayName = "PenaltySection";

export const PanelCard = (props: PanelCardProps) => {
  return (
    <Card className="w-full h-full bg-transparent border-2 border-blue-800 rounded-lg overflow-hidden">
      <CardHeader>
        <div className="w-full bg-black p-2 gap-2 flex flex-col sm:flex-row justify-between items-center rounded-md">
          <Image
            alt="Belt"
            className="w-32 sm:w-40 h-8 sm:h-10"
            src={props.imagen}
          />
          <Input
            isReadOnly
            className="w-full bg-transparent text-black text-lg sm:text-xl font-bold rounded-md"
            placeholder="Nombre del competidor"
            type="text"
            value={props.nombre}
          />
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-2 sm:gap-3">
          <div>
            <div className="flex justify-center gap-2 sm:gap-4 mb-2 min-h-8 sm:min-h-12">
              <ScoreIndicator Icon={BsCircle} count={props.wazari} />
              <ScoreIndicator Icon={BsCircleFill} count={props.ippon} />
            </div>
            <div className="flex justify-center gap-1 sm:gap-2 mb-2 sm:mb-3">
              <ScoreButton
                ariaLabel={`Agregar Wazari a ${props.nombre}`}
                isDisabled={props.disabled}
                label="Wazari"
                onClick={props.onWazari}
              />
              <ScoreButton
                ariaLabel={`Agregar Ippon a ${props.nombre}`}
                isDisabled={props.disabled}
                label="Ippon"
                onClick={props.onIppon}
              />
              <ScoreButton
                ariaLabel={`Otorgar victoria por Hantei a ${props.nombre}`}
                isDisabled={props.disabled}
                label="Hantei"
                onClick={props.onHantei}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:gap-2 items-stretch">
            <PenaltySection label="Kinshi">
              <PenaltyButton
                ariaLabel={`Marcar Kinshi para ${props.nombre}`}
                isActive={props.kinshi}
                isDisabled={props.disabled || !!props.kinshi}
                label="Kinshi"
                onClick={props.onKinshi}
              />

              <PenaltyButton
                ariaLabel={`Marcar Kinshi Ni para ${props.nombre}`}
                isActive={props.kinshiNi}
                isDisabled={props.disabled || !!props.kinshiNi || !props.kinshi}
                label="Ni"
                onClick={props.onKinshiNi}
              />

              <PenaltyButton
                ariaLabel={`Marcar Kinshi Chui para ${props.nombre}`}
                isActive={props.kinshiChui}
                isDisabled={
                  props.disabled || !!props.kinshiChui || !props.kinshiNi
                }
                label="Chui"
                onClick={props.onKinshiChui}
              />

              <PenaltyButton
                ariaLabel={`Marcar Kinshi Hansoku para ${props.nombre}`}
                isActive={props.kinshiHansoku}
                isDisabled={
                  props.disabled || !!props.kinshiHansoku || !props.kinshiChui
                }
                label="Hansoku"
                onClick={props.onKinshiHansoku}
              />
            </PenaltySection>
            <PenaltySection label="Atenai">
              <PenaltyButton
                isActive={props.atenai}
                isDisabled={props.disabled || !!props.atenai}
                label="Atenai"
                onClick={props.onAtenai}
              />
              <PenaltyButton
                isActive={props.atenaiChui}
                isDisabled={props.disabled || !!props.atenaiChui}
                label="Chui"
                onClick={props.onAtenaiChui}
              />
              <PenaltyButton
                isActive={props.atenaiHansoku}
                isDisabled={props.disabled || !!props.atenaiHansoku}
                label="Hansoku"
                onClick={props.onAtenaiHansoku}
              />
            </PenaltySection>
            <PenaltySection label="Descalificacion">
              <PenaltyButton
                isActive={props.shikaku}
                isDisabled={props.disabled || !!props.shikaku}
                label="Shikaku"
                onClick={props.onShikaku}
              />
            </PenaltySection>
            <PenaltySection label="Abandono / Renuncia">
              <PenaltyButton
                isActive={props.kiken}
                isDisabled={props.disabled || !!props.kiken}
                label="Kiken"
                onClick={props.onKiken}
              />
            </PenaltySection>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
