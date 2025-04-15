# Library Management System

A modern web-based library management system that allows users to manage books, track check-ins/check-outs, and search through the collection.

## Features

- Book Management (Add, Edit, Delete)
- Check-in/Check-out functionality
- Advanced search capabilities
- Modern, responsive UI

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: SQLite
- Hosting: Netlify

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Setup Instructions

1. Clone the repository:
```bash
git clone [your-repository-url]
cd library-management-system
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up the database:
```bash
cd backend
npm run setup-db
```

4. Start the development servers:
```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Deployment

This application is configured for deployment on Netlify. The deployment process is automated through GitHub integration:

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure the build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/build`
4. Deploy!

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
DATABASE_URL=./library.db
```

## API Documentation

The backend API provides the following endpoints:

- GET /api/books - Get all books
- POST /api/books - Add a new book
- PUT /api/books/:id - Update a book
- DELETE /api/books/:id - Delete a book
- GET /api/books/search - Search books
- POST /api/books/:id/checkout - Check out a book
- POST /api/books/:id/checkin - Check in a book

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request