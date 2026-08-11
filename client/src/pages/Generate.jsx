import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Sparkles, Grid, BookOpen } from 'lucide-react';
import { generateCards } from '../services/api';
import CardCountSelector from '../components/CardCountSelector';
import Flashcard from '../components/Flashcard';
import { CardSkeletonList, ErrorState } from '../components/StatusIndicators';

export default function Generate() {
  const { getToken } = useAuth();
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(3);
  
  // Status states: 'idle' | 'loading' | 'success' | 'error'
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedCards, setGeneratedCards] = useState([]);
  
  // Presentation state for success: 'study' (carousel) or 'grid'
  const [viewMode, setViewMode] = useState('study');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    
    // Validation
    const trimmedTopic = topic.trim();
    if (!trimmedTopic) {
      setErrorMessage('Please enter a topic or question to learn.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    
    try {
      const data = await generateCards(trimmedTopic, count, getToken);
      
      if (Array.isArray(data)) {
        setGeneratedCards(data);
        setStatus('success');
        setViewMode('study');
        setCurrentCardIndex(0);
      } else if (data && Array.isArray(data.flashcards)) {
        // Fallback in case backend wraps it in a object
        setGeneratedCards(data.flashcards);
        setStatus('success');
        setViewMode('study');
        setCurrentCardIndex(0);
      } else {
        throw new Error('Unexpected response format from the server.');
      }
    } catch (err) {
      console.error('Generation failed:', err);
      setErrorMessage(err.message || 'Failed to generate flashcards. Please try again.');
      setStatus('error');
    }
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % generatedCards.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + generatedCards.length) % generatedCards.length);
  };

  return (
    <div className="generate-container">
      {/* Page Header */}
      <header className="page-header">
        <h2>Create New Flashcards</h2>
        <p>Enter a topic and let our AI generate structured, double-sided study cards for you.</p>
      </header>

      {/* Main Generator Form */}
      <section className="form-card">
        <form onSubmit={handleGenerate}>
          <div className="input-group">
            <label htmlFor="topic-input" className="input-label">What would you like to learn?</label>
            <textarea
              id="topic-input"
              className="topic-textarea"
              placeholder="e.g. JavaScript Async/Await, Photosynthesis process, French basic vocabulary, etc."
              value={topic}
              onChange={handleTopicChange}
              disabled={status === 'loading'}
              rows={3}
              required
            />
          </div>

          <div className="form-row">
            <CardCountSelector count={count} onChange={setCount} />
            
            <button 
              type="submit" 
              className="btn btn-primary generate-submit-btn"
              disabled={status === 'loading' || !topic.trim()}
            >
              <Sparkles size={18} className="btn-icon-left" />
              <span>{status === 'loading' ? 'Generating...' : 'Generate Flashcards'}</span>
            </button>
          </div>
        </form>
      </section>

      {/* States Display */}
      {status === 'loading' && (
        <section className="results-section">
          <div className="results-header">
            <h3>Generating Flashcards...</h3>
            <p>Our AI is drafting cards for "{topic}"</p>
          </div>
          <CardSkeletonList count={count} />
        </section>
      )}

      {status === 'error' && (
        <section className="results-section">
          <ErrorState message={errorMessage} onRetry={handleGenerate} />
        </section>
      )}

      {status === 'success' && generatedCards.length > 0 && (
        <section className="results-section">
          {/* Results Action Header */}
          <div className="results-header-actions">
            <div>
              <h3>Generated Cards</h3>
              <p>Successfully created {generatedCards.length} flashcards on "{topic}"</p>
            </div>
            
            <div className="view-mode-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'study' ? 'active' : ''}`}
                onClick={() => setViewMode('study')}
                title="Study Carousel View"
              >
                <BookOpen size={16} />
                <span>Study Mode</span>
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid size={16} />
                <span>Grid View</span>
              </button>
            </div>
          </div>

          {/* Render Mode: Study (Carousel) */}
          {viewMode === 'study' ? (
            <div className="study-carousel-container">
              <div className="study-carousel-card">
                <Flashcard 
                  question={generatedCards[currentCardIndex].question}
                  answer={generatedCards[currentCardIndex].answer}
                  topic={topic}
                />
              </div>
              
              <div className="carousel-controls">
                <button className="btn btn-secondary btn-sm" onClick={prevCard}>
                  Prev
                </button>
                <span className="carousel-indicator">
                  Card {currentCardIndex + 1} of {generatedCards.length}
                </span>
                <button className="btn btn-secondary btn-sm" onClick={nextCard}>
                  Next
                </button>
              </div>
            </div>
          ) : (
            /* Render Mode: Grid */
            <div className="flashcards-grid">
              {generatedCards.map((card, idx) => (
                <Flashcard 
                  key={idx}
                  question={card.question}
                  answer={card.answer}
                  topic={topic}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
