import { Card, CardBody, CardHeader } from "@heroui/react";

export default function PDFViewer({ fileUrl }: { fileUrl: string }) {
  return (
    <Card>
      <CardHeader className="text-lg font-semibold">
        Vista previa del PDF
      </CardHeader>
      <CardBody>
        <iframe
          className="w-full h-[400px] border-none"
          src={fileUrl}
          title="Reglamento WUKF"
        />
      </CardBody>
    </Card>
  );
}
