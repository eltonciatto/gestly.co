@@ .. @@
-import { useSupabaseClient } from '@supabase/auth-helpers-react';
+import { query } from '@/lib/db';
 import { Clock, Plus, Trash2 } from 'lucide-react';
@@ .. @@
   const { data: horarios = [], isLoading: isLoadingHorarios } = useQuery({
     queryKey: ['horarios-funcionamento', business?.id],
     queryFn: async () => {
       if (!business?.id) return [];
-      const { data, error } = await supabase
-        .from('horarios_funcionamento')
-        .select('*')
-        .eq('business_id', business.id)
-        .order('dia_semana');
-      if (error) throw error;
-      return data;
+      const sql = `
+        SELECT * FROM horarios_funcionamento 
+        WHERE business_id = $1
+        ORDER BY dia_semana
+      `;
+      return query(sql, [business.id]);
     },
     enabled: !!business?.id
   });
@@ .. @@
   const updateHorario = useMutation({
     mutationFn: async (horario: HorarioFuncionamento) => {
       if (!business?.id) throw new Error('Business not found');
-      const { error } = await supabase
-        .from('horarios_funcionamento')
-        .upsert({
-          ...horario,
-          business_id: business.id
-        });
-      if (error) throw error;
+      const sql = `
+        INSERT INTO horarios_funcionamento (
+          id, business_id, dia_semana, hora_inicio, hora_fim,
+          intervalo_inicio, intervalo_fim
+        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
+        ON CONFLICT (id) DO UPDATE SET
+          hora_inicio = $4,
+          hora_fim = $5,
+          intervalo_inicio = $6,
+          intervalo_fim = $7
+      `;
+      await query(sql, [
+        horario.id,
+        business.id,
+        horario.dia_semana,
+        horario.hora_inicio,
+        horario.hora_fim,
+        horario.intervalo_inicio,
+        horario.intervalo_fim
+      ]);
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['horarios-funcionamento'] });
@@ .. @@