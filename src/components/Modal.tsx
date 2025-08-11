import { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export const Modal = ({ isOpen, onClose, type, title, message, actionText, onAction }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          {type === 'success' ? (
            <div className="success-icon">
              <CheckCircleIcon className="w-8 h-8 text-text-primary" />
            </div>
          ) : (
            <div className="error-icon">
              <XCircleIcon className="w-8 h-8 text-text-primary" />
            </div>
          )}
          
          <h3 className="text-xl font-bold mb-2 text-text-primary">
            {title}
          </h3>
          
          <p className="text-text-secondary mb-6">
            {message}
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-surface-secondary text-text-primary rounded-xl font-medium hover:bg-surface-tertiary transition-colors"
            >
              Close
            </button>
            
            {actionText && onAction && (
              <button
                onClick={onAction}
                className="flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 bg-surface border border-border text-text-primary hover:bg-surface-secondary"
              >
                {actionText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
