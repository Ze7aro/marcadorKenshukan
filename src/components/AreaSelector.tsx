import React from "react";
import { Select, SelectItem, Input } from "@heroui/react";

interface AreaSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

const AREA_ITEMS = [
  { key: "1", label: "Area 1" },
  { key: "2", label: "Area 2" },
  { key: "3", label: "Area 3" },
  { key: "4", label: "Area 4" },
  { key: "5", label: "Area 5" },
];

/**
 * Componente reutilizable para seleccionar el área de competencia
 * Puede ser usado tanto en Kata como en Kumite
 */
export const AreaSelector = React.memo<AreaSelectorProps>(
  ({ value, onChange, disabled = false }) => {
    if (disabled) {
      return (
        <Input
          isReadOnly
          className="rounded-md text-center font-bold"
          value={value}
        />
      );
    }

    return (
      <Select
        className="rounded-md"
        placeholder="Seleccionar"
        value={value}
        onChange={onChange}
      >
        {AREA_ITEMS.map((item) => (
          <SelectItem key={item.key}>{item.label}</SelectItem>
        ))}
      </Select>
    );
  },
);

AreaSelector.displayName = "AreaSelector";
