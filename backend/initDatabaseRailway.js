// Railway Database Initialization Script
// After Railway deployment, run this script to initialize your database
// 1. Get your database connection string from Railway
// 2. Update .env file with Railway database credentials
// 3. Run: node initDatabaseRailway.js

const { Pool } = require('pg');
require('dotenv').config();

// Use Railway database URL if available, otherwise use individual variables
const pool = process.env.DATABASE_URL 
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })
  : new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: {
        rejectUnauthorized: false
      }
    });

const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing Railway database...');

    // Create todos table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text VARCHAR(500) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableQuery);
    console.log('✅ Table "todos" created successfully');

    // Create index for better performance
    const createIndexQuery = `
      CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);
    `;
    
    await pool.query(createIndexQuery);
    console.log('✅ Index created successfully');

    console.log('🎉 Railway database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  }
};

initializeDatabase();
