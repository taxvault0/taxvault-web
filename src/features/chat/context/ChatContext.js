import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { messageService } from 'services/messageService';
import { io } from 'socket.io-client';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize socket connection
  useEffect(() => {
    if (!user) return;

    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: { token: localStorage.getItem('token') },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('🔌 Chat socket connected');
    });

    newSocket.on('online_users', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('new_message', handleNewMessage);
    newSocket.on('message_read', handleMessageRead);
    newSocket.on('typing', handleTyping);

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Load conversations
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const response = await messageService.getConversations();
      setConversations(response.data);
      
      // Calculate unread count
      const unread = response.data.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    // Update conversations list with new message
    setConversations(prev => {
      const updated = [...prev];
      const index = updated.findIndex(c => c.id === message.conversationId);
      
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          lastMessage: message,
          unreadCount: (updated[index].unreadCount || 0) + (message.senderId !== user?.id ? 1 : 0)
        };
        // Move to top
        const [conversation] = updated.splice(index, 1);
        updated.unshift(conversation);
      }
      
      return updated;
    });

    // Update unread count
    if (message.senderId !== user?.id) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const handleMessageRead = ({ conversationId, messageId }) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
    setUnreadCount(0);
  };

  const handleTyping = ({ conversationId, userId, isTyping }) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, typing: isTyping ? userId : null }
          : conv
      )
    );
  };

  // Updated openChat function to handle no conversation parameter
  const openChat = (conversation = null) => {
    setActiveConversation(conversation);
    setIsOpen(true);
    setMinimized(false);
    
    // Mark as read only if there's a conversation with unread messages
    if (conversation?.unreadCount > 0) {
      messageService.markConversationAsRead(conversation.id);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setActiveConversation(null);
  };

  const minimizeChat = () => {
    setMinimized(true);
  };

  const maximizeChat = () => {
    setMinimized(false);
  };

  const sendMessage = async (conversationId, text, attachments = []) => {
    try {
      const response = await messageService.sendMessage(conversationId, { text, attachments });
      
      // Emit via socket
      if (socket) {
        socket.emit('send_message', {
          conversationId,
          message: response.data,
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const markAsRead = (conversationId, messageId) => {
    if (socket) {
      socket.emit('mark_read', { conversationId, messageId });
    }
  };

  const sendTyping = (conversationId, isTyping) => {
    if (socket) {
      socket.emit('typing', { conversationId, isTyping });
    }
  };

  const value = {
    isOpen,
    minimized,
    activeConversation,
    conversations,
    unreadCount,
    onlineUsers,
    loading,
    openChat,
    closeChat,
    minimizeChat,
    maximizeChat,
    sendMessage,
    markAsRead,
    sendTyping,
    loadConversations,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
  
};








