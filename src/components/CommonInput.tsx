import { FC } from "react";
import { Input } from "@heroui/react";

interface CommonInputProps {
  value?: string;
  label: string;
  isReadOnly: boolean;
}

export const CommonInput: FC<CommonInputProps> = ({
  value,
  label,
  isReadOnly,
}) => {
  return (
    <Input
      className="w-auto rounded-md px-2 py-1 text-center text-2xl border-2 border-gray-400"
      classNames={{
        input: "text-center text-2xl font-bold",
        inputWrapper: "h-24",
      }}
      isReadOnly={isReadOnly}
      placeholder={label}
      size="lg"
      type="text"
      value={value}
    />
  );
};
