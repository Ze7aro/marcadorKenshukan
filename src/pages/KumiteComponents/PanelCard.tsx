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
  }: {
    label: string;
    onClick: () => void;
    isDisabled: boolean;
  }) => (
    <Button isDisabled={isDisabled} size="sm" onPress={onClick}>
      {label}
    </Button>
  )
);

ScoreButton.displayName = "ScoreButton";

const PenaltyButton = memo(
  ({
    isActive,
    isDisabled,
    label,
    onClick,
  }: {
    label: string;
    onClick: () => void;
    isDisabled: boolean;
    isActive: boolean;
  }) => (
    <Button isDisabled={isDisabled} size="sm" onPress={onClick}>
      {isActive ? <RiCloseCircleLine /> : label}
    </Button>
  )
);

PenaltyButton.displayName = "PenaltyButton";

const ScoreIndicator = memo(
  ({ count, Icon }: { count: number; Icon: React.ElementType }) => (
    <div className="flex gap-2 w-100px justify-center">
      {[...Array(count)].map((_, index) => (
        <Icon key={index} color="white" fontSize="22px" />
      ))}
    </div>
  )
);

ScoreIndicator.displayName = "ScoreIndicator";

const PenaltySection = memo(
  ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-row gap-2 items-center">
      <div className="font-bold whitespace-nowrap text-white text-sm">
        {label}:
      </div>
      <div className="flex gap-1">{children}</div>
    </div>
  )
);

PenaltySection.displayName = "PenaltySection";

export const PanelCard = (props: PanelCardProps) => {
  return (
    <Card className="w-full h-full bg-transparent border-2 border-blue-800 rounded-lg overflow-hidden">
      <CardHeader>
        <div className="w-full bg-black p-2 gap-2 flex justify-between items-center rounded-md">
          <Image alt="Belt" className="w-40 h-10" src={props.imagen} />
          <Input
            isReadOnly
            className="w-full bg-transparent text-black text-xl font-boldrounded-md"
            placeholder="Nombre del competidor"
            type="text"
            value={props.nombre}
          />
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex justify-center gap-4 mb-2 min-h-12">
              <ScoreIndicator count={props.wazari} Icon={BsCircle} />
              <ScoreIndicator count={props.ippon} Icon={BsCircleFill} />
            </div>
            <div className="flex justify-center gap-2 mb-3">
              <ScoreButton
                isDisabled={props.disabled}
                label="Wazari"
                onClick={props.onWazari}
              />
              <ScoreButton
                isDisabled={props.disabled}
                label="Ippon"
                onClick={props.onIppon}
              />
              <ScoreButton
                isDisabled={props.disabled}
                label="Hantei"
                onClick={props.onHantei}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 items-stretch">
            <PenaltySection label="Kinshi">
              <PenaltyButton
                isActive={props.kinshi}
                isDisabled={props.disabled || !!props.kinshi}
                label="Kinshi"
                onClick={props.onKinshi}
              />
              <PenaltyButton
                isActive={props.kinshiNi}
                isDisabled={props.disabled || !!props.kinshiNi || !props.kinshi}
                label="Ni"
                onClick={props.onKinshiNi}
              />
              <PenaltyButton
                isActive={props.kinshiChui}
                isDisabled={
                  props.disabled || !!props.kinshiChui || !props.kinshiNi
                }
                label="Chui"
                onClick={props.onKinshiChui}
              />
              <PenaltyButton
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
