const { Client } = require('pg');
const fs = require('fs').promises;

async function setupDatabase() {
  const client = new Client({
    user: 'postgres',
    host: 'db',
    password: 'postgres',
    port: 5432,
    database: 'finance',
  });

  try {
    await client.connect();
    console.log('Connected to the database.');

    const sql = await fs.readFile('./db.sql', 'utf8');

    await client.query(sql);
    console.log('Tables created and data inserted successfully.');

  } catch (err) {
    console.error('Error setting up database:', err.stack);
  } finally {
    await client.end();
    console.log('Disconnected from the database.');
  }
}


module.exports = setupDatabase;
