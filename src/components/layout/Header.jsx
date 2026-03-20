import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, MessageCircle, ChevronDown } from 'lucide-react';
import { useAuth } from 'features/auth/context/AuthContext';
import { useChat } from 'features/chat/context/ChatContext';
import Button from '../ui/Button';

const getAssignedCAId = (user) => {
  if (!user) return null;

  if (
    typeof user.assignedCAId === 'string' ||
    typeof user.assignedCAId === 'number'
  ) {
    return user.assignedCAId;
  }

  if (typeof user.caId === 'string' || typeof user.caId === 'number') {
    return user.caId;
  }

  if (
    typeof user.assignedCA === 'string' ||
    typeof user.assignedCA === 'number'
  ) {
    return user.assignedCA;
  }

  if (user.assignedCA && typeof user.assignedCA === 'object') {
    return user.assignedCA.id || user.assignedCA._id || null;
  }

  return null;
};

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const assignedCAId = getAssignedCAId(user);

  let chatContext;
  try {
    chatContext = useChat();
  } catch (error) {
    console.log('Chat context not available yet');
    chatContext = {};
  }

  const { unreadCount = 0 } = chatContext;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChatClick = () => {
    try {
      if (user?.role === 'ca') {
        navigate('/ca/messages');
        return;
      }

      if (assignedCAId) {
        navigate(`/messages/${assignedCAId}`);
        return;
      }

      navigate('/find-ca');
    } catch (error) {
      console.error('Error opening chat:', error);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const getUserBadge = () => {
    if (user?.role === 'ca') {
      return (
        <span className="ml-2 rounded-full bg-secondary-500 px-2 py-1 text-xs font-medium text-white">
          CA
        </span>
      );
    }

    return null;
  };

  const getAccountSubtitle = () => {
    if (user?.role === 'ca') {
      return 'Chartered Accountant';
    }

    return assignedCAId ? 'CA Assigned' : 'Personal Account';
  };

  const getChatTitle = () => {
    if (user?.role === 'ca') return 'Open client messages';
    if (assignedCAId) return 'Chat with your assigned CA';
    return 'Find a CA to start chat';
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center">
            <button
              onClick={onMenuClick}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>

            <Link
              to={user?.role === 'ca' ? '/ca/dashboard' : '/dashboard'}
              className="ml-2 flex min-w-0 items-center lg:ml-0"
            >
              <span className="truncate text-2xl font-bold text-primary-600">
                TaxVault
              </span>
              {getUserBadge()}
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleChatClick}
              className="relative rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              aria-label="Open messages"
              title={getChatTitle()}
            >
              <MessageCircle size={20} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            <button
              className="relative rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              aria-label="Open notifications"
            >
              <Bell size={20} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            <button
              onClick={handleProfileClick}
              className="flex items-center gap-3 rounded-xl border border-gray-200 px-2 py-1.5 hover:bg-gray-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100">
                <span className="text-sm font-semibold text-primary-700">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>

              <div className="hidden text-left md:block">
                <p className="max-w-[140px] truncate text-sm font-medium text-gray-800">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500">{getAccountSubtitle()}</p>
              </div>

              <ChevronDown
                size={16}
                className="hidden text-gray-400 md:block"
              />
            </button>

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