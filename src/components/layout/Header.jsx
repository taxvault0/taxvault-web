import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Menu, MessageCircle } from 'lucide-react';
import { useAuth } from 'features/auth/context/AuthContext';
import { useChat } from 'features/chat/context/ChatContext';
import Button from '../ui/Button';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  
  // Safely get chat context
  let chatContext;
  try {
    chatContext = useChat();
  } catch (error) {
    console.log('Chat context not available yet');
    chatContext = {};
  }
  
  const { openChat, unreadCount = 0 } = chatContext;
  
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChatClick = () => {
    try {
      if (openChat) {
        // Call openChat without any parameters to just open the chat list
        openChat();
      } else {
        // If chat is not available, navigate to messages page
        if (user?.role === 'ca') {
          navigate('/ca/messages');
        } else {
          navigate('/messages');
        }
      }
    } catch (error) {
      console.error('Error opening chat:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            <Link to="/dashboard" className="flex items-center ml-2 lg:ml-0">
              <span className="text-2xl font-bold text-primary-600">TaxVault</span>
              {user?.role === 'ca' && (
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-secondary-500 text-white rounded-full">
                  CA
                </span>
              )}
              {user?.userType === 'gig-worker' && (
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-gold-500 text-white rounded-full">
                  Gig Worker
                </span>
              )}
              {user?.userType === 'shop-owner' && (
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-success-500 text-white rounded-full">
                  Shop Owner
                </span>
              )}
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Chat Button */}
            <button
              onClick={handleChatClick}
              className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <MessageCircle size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* User menu */}
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </button>

            {/* Logout button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;






