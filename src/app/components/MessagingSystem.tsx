import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send,
  MapPin,
  ArrowLeft,
  MoreVertical,
  Image as ImageIcon,
  Paperclip,
  Check,
  CheckCheck,
  Bell,
  BellOff,
  Bot
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { WorkerLocationMap } from './WorkerLocationMap';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  read: boolean;
  status: 'sent' | 'delivered' | 'read';
  isAI?: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  role: string;
  photo?: string;
  isOnline: boolean;
  lastSeen?: Date;
  phone: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  isOnWay?: boolean;
  jobStatus?: string;
}

// Mock workers (shown to clients)
const mockWorkers: ChatUser[] = [
  {
    id: 'worker-1',
    name: 'Juan Dela Cruz',
    role: 'Plumber',
    isOnline: true,
    phone: '09615097697',
    location: {
      lat: 14.4164,
      lng: 120.9884,
      address: 'STI LASPINAS'
    },
    isOnWay: true,
    jobStatus: 'On the way'
  },
  {
    id: 'worker-2',
    name: 'Maria Santos',
    role: 'Electrician',
    isOnline: false,
    phone: '09171234567',
    lastSeen: new Date(Date.now() - 900000),
    jobStatus: 'Available'
  },
  {
    id: 'worker-3',
    name: 'Pedro Reyes',
    role: 'Carpenter',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000),
    phone: '09281234567',
    jobStatus: 'Offline'
  }
];

// Mock clients (shown to workers)
const mockClients: ChatUser[] = [
  {
    id: 'client-1',
    name: 'Jose Rizal',
    role: 'Customer',
    isOnline: true,
    phone: '09191234567',
    location: {
      lat: 14.4206,
      lng: 120.9896,
      address: 'Alabang, Muntinlupa City'
    }
  },
  {
    id: 'client-2',
    name: 'Ana Lopez',
    role: 'Customer',
    isOnline: true,
    phone: '09281234568',
    location: {
      lat: 14.4500,
      lng: 120.9833,
      address: 'BF Homes, Parañaque City'
    }
  },
  {
    id: 'client-3',
    name: 'Carlos Garcia',
    role: 'Customer',
    isOnline: false,
    phone: '09171234569',
    lastSeen: new Date(Date.now() - 1800000)
  }
];

// AI Auto-Reply Logic
const getAIReply = (messageText: string, workerName: string): string => {
  const msg = messageText.toLowerCase();

  // Location/Where are you
  if (msg.includes('where') || msg.includes('location')) {
    return "On the way boss, almost there!";
  }

  // ETA/How long
  if (msg.includes('how long') || msg.includes('eta') || msg.includes('time')) {
    return "Around 10 minutes, traffic is light.";
  }

  // Arrived/Here
  if (msg.includes('arrived') || msg.includes('here')) {
    return "Yes, I'm here na. Where should I go?";
  }

  // Price/Cost
  if (msg.includes('price') || msg.includes('cost') || msg.includes('rate')) {
    return "Will assess the issue first, then give you exact quote. Fair price guaranteed!";
  }

  // Status check
  if (msg.includes('status') || msg.includes('update')) {
    return "Working on it boss, will update you soon.";
  }

  // Done/Finished
  if (msg.includes('done') || msg.includes('finish')) {
    return "Almost done, just cleaning up.";
  }

  // Default friendly response
  const defaultReplies = [
    "Got it, on it boss!",
    "Okay, will handle that.",
    "Noted, thanks for letting me know!",
    "Sure thing, give me a moment.",
    "Copy that!"
  ];

  return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
};

interface MessagingSystemProps {
  initialChatId?: string;
}

export function MessagingSystem({ initialChatId }: MessagingSystemProps = {}) {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(initialChatId || null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [newMessage, setNewMessage] = useState('');
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [workerIsTyping, setWorkerIsTyping] = useState(false);
  const [aiSuggestedReply, setAiSuggestedReply] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isWorker = user?.role === 'worker';
  const chatList = isWorker ? mockClients : mockWorkers;
  const selectedPerson = chatList.find(u => u.id === selectedChat);

  // Update selected chat when initialChatId changes
  useEffect(() => {
    if (initialChatId && initialChatId !== selectedChat) {
      setSelectedChat(initialChatId);
    }
  }, [initialChatId]);

  const scrollToBottom = useCallback((force = false) => {
    if (!chatContainerRef.current || !messagesEndRef.current) return;

    const container = chatContainerRef.current;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;

    if (force || isAtBottom) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  }, []);

  useEffect(() => {
    if (selectedChat) {
      setTimeout(() => scrollToBottom(true), 100);
    }
  }, [selectedChat, scrollToBottom]);

  // AI Auto-Reply for worker when client sends message
  useEffect(() => {
    if (!selectedChat || isWorker) return;

    const chatMessages = messages[selectedChat] || [];
    const lastMessage = chatMessages[chatMessages.length - 1];

    // If client sent a message and worker is offline, trigger AI reply
    if (lastMessage && lastMessage.senderId === 'me' && selectedPerson && !selectedPerson.isOnline) {
      const aiReplyTimer = setTimeout(() => {
        const aiReply: Message = {
          id: `ai-${Date.now()}`,
          senderId: selectedPerson.id,
          senderName: selectedPerson.name,
          text: getAIReply(lastMessage.text, selectedPerson.name),
          timestamp: new Date(),
          read: false,
          status: 'delivered',
          isAI: true
        };

        setMessages(prev => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), aiReply]
        }));

        setTimeout(() => scrollToBottom(true), 100);
      }, 2000 + Math.random() * 2000); // Random delay 2-4 seconds

      return () => clearTimeout(aiReplyTimer);
    }
  }, [messages, selectedChat, selectedPerson, isWorker, scrollToBottom]);

  // Generate AI suggested reply for workers
  useEffect(() => {
    if (!isWorker || !selectedChat) return;

    const chatMessages = messages[selectedChat] || [];
    const lastMessage = chatMessages[chatMessages.length - 1];

    // If client sent last message, suggest AI reply
    if (lastMessage && lastMessage.senderId !== 'me' && !lastMessage.isAI) {
      const suggestion = getAIReply(lastMessage.text, user?.name || 'Worker');
      setAiSuggestedReply(suggestion);
    } else {
      setAiSuggestedReply(null);
    }
  }, [messages, selectedChat, isWorker, user]);

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || newMessage;
    if (!textToSend.trim() || !selectedChat || !selectedPerson) return;

    const msg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: user?.name || 'You',
      text: textToSend,
      timestamp: new Date(),
      read: false,
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), msg]
    }));

    setNewMessage('');
    setAiSuggestedReply(null);
    setTimeout(() => scrollToBottom(true), 100);

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedChat]: prev[selectedChat].map(m =>
          m.id === msg.id ? { ...m, status: 'delivered' } : m
        )
      }));
    }, 1000);

    // Simulate message read
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedChat]: prev[selectedChat].map(m =>
          m.id === msg.id ? { ...m, status: 'read', read: true } : m
        )
      }));
    }, 3000);

    // If worker is online and client sent message, simulate worker reply
    if (!isWorker && selectedPerson.isOnline && Math.random() > 0.5) {
      setTimeout(() => {
        const workerReply: Message = {
          id: `reply-${Date.now()}`,
          senderId: selectedPerson.id,
          senderName: selectedPerson.name,
          text: getAIReply(textToSend, selectedPerson.name),
          timestamp: new Date(),
          read: false,
          status: 'delivered'
        };

        setMessages(prev => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), workerReply]
        }));

        setTimeout(() => scrollToBottom(true), 100);
      }, 3000 + Math.random() * 3000);
    }
  };

  const handleUseSuggestedReply = () => {
    if (aiSuggestedReply) {
      handleSendMessage(aiSuggestedReply);
    }
  };

  const getLastMessage = (userId: string) => {
    const msgs = messages[userId] || [];
    return msgs[msgs.length - 1];
  };

  const getUnreadCount = (userId: string) => {
    const msgs = messages[userId] || [];
    return msgs.filter(m => !m.read && m.senderId !== 'me').length;
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return format(date, 'HH:mm');
    return format(date, 'MMM dd');
  };

  const MessageStatusIcon = ({ status }: { status: 'sent' | 'delivered' | 'read' }) => {
    if (status === 'sent') return <Check className="w-3 h-3 text-gray-400" />;
    if (status === 'delivered') return <CheckCheck className="w-3 h-3 text-gray-400" />;
    return <CheckCheck className="w-3 h-3 text-blue-500" />;
  };

  return (
    <section className="bg-gray-100 py-8 flex items-center justify-center" style={{ minHeight: '100vh' }}>
      <div className="max-w-7xl w-full mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col" style={{ height: '85vh', maxHeight: '850px', minHeight: '500px' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
            {/* Contacts List */}
            <div className={`border-r border-gray-200 flex flex-col overflow-hidden ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
              {/* Header */}
              <div className="bg-blue-600 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    {isWorker ? 'Client Messages' : 'Messages'}
                  </h2>
                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {notificationsEnabled ? (
                      <Bell className="w-5 h-5 text-white" />
                    ) : (
                      <BellOff className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Contacts */}
              <div className="flex-1 overflow-y-auto">
                {chatList.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p className="text-sm">No conversations yet</p>
                    <p className="text-xs mt-1">
                      {isWorker ? 'Clients will appear here' : 'Start messaging workers'}
                    </p>
                  </div>
                ) : (
                  chatList.map(person => {
                    const lastMsg = getLastMessage(person.id);
                    const unreadCount = getUnreadCount(person.id);

                    return (
                      <div
                        key={person.id}
                        onClick={() => setSelectedChat(person.id)}
                        className={`p-4 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${
                          selectedChat === person.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Profile Photo */}
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                              {person.name.charAt(0)}
                            </div>
                            <div
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                person.isOnline ? 'bg-green-500' : 'bg-gray-400'
                              }`}
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 truncate text-sm">{person.name}</h3>
                              {lastMsg && (
                                <span className="text-xs text-gray-500">
                                  {formatMessageTime(lastMsg.timestamp)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-600 truncate">
                                {lastMsg ? (
                                  <>
                                    {lastMsg.isAI && <Bot className="w-3 h-3 inline mr-1" />}
                                    {lastMsg.text}
                                  </>
                                ) : (
                                  `${person.role}${person.jobStatus ? ` • ${person.jobStatus}` : ''}`
                                )}
                              </p>
                              {unreadCount > 0 && (
                                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`md:col-span-2 flex flex-col overflow-hidden ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
              {selectedPerson ? (
                <>
                  {/* Chat Header */}
                  <div className="bg-blue-600 p-4 flex items-center justify-between shadow-md flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5 text-white" />
                      </button>

                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold">
                          {selectedPerson.name.charAt(0)}
                        </div>
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-blue-700 ${
                            selectedPerson.isOnline ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-white text-sm">{selectedPerson.name}</h3>
                        <p className="text-xs text-blue-100">
                          {selectedPerson.isOnline
                            ? selectedPerson.isOnWay
                              ? '🚗 On the way'
                              : 'Online'
                            : selectedPerson.lastSeen
                            ? `Last seen ${formatMessageTime(selectedPerson.lastSeen)}`
                            : 'Offline'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedPerson.location && (
                        <button
                          onClick={() => setShowLocationMap(!showLocationMap)}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                          title="View location"
                        >
                          <MapPin className="w-5 h-5 text-white" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Location Map */}
                  {showLocationMap && selectedPerson.location && (
                    <div className="border-b border-gray-200 flex-shrink-0">
                      <WorkerLocationMap
                        workerLocation={{
                          lat: selectedPerson.location.lat,
                          lng: selectedPerson.location.lng,
                          name: selectedPerson.name,
                          address: selectedPerson.location.address
                        }}
                      />
                    </div>
                  )}

                  {/* Messages */}
                  <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 bg-gray-50"
                    style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                      minHeight: 0
                    }}
                  >
                    {(messages[selectedChat] || []).length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-400">
                          <p className="text-sm">No messages yet</p>
                          <p className="text-xs mt-1">Start the conversation!</p>
                        </div>
                      </div>
                    ) : (
                      (messages[selectedChat] || []).map((msg, idx) => {
                        const isMe = msg.senderId === 'me';
                        const showTime = idx === 0 ||
                          (messages[selectedChat][idx - 1].timestamp.getTime() - msg.timestamp.getTime() > 300000);

                        return (
                          <div key={msg.id}>
                            {showTime && (
                              <div className="text-center text-xs text-gray-500 mb-4">
                                {format(msg.timestamp, 'EEEE, MMM dd, yyyy • HH:mm')}
                              </div>
                            )}
                            <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
                              <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                  isMe
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                                }`}
                              >
                                {msg.isAI && !isMe && (
                                  <div className="flex items-center gap-1 mb-1">
                                    <Bot className="w-3 h-3 text-gray-500" />
                                    <span className="text-xs text-gray-500">AI Assistant</span>
                                  </div>
                                )}
                                <p className="text-sm break-words">{msg.text}</p>
                                <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                  <span className={`text-xs ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {format(msg.timestamp, 'HH:mm')}
                                  </span>
                                  {isMe && <MessageStatusIcon status={msg.status} />}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* AI Suggested Reply (for workers) */}
                  {isWorker && aiSuggestedReply && (
                    <div className="px-4 py-2 bg-blue-50 border-t border-blue-100 flex items-center gap-2 flex-shrink-0">
                      <Bot className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-blue-600 font-medium mb-1">AI Suggested Reply:</p>
                        <p className="text-sm text-gray-700 truncate">{aiSuggestedReply}</p>
                      </div>
                      <button
                        onClick={handleUseSuggestedReply}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                      >
                        Use
                      </button>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0 relative z-10">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 relative z-20 cursor-pointer"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '*/*';
                          input.onchange = () => {
                            console.log('File selected:', input.files?.[0]);
                          };
                          input.click();
                        }}
                      >
                        <Paperclip className="w-5 h-5 text-gray-500 pointer-events-none" />
                      </button>
                      <button
                        type="button"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 relative z-20 cursor-pointer"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = () => {
                            console.log('Image selected:', input.files?.[0]);
                          };
                          input.click();
                        }}
                      >
                        <ImageIcon className="w-5 h-5 text-gray-500 pointer-events-none" />
                      </button>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-10 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendMessage()}
                        disabled={!newMessage.trim()}
                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex-shrink-0 relative z-20"
                      >
                        <Send className="w-5 h-5 pointer-events-none" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600 text-sm">
                      {isWorker ? 'Choose a client to start messaging' : 'Choose a worker to start messaging'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
