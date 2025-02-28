import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface UseImportOptions<T> {
  onImport: (data: T[]) => Promise<void>;
  validator?: (data: any) => T;
  onError?: (error: Error) => void;
}

export function useImport<T>({
  onImport,
  validator,
  onError
}: UseImportOptions<T>) {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const importFromCsv = useCallback(async (file: File) => {
    try {
      setIsImporting(true);

      // Read file
      const text = await file.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',');

      // Parse data
      const data = rows.slice(1).map(row => {
        const values = row.split(',');
        const item = headers.reduce((obj: any, header, index) => {
          obj[header.trim()] = values[index]?.trim() || null;
          return obj;
        }, {});

        // Validate if validator provided
        return validator ? validator(item) : item;
      });

      // Import data
      await onImport(data);

      toast({
        title: 'Sucesso',
        description: 'Dados importados com sucesso',
        variant: 'success'
      });
    } catch (error) {
      console.error('Import error:', error);
      onError?.(error as Error);
      toast({
        title: 'Erro',
        description: 'Erro ao importar arquivo',
        variant: 'destructive'
      });
    } finally {
      setIsImporting(false);
    }
  }, [onImport, validator, onError, toast]);

  return {
    importFromCsv,
    isImporting
  };
}