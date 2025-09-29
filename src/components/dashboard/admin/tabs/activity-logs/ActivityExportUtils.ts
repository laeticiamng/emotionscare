
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const exportActivityData = (data: any[], format: 'csv' | 'xlsx' = 'xlsx', filename = 'activity-logs') => {
  try {
    if (!data || data.length === 0) {
      console.error('No data to export');
      return false;
    }

    switch (format) {
      case 'xlsx': {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Activity Logs');
        
        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const excelData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Save the file
        saveAs(excelData, `${filename}.xlsx`);
        return true;
      }
      
      case 'csv': {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const csvData = XLSX.utils.sheet_to_csv(worksheet);
        const csvBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
        
        // Save the file
        saveAs(csvBlob, `${filename}.csv`);
        return true;
      }
      
      default:
        console.error('Unsupported format');
        return false;
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    return false;
  }
};

export default {
  exportActivityData
};
