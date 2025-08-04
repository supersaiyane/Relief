// src/utils/downloadCsv.js

/**
 * Convert an array of objects to CSV and trigger download.
 *
 * @param {string} filename  – the file name (e.g. "Overall Report.csv")
 * @param {Array<string>} headers – the column keys, in order
 * @param {Array<object>} data    – array of row objects
 */
export function downloadCsv(filename, headers, data) {
  // Build header row
  const headerRow = headers.join(',');

  // Build data rows (escaping any commas/quotes in values)
  const rows = data.map(row =>
    headers
      .map(key => {
        let cell = row[key] == null ? '' : String(row[key]);
        // Escape quotes by doubling, wrap in quotes if contains comma/quote/newline
        if (/[",\n]/.test(cell)) {
          cell = `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      })
      .join(',')
  );

  const csvContent = [headerRow, ...rows].join('\n');

  // Create a Blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
