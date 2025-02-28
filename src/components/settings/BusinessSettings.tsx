@@ .. @@
-import { useSupabaseClient } from '@supabase/auth-helpers-react';
+import { query } from '@/lib/db';
 import { ArrowLeft } from 'lucide-react';
@@ .. @@
   const updateBusiness = useMutation({
     mutationFn: async (data: any) => {
       if (!business?.id) throw new Error('Business not found');
-      const { error } = await supabase
-        .from('businesses')
-        .update(data)
-        .eq('id', business.id);
-      if (error) throw error;
+      const sql = `
+        UPDATE businesses 
+        SET name = $2, email = $3, phone = $4, address = $5
+        WHERE id = $1
+      `;
+      await query(sql, [
+        business.id,
+        data.name,
+        data.email || null,
+        data.phone || null,
+        data.address || null
+      ]);
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['business'] });
@@ .. @@