'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import ContactFormModal from './ContactFormModal';

export default function FloatingCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  // Hide on contact page
  if (pathname === '/contact') {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        aria-label="Contact us"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Contact Us
        </span>
      </button>

      {/* Modal */}
      <ContactFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
