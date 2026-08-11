import { useState } from 'react';
import { useAuth, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Sparkles, FolderHeart, ArrowRight, Lightbulb } from 'lucide-react';
import Flashcard from '../components/Flashcard';

export default function Home() {
  const { isSignedIn } = useAuth();

  const demoCards = [
    {
      question: "What is Active Recall?",
      answer: "A learning principle that involves actively stimulating memory during the learning process by testing yourself, rather than passively reading or reviewing notes.",
      topic: "Cognitive Science"
    },
    {
      question: "How does Spaced Repetition work?",
      answer: "Reviewing information at increasing intervals over time to exploit the psychological spacing effect, which significantly increases long-term retention.",
      topic: "Learning Psychology"
    },
    {
      question: "What is the Feynman Technique?",
      answer: "A study method where you explain a concept in simple terms as if teaching it to a beginner, identifying gaps in your own understanding.",
      topic: "Study Methodology"
    }
  ];

  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);

  const nextDemo = () => {
    setCurrentDemoIndex((prev) => (prev + 1) % demoCards.length);
  };

  const prevDemo = () => {
    setCurrentDemoIndex((prev) => (prev - 1 + demoCards.length) % demoCards.length);
  };

  return (
    <div className="home-container">
      {/* Hero Header Section */}
      <header className="hero-section">
        <div className="badge">
          <Sparkles size={14} className="badge-icon" />
          <span>AI-Powered Learning</span>
        </div>
        
        <h1 className="hero-title">
          Master Any Subject with <span className="gradient-text">AI Flashcards</span>
        </h1>
        
        <p className="hero-subtitle">
          Generate custom, high-quality flashcards on any topic in seconds using state-of-the-art AI. Study efficiently, save your collections, and track your progress.
        </p>

        {/* Hero Actions */}
        <div className="hero-actions">
          {isSignedIn ? (
            <div className="logged-in-actions">
              <Link to="/generate" className="btn btn-primary btn-lg">
                <span>Start Generating</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/my-cards" className="btn btn-secondary btn-lg">
                <FolderHeart size={18} />
                <span>My Saved Cards</span>
              </Link>
            </div>
          ) : (
            <div className="logged-out-actions">
              <SignUpButton mode="modal">
                <button className="btn btn-primary btn-lg">
                  <span>Sign Up Now</span>
                  <ArrowRight size={18} />
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="btn btn-secondary btn-lg">
                  <span>Log In to Your Account</span>
                </button>
              </SignInButton>
            </div>
          )}
        </div>
      </header>

      {/* Feature / Live Preview Section */}
      <section className="preview-section">
        <div className="preview-info">
          <div className="preview-tag">
            <Lightbulb size={16} />
            <span>Interactive Demo</span>
          </div>
          <h2>Interactive Cards</h2>
          <p>
            Experience our 3D card deck right here. Click on the card to flip it and reveal the answer. 
          </p>
          <ul className="feature-list">
            <li><b>Instant AI Generation</b> — Input any topic, from biology to programming.</li>
            <li><b>Active Recall</b> — Optimize retention with double-sided testing.</li>
            <li><b>Responsive Layout</b> — Study seamlessly on mobile, tablet, or desktop.</li>
          </ul>
        </div>
        
        <div className="preview-card-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Flashcard 
            question={demoCards[currentDemoIndex].question} 
            answer={demoCards[currentDemoIndex].answer} 
            topic={demoCards[currentDemoIndex].topic}
          />
          <div className="carousel-controls" style={{ marginTop: '0.5rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={prevDemo}>Prev</button>
            <span className="carousel-indicator" style={{ minWidth: '80px' }}>
              {currentDemoIndex + 1} / {demoCards.length}
            </span>
            <button className="btn btn-secondary btn-sm" onClick={nextDemo}>Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}
