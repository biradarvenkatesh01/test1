import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { clerkMiddleware } from '@clerk/express';
import { requireClerkAuth } from './middleware/auth.js';
import * as flashcardController from './controllers/flashcardController.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('CRITICAL ERROR: MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

// Configure CORS to dynamically permit the requesting origin
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Parse incoming JSON payloads
app.use(express.json());

// Mount global Clerk authentication middleware
app.use(clerkMiddleware());

// Protected Flashcards Routes
app.post('/generate', requireClerkAuth, flashcardController.generate);
app.get('/getcards', requireClerkAuth, flashcardController.getCards);
app.delete('/deletecard/:id', requireClerkAuth, flashcardController.deleteCard);

// Centralized Express Error Handler
app.use((err, req, res, next) => {
  console.error('Server error encountered:', err);

  const statusCode = err.status || 500;
  const errorName = err.name || 'InternalServerError';
  const errorMessage = err.message || 'An unexpected error occurred on the server.';

  res.status(statusCode).json({
    error: errorName,
    message: errorMessage
  });
});

// Start listening for requests
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
