import { X } from 'lucide-react';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onSave?: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-[800px] flex flex-col max-h-[90vh] overflow-hidden">
        <button onClick={onClose} className="absolute top-3 right-5 text-red-500 hover:text-red-700">
          <X className="h-5 w-5" />
        </button>
        
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 min-h-0">
          <div className="w-full">
            {children}
          </div>
        </div>

        {/* Fixed footer */}
        <div className="flex gap-2 p-4 border-t mt-auto bg-white rounded-b-2xl">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded w-full"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave?.();
              onClose();
            }}
            className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded w-full"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;