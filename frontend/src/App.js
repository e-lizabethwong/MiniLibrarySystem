import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

// Import components
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import SearchBooks from './components/SearchBooks';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Library Management System
              </Typography>
              <Button color="inherit" component={RouterLink} to="/">
                Books
              </Button>
              <Button color="inherit" component={RouterLink} to="/search">
                Search
              </Button>
              <Button color="inherit" component={RouterLink} to="/add">
                Add Book
              </Button>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<BookList />} />
              <Route path="/search" element={<SearchBooks />} />
              <Route path="/add" element={<BookForm />} />
              <Route path="/edit/:id" element={<BookForm />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 