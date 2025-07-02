import { useRef } from "react";
import { Button } from "@heroui/react";

export default function PDFViewer({ fileUrl }: { fileUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = () => {
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen();
    }
  };

  return (
    <div>
      <Button
        className="bg-gray-700 text-white rounded-md mb-2"
        size="sm"
        onPress={handleFullscreen}
      >
        Ver en pantalla completa
      </Button>

      <div ref={containerRef} className="w-full h-[450px] rounded-lg">
        <iframe
          className="w-full h-full border-none rounded-lg"
          src={fileUrl}
          title="Reglamento WUKF"
        />
      </div>
    </div>
  );
}
