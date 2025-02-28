import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Cloud, CloudOff } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

interface SyncStatus {
  lastSync: Date | null;
  pendingChanges: number;
  isOnline: boolean;
}

export function OfflineSync() {
   const [status, setStatus] = useState<SyncStatus>({
     lastSync: null,
     pendingChanges: 0,
     isOnline: navigator.onLine
   });

   const { toast } = useToast();

   useEffect(() => {
     const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }));
     const handleOffline = () => setStatus(prev => ({ ...prev, isOnline: false }));

     window.addEventListener('online', handleOnline);
     window.addEventListener('offline', handleOffline);

     return () => {
       window.removeEventListener('online', handleOnline);
       window.removeEventListener('offline', handleOffline);
     };
   }, []);

   const syncChanges = async () => {
     try {
       const pendingChanges = []; // Assume this is populated from somewhere

       // Sync each change
       for (const change of pendingChanges) {
         await apiClient.sync.upsert(change.table, change.data);
       }

       // Update last sync time
       setStatus(prev => ({
         ...prev,
         lastSync: new Date(),
         pendingChanges: 0
       }));

       toast({
         title: 'Sincronização concluída',
         description: 'Todas as alterações foram sincronizadas com sucesso.'
       });
     } catch (error) {
       toast({
         variant: 'destructive',
         title: 'Erro de sincronização',
         description: 'Não foi possível sincronizar as alterações.'
       });
     }
   };

   return (
     <div className="flex items-center space-x-2">
       {status.isOnline ? <Cloud className="h-4 w-4" /> : <CloudOff className="h-4 w-4" />}
       <span>{status.isOnline ? 'Online' : 'Offline'}</span>
       {status.pendingChanges > 0 && (
         <button onClick={syncChanges}>
           Sincronizar ({status.pendingChanges} alterações pendentes)
         </button>
       )}
     </div>
   );
}