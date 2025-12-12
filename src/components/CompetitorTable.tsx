import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  // ... imports
  Skeleton,
} from "@heroui/react";

interface Competidor {
  id: number;
  Nombre: string;
  Edad: number;
  Categoria: string;
  PuntajeFinal: number | null;
  Kiken: boolean;
}

interface CompetitorTableProps {
  competidores: Competidor[];
  isLoading?: boolean;
}

/**
 * Componente para mostrar la tabla de competidores
 * Optimizado con React.memo para evitar re-renders cuando los competidores no cambian
 */
export const CompetitorTable = React.memo<CompetitorTableProps>(
  ({ competidores, isLoading = false }) => {
    return (
      <div className="w-full sm:min-w-[50%] overflow-auto">
        <Table
          fullWidth
          isCompact
          isHeaderSticky
          classNames={{
            base: "min-h-[200px] sm:min-h-[250px] max-h-[200px] sm:max-h-[250px] overflowY-scroll text-xs sm:text-sm",
          }}
        >
          <TableHeader className="text-center">
            <TableColumn>NOMBRE</TableColumn>
            <TableColumn className="text-center">EDAD</TableColumn>
            <TableColumn className="text-center">KYU/DAN</TableColumn>
            <TableColumn className="text-center">PUNTAJE FINAL</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay competidores cargados.">
            {isLoading
              ? Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  <TableCell>
                    <Skeleton className="rounded-lg">
                      <div className="h-6 w-3/4 rounded-lg bg-default-200"></div>
                    </Skeleton>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="rounded-lg">
                      <div className="h-6 w-1/2 rounded-lg bg-default-200"></div>
                    </Skeleton>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="rounded-lg">
                      <div className="h-6 w-1/2 rounded-lg bg-default-200"></div>
                    </Skeleton>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="rounded-lg">
                      <div className="h-6 w-1/2 rounded-lg bg-default-200"></div>
                    </Skeleton>
                  </TableCell>
                </TableRow>
              ))
              : competidores.map((competidor) => (
                <TableRow
                  key={competidor.id}
                  className={`${competidor.PuntajeFinal !== null ? "bg-blue-100" : ""} text-center`}
                >
                  <TableCell>{competidor.Nombre}</TableCell>
                  <TableCell className="text-center">
                    {competidor.Edad}
                  </TableCell>
                  <TableCell className="text-center">
                    {competidor.Categoria}
                  </TableCell>
                  <TableCell className="text-center">
                    {competidor.Kiken
                      ? "KIKEN"
                      : competidor.PuntajeFinal
                        ? (
                          Math.round(competidor.PuntajeFinal * 10) / 10
                        ).toFixed(1)
                        : "-"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  },
);

CompetitorTable.displayName = "CompetitorTable";

export type { Competidor };
