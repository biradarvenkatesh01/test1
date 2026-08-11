import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isDeleting }) {
  const modalRef = useRef(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus modal when opened
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
        ref={modalRef}
        tabIndex={-1}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close confirmation dialog">
          <X size={20} />
        </button>

        <div className="modal-header-icon">
          <div className="warning-icon-wrapper">
            <AlertTriangle size={32} className="warning-icon" />
          </div>
        </div>

        <h3 id="modal-title" className="modal-title">Delete Flashcard</h3>
        <p className="modal-description">
          Are you sure you want to delete this saved flashcard? This action cannot be undone and it will be permanently removed from your collection.
        </p>

        <div className="modal-actions">
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            className="btn btn-danger" 
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
