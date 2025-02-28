import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';

export function PushNotifications() {
   const [permission, setPermission] = useState<NotificationPermission>('default');
   const [subscription, setSubscription] = useState<PushSubscription | null>(null);
   const { toast } = useToast();

   useEffect(() => {
     // Check if push notifications are supported
     if (!('Notification' in window)) {
       toast({
         variant: 'destructive',
         title: 'Notificações não suportadas',
         description: 'Seu navegador não suporta notificações push.'
       });
       return;
     }

     // Check current permission
     setPermission(Notification.permission);
   }, []);

   const requestPermission = async () => {
     try {
       const result = await Notification.requestPermission();
       setPermission(result);
     } catch (error) {
       toast({
         variant: 'destructive',
         title: 'Erro ao solicitar permissão',
         description: 'Não foi possível solicitar permissão para notificações.'
       });
     }
   };

   const handleSubscribe = async () => {
     try {
       if (permission !== 'granted') {
         await requestPermission();
       }

       if (permission !== 'granted') return;

       const registration = await navigator.serviceWorker.ready;
       const sub = await registration.pushManager.subscribe({
         userVisibleOnly: true,
         applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
       });

       setSubscription(sub);

       // Save subscription to backend
       await apiClient.notifications.savePushSubscription({
         endpoint: sub.endpoint,
         auth: sub.toJSON().keys?.auth,
         p256dh: sub.toJSON().keys?.p256dh
       });

       toast({
         title: 'Notificações ativadas!',
         description: 'Você receberá notificações push.'
       });
     } catch (error) {
       toast({
         variant: 'destructive',
         title: 'Erro ao ativar notificações',
         description: 'Não foi possível ativar as notificações push.'
       });
     }
   };

   const handleUnsubscribe = async () => {
     try {
       if (subscription) {
         await subscription.unsubscribe();
         await apiClient.notifications.deletePushSubscription(subscription.endpoint);
         setSubscription(null);

         toast({
           title: 'Notificações desativadas',
           description: 'Você não receberá mais notificações push.'
         });
       }
     } catch (error) {
       toast({
         variant: 'destructive',
         title: 'Erro ao desativar notificações',
         description: 'Não foi possível desativar as notificações push.'
       });
     }
   };

   const urlBase64ToUint8Array = (base64String: string) => {
     const padding = '='.repeat((4 - base64String.length % 4) % 4);
     const base64 = (base64String + padding)
       .replace(/\-/g, '+')
       .replace(/_/g, '/');

     const rawData = window.atob(base64);
     const outputArray = new Uint8Array(rawData.length);

     for (let i = 0; i < rawData.length; ++i) {
       outputArray[i] = rawData.charCodeAt(i);
     }
     return outputArray;
   };

   return (
     <div className="space-y-4">
       <div className="flex items-center space-x-4">
         <Bell className="h-6 w-6 text-muted-foreground" />
         <div>
           <h3 className="text-lg font-semibold">Notificações Push</h3>
           <p className="text-sm text-muted-foreground">
             Receba alertas e atualizações importantes
           </p>
         </div>
       </div>

       <div className="flex items-center space-x-4">
         <Button
           onClick={handleSubscribe}
           disabled={permission === 'granted' && !!subscription}
         >
           Ativar Notificações
         </Button>

         {subscription && (
           <Button
             variant="destructive"
             onClick={handleUnsubscribe}
           >
             Desativar Notificações
           </Button>
         )}
       </div>

       <div className="text-sm text-muted-foreground">
         Status atual: {permission === 'granted' ? 'Permitido' : 'Bloqueado'}
       </div>
     </div>
   );
}