import mongoose from 'mongoose';
import Flashcard from '../models/Flashcard.js';
import { generateFlashcards } from '../services/groqService.js';

/**
 * POST /generate
 * Generates flashcards for a specific topic using Groq AI and stores them in MongoDB.
 */
export async function generate(req, res, next) {
  try {
    const { topic, count } = req.body;

    // Validate topic: must exist, be a string, and not empty or whitespace-only
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Topic is required and must be a valid, non-empty text string.'
      });
    }

    // Validate count: must be an integer between 1 and 6
    const parsedCount = parseInt(count, 10);
    if (isNaN(parsedCount) || parsedCount < 1 || parsedCount > 6) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Card count must be a valid integer between 1 and 6.'
      });
    }

    const trimmedTopic = topic.trim();

    // Call Groq AI to generate flashcards
    const generatedCards = await generateFlashcards(trimmedTopic, parsedCount);

    // Save validated flashcards to MongoDB under the authenticated Clerk User ID
    const savedCards = [];
    for (const card of generatedCards) {
      const newCard = new Flashcard({
        userId: req.authUserId, // Derived from Clerk authentication context
        topic: trimmedTopic,
        question: card.question,
        answer: card.answer
      });
      const saved = await newCard.save();
      savedCards.push(saved);
    }

    return res.status(201).json(savedCards);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /getcards
 * Returns all flashcards belonging to the authenticated Clerk user.
 */
export async function getCards(req, res, next) {
  try {
    // Find all cards matching the authenticated user's Clerk ID
    const cards = await Flashcard.find({ userId: req.authUserId })
      .sort({ createdAt: -1 }); // Newest first

    return res.status(200).json(cards);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /deletecard/:id
 * Deletes a flashcard belonging to the authenticated user.
 */
export async function deleteCard(req, res, next) {
  try {
    const { id } = req.params;

    // Validate card ID format to prevent Mongoose cast errors
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Invalid flashcard ID format.'
      });
    }

    // Find and delete the card, verifying both the card ID and the authenticated user's ID
    const deletedCard = await Flashcard.findOneAndDelete({
      _id: id,
      userId: req.authUserId
    });

    // If card does not exist or belongs to someone else, return 404
    if (!deletedCard) {
      return res.status(404).json({
        error: 'NotFound',
        message: 'The requested flashcard was not found or you do not have permission to delete it.'
      });
    }

    return res.status(200).json({
      message: 'Flashcard deleted successfully.',
      cardId: id
    });
  } catch (err) {
    next(err);
  }
}
