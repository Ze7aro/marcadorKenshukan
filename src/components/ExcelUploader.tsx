import React from "react";
import { Button } from "@heroui/react";

interface ExcelUploaderProps {
  disabled: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Componente reutilizable para cargar archivos Excel
 * Puede ser usado tanto en Kata como en Kumite
 * Optimizado con React.memo
 */
export const ExcelUploader = React.memo<ExcelUploaderProps>(
  ({ disabled, onUpload }) => {
    const handleButtonClick = () => {
      document?.getElementById("excel-upload")?.click();
    };

    return (
      <>
        <input
          accept=".xlsx,.xls"
          className="hidden"
          id="excel-upload"
          type="file"
          onChange={onUpload}
        />
        <Button
          className="bg-green-700 text-white self-center text-sm sm:text-base"
          isDisabled={disabled}
          onPress={handleButtonClick}
        >
          Cargar Excel
        </Button>
      </>
    );
  },
);

ExcelUploader.displayName = "ExcelUploader";
