const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware with detailed CORS configuration
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Database setup
const dbDir = path.dirname(process.env.DATABASE_URL || path.join(__dirname, 'library.db'));
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DATABASE_URL || path.join(__dirname, 'library.db');
console.log('Database path:', dbPath);

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to the SQLite database.');
});

// Verify table exists on startup
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='books'", (err, row) => {
  if (err) {
    console.error('Error checking table:', err);
  } else if (!row) {
    console.error('Books table does not exist! Running setup...');
    require('./setup-db');
  }
});

// Helper function to run SQL queries
const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Helper function to run SQL commands
const runCommand = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await runQuery('SELECT * FROM books ORDER BY title');
    console.log('Fetched books:', books);
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add a new book
app.post('/api/books', async (req, res) => {
  const { title, author, publication_date, edition } = req.body;
  console.log('Adding new book:', { title, author, publication_date, edition });
  try {
    const result = await runCommand(
      'INSERT INTO books (title, author, publication_date, edition) VALUES (?, ?, ?, ?)',
      [title, author, publication_date, edition]
    );
    console.log('Book added successfully:', result.lastID);
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a book
app.put('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, publication_date, edition } = req.body;
  try {
    await runCommand(
      'UPDATE books SET title = ?, author = ?, publication_date = ?, edition = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, author, publication_date, edition, id]
    );
    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a book
app.delete('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await runCommand('DELETE FROM books WHERE id = ?', [id]);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search books
app.get('/api/books/search', async (req, res) => {
  const { title, author, publication_date, edition } = req.query;
  let query = 'SELECT * FROM books WHERE 1=1';
  const params = [];

  if (title) {
    query += ' AND title LIKE ?';
    params.push(`%${title}%`);
  }
  if (author) {
    query += ' AND author LIKE ?';
    params.push(`%${author}%`);
  }
  if (publication_date) {
    query += ' AND publication_date = ?';
    params.push(publication_date);
  }
  if (edition) {
    query += ' AND edition = ?';
    params.push(edition);
  }

  try {
    const books = await runQuery(query, params);
    res.json(books);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check out a book
app.post('/api/books/:id/checkout', async (req, res) => {
  const { id } = req.params;
  try {
    await runCommand(
      'UPDATE books SET is_borrowed = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    res.json({ message: 'Book checked out successfully' });
  } catch (error) {
    console.error('Error checking out book:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check in a book
app.post('/api/books/:id/checkin', async (req, res) => {
  const { id } = req.params;
  try {
    await runCommand(
      'UPDATE books SET is_borrowed = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    res.json({ message: 'Book checked in successfully' });
  } catch (error) {
    console.error('Error checking in book:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 