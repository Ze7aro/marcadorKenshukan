import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Match } from "@/types/index";

// Helper to get name
const getName = (competitor: any) => {
  if (!competitor) return "BYE"; // Or empty
  if (typeof competitor === "string") return competitor;

  return competitor.Nombre || "Desconocido";
};

// --- EXCELS ---
export const exportResultsToExcel = (bracket: Match[][]) => {
  // Flatten matches to a table
  const rows: any[] = [];

  bracket.forEach((round, roundIndex) => {
    round.forEach((match, matchIndex) => {
      const aka = match.pair[0];
      const shiro = match.pair[1];
      const winner = match.winner;

      rows.push({
        Ronda: roundIndex + 1,
        Combate: matchIndex + 1,
        Aka: getName(aka),
        Shiro: getName(shiro),
        Ganador: winner ? getName(winner) : "Pendiente",
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");

  XLSX.writeFile(workbook, "Resultados_Kumite.xlsx");
};

// --- PDF ---
export const exportResultsToPDF = (
  bracket: Match[][],
  categoryName: string = "Categoría"
) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(`Resultados de Competencia - ${categoryName}`, 14, 22);

  const tableData: any[] = [];

  bracket.forEach((round, roundIndex) => {
    round.forEach((match, matchIndex) => {
      const aka = match.pair[0];
      const shiro = match.pair[1];
      const winner = match.winner;

      tableData.push([
        `R${roundIndex + 1} - C${matchIndex + 1}`,
        getName(aka),
        getName(shiro),
        winner ? getName(winner) : "Pendiente",
      ]);
    });
  });

  autoTable(doc, {
    head: [["Match", "Aka", "Shiro", "Ganador"]],
    body: tableData,
    startY: 30,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [22, 160, 133] }, // Green-ish
  });

  doc.save("Reporte_Kumite.pdf");
};
