@@ .. @@
   // List customers
   fastify.get('/', async (request) => {
+    const querySchema = z.object({
+      search: z.string().optional(),
+      tags: z.array(z.string()).optional(),
+      limit: z.number().min(1).max(100).optional(),
+      offset: z.number().min(0).optional()
+    });
+
+    const query = querySchema.parse(request.query);
+
     const { rows } = await request.db.query(
       `SELECT * FROM customers 
        WHERE business_id = $1
@@ .. @@
   // Create customer
   fastify.post('/', async (request) => {
-    const data = customerSchema.parse(request.body);
+    const data = await customerSchema.parseAsync(request.body);
+
+    // Validate unique phone
+    const { rows: existing } = await request.db.query(
+      `SELECT id FROM customers 
+       WHERE business_id = $1 AND phone = $2`,
+      [request.user.business_id, data.phone]
+    );
+
+    if (existing.length > 0) {
+      throw AppError.conflict('Phone number already registered');
+    }