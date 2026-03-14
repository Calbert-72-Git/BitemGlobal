import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToExcel = (data: any[], columns: { key: string; label: string }[], filename: string) => {
  const rows = data.map(row => {
    const obj: Record<string, any> = {};
    columns.forEach(col => { obj[col.label] = row[col.key] ?? ""; });
    return obj;
  });
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Datos");
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToPDF = (data: any[], columns: { key: string; label: string }[], title: string, filename: string) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleDateString("es-ES")}`, 14, 28);

  autoTable(doc, {
    startY: 35,
    head: [columns.map(c => c.label)],
    body: data.map(row => columns.map(c => String(row[c.key] ?? "-"))),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [30, 86, 160] },
  });

  doc.save(`${filename}.pdf`);
};
