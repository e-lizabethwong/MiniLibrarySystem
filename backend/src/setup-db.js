const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Ensure the database directory exists
const dbDir = path.dirname(process.env.DATABASE_URL || path.join(__dirname, 'library.db'));
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DATABASE_URL || path.join(__dirname, 'library.db');
console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to the SQLite database.');
});

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
  )`, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Books table created or already exists');
    }
  });

  // Verify the table exists
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='books'", (err, row) => {
    if (err) {
      console.error('Error checking table:', err);
    } else if (!row) {
      console.error('Books table does not exist!');
    } else {
      console.log('Books table verified');
    }
  });
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
  } else {
    console.log('Database connection closed');
  }
}); 