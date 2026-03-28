require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const runMigration = async () => {
  const client = await pool.connect();

  try {
    console.log('Starting database migration...');

    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await client.query(schema);

    console.log('✓ Database schema created successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

runMigration();
