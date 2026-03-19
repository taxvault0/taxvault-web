// D:\taxvault-canada\web-portal\src\components\chat\ChatButton.jsx
import React, { useState } from 'react';
import ChatDrawer from './ChatDrawer';
import { useChat } from '../../context/ChatContext';

const ChatButton = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Safely get chat context with default values
  let chatContext;
  try {
    chatContext = useChat() || {};
  } catch (error) {
    console.warn('Chat context not available yet');
    chatContext = {};
  }
  
  const { conversations = [], unreadCount = 0 } = chatContext;

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleDrawer}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors z-50 flex items-center justify-center"
        aria-label="Open chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat Drawer */}
      <ChatDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default ChatButton;