import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function Flashcard({ id, question, answer, topic, onDelete, isSavedMode = false }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleFlip();
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent card from flipping when clicking delete button
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div 
      className={`flashcard-scene ${flipped ? 'is-flipped' : ''}`}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Flashcard: ${flipped ? 'Answer side' : 'Question side'}. Press Space or Enter to flip.`}
    >
      <div className="flashcard-card">
        {/* Front of Card (Question) */}
        <div className="flashcard-face flashcard-front">
          <div className="flashcard-header">
            <span className="flashcard-topic">{topic || 'Flashcard'}</span>
            <span className="flashcard-side-indicator">Q</span>
          </div>
          <div className="flashcard-body">
            <p className="flashcard-text question-text">{question}</p>
          </div>
          <div className="flashcard-footer">
            <span className="flashcard-hint">Click to flip & see answer</span>
          </div>
        </div>

        {/* Back of Card (Answer) */}
        <div className="flashcard-face flashcard-back">
          <div className="flashcard-header">
            <span className="flashcard-topic">{topic || 'Flashcard'}</span>
            <span className="flashcard-side-indicator answer-indicator">A</span>
          </div>
          <div className="flashcard-body">
            <p className="flashcard-text answer-text">{answer}</p>
          </div>
          <div className="flashcard-footer">
            <span className="flashcard-hint">Click to flip & see question</span>
            {isSavedMode && onDelete && (
              <button 
                className="delete-card-btn"
                onClick={handleDelete}
                aria-label="Delete this flashcard"
                title="Delete Flashcard"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
