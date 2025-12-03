import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      "overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4 md:p-0"
    )}>
      <div
        ref={modalRef}
        className={cn(
          "relative w-full max-w-2xl max-h-[90vh] overflow-y-auto",
          "rounded-xl bg-white shadow-2xl transition-all"
        )}
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className={cn(
              "rounded-lg p-1.5 text-gray-400",
              "hover:bg-gray-100 hover:text-gray-900 transition-colors"
            )}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};