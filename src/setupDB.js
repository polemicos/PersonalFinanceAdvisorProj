const { Client } = require('pg');
const fs = require('fs').promises;

async function setupDatabase() {
  const client = new Client({
    user: 'postgres',
    host: 'db',
    password: 'postgres', // Ensure this is the correct password
    port: 5432,
    database: 'finance', // Name of the pre-configured database
  });

  try {
    await client.connect();
    console.log('Connected to the database.');

    // Read SQL commands from file
    const sql = await fs.readFile('./db.sql', 'utf8');

    // Execute the SQL commands
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
