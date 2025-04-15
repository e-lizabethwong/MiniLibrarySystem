const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DATABASE_URL || path.join(__dirname, 'library.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Create books table
  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    publication_date TEXT NOT NULL,
    edition TEXT NOT NULL,
    is_borrowed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  console.log('Database setup completed successfully');
});

db.close(); 