@@ .. @@
-import { useSupabaseClient } from '@supabase/auth-helpers-react';
+import { query } from '@/lib/db';
 import { format } from 'date-fns';
@@ .. @@
   const { data: report } = useQuery({
     queryKey: ['financial-report', business?.id, startDate, endDate],
     queryFn: async () => {
       if (!business?.id) return null;
-      const { data, error } = await supabase.rpc(
-        'get_financial_report',
-        {
-          p_business_id: business.id,
-          p_start_date: startDate,
-          p_end_date: endDate
-        }
-      );
-      if (error) throw error;
-      return data;
+      const sql = `
+        WITH metrics AS (
+          SELECT
+            SUM(CASE WHEN type = 'revenue' THEN amount ELSE 0 END) as revenue,
+            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses,
+            COUNT(DISTINCT CASE WHEN type = 'revenue' THEN customer_id END) as total_customers,
+            COUNT(CASE WHEN type = 'revenue' THEN 1 END) as total_transactions,
+            AVG(CASE WHEN type = 'revenue' THEN amount END) as average_ticket,
+            CASE 
+              WHEN SUM(CASE WHEN type = 'revenue' THEN amount ELSE 0 END) > 0 
+              THEN (SUM(CASE WHEN type = 'revenue' THEN amount ELSE 0 END) - 
+                   SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)) / 
+                   SUM(CASE WHEN type = 'revenue' THEN amount ELSE 0 END)
+              ELSE 0
+            END as profit_margin
+          FROM financial_transactions
+          WHERE business_id = $1
+          AND date BETWEEN $2 AND $3
+        )
+        SELECT *,
+          revenue - expenses as net_result
+        FROM metrics
+      `;
+      return query(sql, [business.id, startDate, endDate]);
     },
     enabled: !!business?.id
   });
@@ .. @@