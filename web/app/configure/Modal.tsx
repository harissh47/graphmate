import { X } from 'lucide-react';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-5 text-red-500 hover:text-red-700">
          <X className="h-5 w-5" />
        </button>
        <div className="mb-4">
          {children}
        </div>
        <button
          onClick={onClose}
          className="text-sm text-black bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded w-full">
          Save
        </button>
      </div>
    </div>
  );
};

export default Modal;