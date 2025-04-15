import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function BookList() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      console.log('Fetching books from:', API_URL);
      const response = await axios.get(`${API_URL}/books`);
      console.log('Received books:', response.data);
      setBooks(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to fetch books. Please try again later.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      setError('Failed to delete book. Please try again.');
    }
  };

  const handleCheckout = async (id) => {
    try {
      await axios.post(`${API_URL}/books/${id}/checkout`);
      fetchBooks();
    } catch (error) {
      console.error('Error checking out book:', error);
      setError('Failed to check out book. Please try again.');
    }
  };

  const handleCheckin = async (id) => {
    try {
      await axios.post(`${API_URL}/books/${id}/checkin`);
      fetchBooks();
    } catch (error) {
      console.error('Error checking in book:', error);
      setError('Failed to check in book. Please try again.');
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Library Books
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Publication Date</TableCell>
              <TableCell>Edition</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No books found. Add some books to get started!
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.publication_date}</TableCell>
                  <TableCell>{book.edition}</TableCell>
                  <TableCell>
                    {book.is_borrowed ? (
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleCheckin(book.id)}
                      >
                        Check In
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleCheckout(book.id)}
                      >
                        Check Out
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/edit/${book.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(book.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default BookList; 