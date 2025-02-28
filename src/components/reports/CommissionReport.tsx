@@ .. @@
-import { useSupabaseClient } from '@supabase/auth-helpers-react';
+import { query } from '@/lib/db';
 import { format } from 'date-fns';
@@ .. @@
   const { data: report } = useQuery({
     queryKey: ['commission-report', business?.id, startDate, endDate],
     queryFn: async () => {
       if (!business?.id) return null;
-      const { data, error } = await supabase.rpc(
-        'get_commission_report',
-        {
-          p_business_id: business.id,
-          p_start_date: startDate,
-          p_end_date: endDate
-        }
-      );
-      if (error) throw error;
-      return data;
+      const sql = `
+        WITH commission_data AS (
+          SELECT
+            p.id as attendant_id,
+            p.full_name as attendant_name,
+            COUNT(*) as total_records,
+            COUNT(CASE WHEN c.status = 'pending' THEN 1 END) as pending_count,
+            SUM(c.amount) as total_amount,
+            SUM(CASE WHEN c.status = 'pending' THEN c.amount ELSE 0 END) as pending_amount
+          FROM commissions c
+          JOIN profiles p ON c.attendant_id = p.id
+          WHERE c.business_id = $1
+          AND c.created_at BETWEEN $2 AND $3
+          GROUP BY p.id, p.full_name
+        ),
+        summary AS (
+          SELECT
+            SUM(total_amount) as total_paid,
+            SUM(pending_amount) as total_pending,
+            COUNT(*) as total_records,
+            COUNT(CASE WHEN pending_count > 0 THEN 1 END) as pending_attendants
+          FROM commission_data
+        )
+        SELECT
+          json_build_object(
+            'summary', (SELECT row_to_json(summary) FROM summary),
+            'by_attendant', (SELECT json_agg(commission_data) FROM commission_data)
+          ) as report
+      `;
+      const result = await query(sql, [business.id, startDate, endDate]);
+      return result[0]?.report;
     },
     enabled: !!business?.id
   });
@@ .. @@