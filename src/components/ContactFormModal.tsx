'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import ContactForm from './ContactForm';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Get in Touch
            </h2>
            <p className="text-gray-600">
              Fill out the form below and we&apos;ll get back to you within 24 hours.
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
