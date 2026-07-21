"use client";

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

const SupportChatWindow = dynamic(() => import('./SupportChatWindow'), { ssr: false });

export default function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleOpen = () => {
    setIsOpen(true);
    setHasOpened(true);
    setUnreadCount(0);
  };

  const handleUnreadCountChange = useCallback((count) => {
    if (!isOpen) {
      setUnreadCount((prev) => prev + count);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {hasOpened && (
        <SupportChatWindow 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          onUnreadCountChange={handleUnreadCountChange} 
        />
      )}

      {/* FAB */}
      <button
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        className={`w-16 h-16 rounded-3xl shadow-2xl flex items-center justify-center transition-all duration-300 overflow-hidden relative ${
          isOpen
            ? 'bg-gray-800 rotate-90 scale-95'
            : 'bg-green-600 hover:scale-110 active:scale-90'
        }`}
        aria-label="Support chat"
      >
        {isOpen ? (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}

        {/* Unread badge */}
        {!isOpen && unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-white animate-bounce"
            aria-label={`${unreadCount} unread messages`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
