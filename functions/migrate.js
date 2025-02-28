import { schedule } from '@netlify/functions';
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const handler = schedule('@daily', async (event) => {
  const connectionString = process.env.VITE_POSTGRES_URL;
  if (!connectionString) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Database connection string not found' })
    };
  }

  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('Connected to database');

    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get executed migrations
    const { rows: executedMigrations } = await client.query(
      'SELECT name FROM migrations ORDER BY id'
    );
    const executedMigrationNames = executedMigrations.map(m => m.name);

    // Read migration files
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    // Execute pending migrations
    for (const file of migrationFiles) {
      if (!executedMigrationNames.includes(file)) {
        console.log(`Executing migration: ${file}`);
        
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
        
        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [file]
          );
          await client.query('COMMIT');
          console.log(`Migration ${file} executed successfully`);
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Migrations executed successfully' })
    };
  } catch (error) {
    console.error('Error executing migrations:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await client.end();
  }
});

export { handler };