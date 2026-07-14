import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ══════════════════════════════════════════════════════════════════════════════
// EXPORT UTILITIES — shared functions for Excel and PDF export
// Single source of truth for exporting data from any page.
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Export data to an Excel file (.xlsx).
 *
 * @param {Array<Object>} rows - The data rows to export
 * @param {Array<{ header: string, key: string }>} columns - Column definitions
 * @param {string} filename - The filename without extension (e.g. "batches")
 */
export function exportToExcel(rows, columns, filename) {
  // Build the header row from column definitions
  const headers = columns.map((col) => col.header);

  // Map each data row to an array of values matching column order
  const data = rows.map((row) =>
    columns.map((col) => {
      const value = row[col.key];
      // Format dates and nulls for readability
      if (value === null || value === undefined) return "";
      if (value instanceof Date) return value.toLocaleDateString();
      return value;
    })
  );

  // Create a worksheet from the 2D array (headers + data)
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

  // Auto-size columns based on content
  const colWidths = columns.map((col, i) => {
    const maxLength = Math.max(
      col.header.length,
      ...data.map((row) => String(row[i] || "").length)
    );
    return { wch: Math.min(maxLength + 2, 40) };
  });
  worksheet["!cols"] = colWidths;

  // Create a workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Trigger the download
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Export data to a PDF file with a styled table.
 *
 * @param {Array<Object>} rows - The data rows to export
 * @param {Array<{ header: string, key: string }>} columns - Column definitions
 * @param {string} title - The document title (displayed at the top)
 * @param {string} filename - The filename without extension (e.g. "batches")
 */
export function exportToPDF(rows, columns, title, filename) {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 20);

  // Add timestamp
  doc.setFontSize(10);
  doc.setTextColor(128);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

  // Build the table using jspdf-autotable
  const tableHeaders = columns.map((col) => col.header);
  const tableData = rows.map((row) =>
    columns.map((col) => {
      const value = row[col.key];
      if (value === null || value === undefined) return "";
      if (value instanceof Date) return value.toLocaleDateString();
      return String(value);
    })
  );

  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
    startY: 34,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [230, 0, 0], // brand-primary #e60000
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250], // neutral-50
    },
    margin: { top: 34 },
  });

  // Trigger the download
  doc.save(`${filename}.pdf`);
}
