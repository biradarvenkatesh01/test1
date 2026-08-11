import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true // Index to quickly fetch or delete cards scoped to a specific user
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);
export default Flashcard;
