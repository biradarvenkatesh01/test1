import { AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Loading Spinner / skeleton component
 */
export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="status-container loading-container">
      <div className="spinner-wrapper">
        <RefreshCw className="spinner-icon" size={40} />
      </div>
      <p className="status-message">{message}</p>
    </div>
  );
}

/**
 * Card Skeleton loader to represent card loading state
 */
export function CardSkeletonList({ count = 3 }) {
  const skeletons = Array.from({ length: count });
  return (
    <div className="skeleton-grid">
      {skeletons.map((_, index) => (
        <div key={index} className="card-skeleton">
          <div className="skeleton-line skeleton-header"></div>
          <div className="skeleton-line skeleton-body-1"></div>
          <div className="skeleton-line skeleton-body-2"></div>
          <div className="skeleton-line skeleton-footer"></div>
        </div>
      ))}
    </div>
  );
}

/**
 * Empty state component with title, description, and CTA
 */
export function EmptyState({ 
  title = 'No flashcards yet', 
  description = 'Generate your first set of flashcards to start learning.', 
  ctaText = 'Generate Flashcards',
  ctaPath = '/generate'
}) {
  return (
    <div className="status-container empty-container">
      <div className="empty-icon-wrapper">
        <Layers size={48} className="empty-icon" />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
      {ctaPath && ctaText && (
        <Link to={ctaPath} className="btn btn-primary btn-md">
          {ctaText}
        </Link>
      )}
    </div>
  );
}

/**
 * Error state component with message and retry CTA
 */
export function ErrorState({ 
  message = 'Something went wrong. Please try again.', 
  onRetry 
}) {
  return (
    <div className="status-container error-container">
      <div className="error-icon-wrapper">
        <AlertCircle size={40} className="error-icon" />
      </div>
      <h3 className="error-title">Error Occurred</h3>
      <p className="error-description">{message}</p>
      {onRetry && (
        <button className="btn btn-primary btn-md" onClick={onRetry}>
          <RefreshCw size={16} className="btn-icon-left" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
