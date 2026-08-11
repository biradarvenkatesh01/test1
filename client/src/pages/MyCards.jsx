import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { FolderHeart, RefreshCw } from 'lucide-react';
import { getCards, deleteCard } from '../services/api';
import Flashcard from '../components/Flashcard';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { LoadingState, EmptyState, ErrorState } from '../components/StatusIndicators';

export default function MyCards() {
  const { getToken } = useAuth();
  
  // Page states: 'loading' | 'success' | 'empty' | 'error'
  const [status, setStatus] = useState('loading');
  const [cards, setCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Delete states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Custom toast notification state
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' | 'error'

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  const fetchSavedCards = async () => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const data = await getCards(getToken);
      if (Array.isArray(data)) {
        setCards(data);
        setStatus(data.length === 0 ? 'empty' : 'success');
      } else {
        throw new Error('API did not return an array of flashcards.');
      }
    } catch (err) {
      console.error('Error fetching cards:', err);
      setErrorMessage(err.message || 'Failed to load your saved flashcards.');
      setStatus('error');
    }
  };

  useEffect(() => {
    fetchSavedCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteTrigger = (id) => {
    setCardToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!cardToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteCard(cardToDelete, getToken);
      
      // Update local state without full reload
      const updatedCards = cards.filter(card => card._id !== cardToDelete && card.id !== cardToDelete);
      setCards(updatedCards);
      
      showToast('Flashcard deleted successfully.', 'success');
      setDeleteModalOpen(false);
      setCardToDelete(null);
      
      if (updatedCards.length === 0) {
        setStatus('empty');
      }
    } catch (err) {
      console.error('Deletion failed:', err);
      showToast(err.message || 'Failed to delete the card. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setCardToDelete(null);
  };

  return (
    <div className="my-cards-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`toast-notification ${toastType}`}>
          <p>{toastMessage}</p>
        </div>
      )}

      {/* Page Header */}
      <header className="page-header">
        <div className="header-title-row">
          <div className="title-with-icon">
            <FolderHeart className="header-icon" size={24} />
            <h2>My Saved Cards</h2>
          </div>
          {status !== 'loading' && (
            <button className="btn btn-secondary btn-icon-only" onClick={fetchSavedCards} title="Refresh cards list">
              <RefreshCw size={16} />
            </button>
          )}
        </div>
        <p>Review and study your complete collection of generated AI flashcards.</p>
      </header>

      {/* States Renderer */}
      {status === 'loading' && (
        <LoadingState message="Fetching your flashcards from MongoDB..." />
      )}

      {status === 'error' && (
        <ErrorState message={errorMessage} onRetry={fetchSavedCards} />
      )}

      {status === 'empty' && (
        <EmptyState 
          title="No saved flashcards yet"
          description="It looks like your collection is empty. Generate some flashcards first to save them automatically."
          ctaText="Create Flashcards"
          ctaPath="/generate"
        />
      )}

      {status === 'success' && cards.length > 0 && (
        <div className="flashcards-grid">
          {cards.map((card) => (
            <Flashcard 
              key={card._id || card.id}
              id={card._id || card.id}
              question={card.question}
              answer={card.answer}
              topic={card.topic || 'Saved Flashcard'}
              onDelete={handleDeleteTrigger}
              isSavedMode={true}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
