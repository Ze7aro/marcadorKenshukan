import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Competidor {
  id: number;
  Nombre: string;
  Edad: number;
}

export interface Match {
  pair: (Competidor | string)[];
  winner?: Competidor | string | null;
}

export type Oponente = "aka" | "shiro";
