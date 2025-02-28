import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface UseExportOptions<T> {
  data: T[];
  filename?: string;
  fields?: (keyof T)[];
  formatters?: Partial<Record<keyof T, (value: any) => string>>;
  onError?: (error: Error) => void;
}

export function useExport<T extends object>({
  data,
  filename = 'export.csv',
  fields,
  formatters = {},
  onError
}: UseExportOptions<T>) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportToCsv = useCallback(async () => {
    try {
      setIsExporting(true);

      // Get fields to export
      const exportFields = fields || Object.keys(data[0] || {}) as (keyof T)[];

      // Create CSV header
      const header = exportFields.join(',');

      // Create CSV rows
      const rows = data.map(item => 
        exportFields.map(field => {
          const value = item[field];
          const formatter = formatters[field];
          const formattedValue = formatter ? formatter(value) : value;
          return `"${String(formattedValue).replace(/"/g, '""')}"`;
        }).join(',')
      );

      // Combine header and rows
      const csv = [header, ...rows].join('\n');

      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Sucesso',
        description: 'Arquivo exportado com sucesso',
        variant: 'success'
      });
    } catch (error) {
      console.error('Export error:', error);
      onError?.(error as Error);
      toast({
        title: 'Erro',
        description: 'Erro ao exportar arquivo',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  }, [data, filename, fields, formatters, onError, toast]);

  return {
    exportToCsv,
    isExporting
  };
}