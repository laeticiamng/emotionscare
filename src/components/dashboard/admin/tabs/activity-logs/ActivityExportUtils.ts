
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';

export const exportToExcel = (data: any[], filename = 'activity-logs') => {
  try {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Activity Logs');
    
    // Generate file and save
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
    // Create blob and save
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `${filename}-${formatDate(new Date())}.xlsx`);
    
    toast({
      title: 'Exported Successfully',
      description: `${data.length} records exported to Excel.`,
    });
  } catch (error) {
    console.error('Error exporting Excel file:', error);
    toast({
      title: 'Export Failed',
      description: 'There was an error exporting data to Excel.',
      variant: 'destructive',
    });
  }
};

export const exportToCSV = (data: any[], filename = 'activity-logs') => {
  try {
    // Convert data to CSV
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    
    // Create blob and save
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${filename}-${formatDate(new Date())}.csv`);
    
    toast({
      title: 'Exported Successfully',
      description: `${data.length} records exported to CSV.`,
    });
  } catch (error) {
    console.error('Error exporting CSV file:', error);
    toast({
      title: 'Export Failed',
      description: 'There was an error exporting data to CSV.',
      variant: 'destructive',
    });
  }
};
