import { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  Send, 
  MapPin, 
  ArrowLeft, 
  MoreVertical, 
  Image as ImageIcon,
  Paperclip,
  Check,
  CheckCheck,
  Bell,
  BellOff
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { WorkerLocationMap } from './WorkerLocationMap';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
  status: 'sent' | 'delivered' | 'read';
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
}

const mockWorkers: ChatUser[] = [
  {
    id: '1',
    name: 'Mike Johnson',
    role: 'Plumber',
    isOnline: true,
    phone: '+1-555-0101',
    location: {
      lat: 40.7580,
      lng: -73.9855,
      address: 'Times Square, Manhattan'
    },
    isOnWay: true
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'Electrician',
    isOnline: true,
    phone: '+1-555-0102'
  },
  {
    id: '3',
    name: 'David Martinez',
    role: 'Carpenter',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000),
    phone: '+1-555-0103'
  },
  {
    id: '4',
    name: 'James Wilson',
    role: 'Technician',
    isOnline: true,
    phone: '+1-555-0104',
    location: {
      lat: 40.7489,
      lng: -73.9680,
      address: 'Grand Central, Manhattan'
    },
    isOnWay: false
  }
];

export function MessagingSystem() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1',
        senderId: '1',
        text: "Hi! I'm on my way to fix your plumbing issue.",
        timestamp: new Date(Date.now() - 600000),
        read: true,
        status: 'read'
      },
      {
        id: '2',
        senderId: 'me',
        text: "Great! How long will it take?",
        timestamp: new Date(Date.now() - 540000),
        read: true,
        status: 'read'
      },
      {
        id: '3',
        senderId: '1',
        text: "I'll be there in about 15 minutes. I have all the necessary tools.",
        timestamp: new Date(Date.now() - 480000),
        read: true,
        status: 'read'
      }
    ],
    '2': [
      {
        id: '1',
        senderId: '2',
        text: "Hello! I can help with your electrical issue. When would be a good time?",
        timestamp: new Date(Date.now() - 7200000),
        read: true,
        status: 'read'
      }
    ]
  });
  const [newMessage, setNewMessage] = useState('');
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const selectedWorker = mockWorkers.find(w => w.id === selectedChat);

  const scrollToBottom = (force = false) => {
    if (!chatContainerRef.current || !messagesEndRef.current) return;

    const container = chatContainerRef.current;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    // Only auto-scroll if user is near bottom or force is true
    if (force || isNearBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Only force scroll on initial chat selection
    if (selectedChat) {
      scrollToBottom(true);
    }
  }, [selectedChat]);

  useEffect(() => {
    // Gentle auto-scroll when new messages arrive (only if near bottom)
    scrollToBottom(false);
  }, [messages]);

  // Simulate receiving messages
  useEffect(() => {
    if (!selectedChat) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7 && selectedChat) {
        const newMsg: Message = {
          id: Date.now().toString(),
          senderId: selectedChat,
          text: getRandomWorkerMessage(),
          timestamp: new Date(),
          read: false,
          status: 'delivered'
        };

        setMessages(prev => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), newMsg]
        }));

        // Show notification
        if (notificationsEnabled) {
          toast.success(`New message from ${selectedWorker?.name}`, {
            description: newMsg.text.substring(0, 50) + '...',
            icon: <Bell className="w-4 h-4" />
          });
        }
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [selectedChat, notificationsEnabled, selectedWorker]);

  const getRandomWorkerMessage = () => {
    const messages = [
      "I'm making good progress!",
      "Just need to check one more thing.",
      "Almost done here.",
      "Everything looks good so far.",
      "I'll update you in a few minutes."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const msg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: newMessage,
      timestamp: new Date(),
      read: false,
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), msg]
    }));

    setNewMessage('');

    // Force scroll to bottom when sending a message
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
  };

  const getLastMessage = (workerId: string) => {
    const msgs = messages[workerId] || [];
    return msgs[msgs.length - 1];
  };

  const getUnreadCount = (workerId: string) => {
    const msgs = messages[workerId] || [];
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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: '80vh' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Contacts List */}
            <div className={`border-r border-gray-200 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Messages</h2>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Contacts */}
              <div className="flex-1 overflow-y-auto">
                {mockWorkers.map(worker => {
                  const lastMsg = getLastMessage(worker.id);
                  const unreadCount = getUnreadCount(worker.id);

                  return (
                    <div
                      key={worker.id}
                      onClick={() => setSelectedChat(worker.id)}
                      className={`p-4 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${
                        selectedChat === worker.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Profile Photo */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                            {worker.name.charAt(0)}
                          </div>
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              worker.isOnline ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{worker.name}</h3>
                            {lastMsg && (
                              <span className="text-xs text-gray-500">
                                {formatMessageTime(lastMsg.timestamp)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">
                              {lastMsg?.text || `${worker.role} - Available`}
                            </p>
                            {unreadCount > 0 && (
                              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`md:col-span-2 flex flex-col ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
              {selectedWorker ? (
                <>
                  {/* Chat Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5 text-white" />
                      </button>
                      
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold">
                          {selectedWorker.name.charAt(0)}
                        </div>
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-blue-700 ${
                            selectedWorker.isOnline ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-white">{selectedWorker.name}</h3>
                        <p className="text-xs text-blue-100">
                          {selectedWorker.isOnline
                            ? selectedWorker.isOnWay
                              ? '🚗 On the way'
                              : 'Online'
                            : selectedWorker.lastSeen
                            ? `Last seen ${formatMessageTime(selectedWorker.lastSeen)}`
                            : 'Offline'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedWorker.location && (
                        <button
                          onClick={() => setShowLocationMap(!showLocationMap)}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                          title="View location"
                        >
                          <MapPin className="w-5 h-5 text-white" />
                        </button>
                      )}
                      <a
                        href={`tel:${selectedWorker.phone}`}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        title="Call worker"
                      >
                        <Phone className="w-5 h-5 text-white" />
                      </a>
                      <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Location Map */}
                  {showLocationMap && selectedWorker.location && (
                    <div className="border-b border-gray-200">
                      <WorkerLocationMap
                        workerLocation={{
                          lat: selectedWorker.location.lat,
                          lng: selectedWorker.location.lng,
                          name: selectedWorker.name,
                          address: selectedWorker.location.address
                        }}
                      />
                    </div>
                  )}

                  {/* Messages */}
                  <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
                  >
                    {(messages[selectedChat] || []).map((msg, idx) => {
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
                                  : 'bg-white text-gray-900 rounded-bl-none shadow-md'
                              }`}
                            >
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
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Paperclip className="w-5 h-5 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ImageIcon className="w-5 h-5 text-gray-500" />
                      </button>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                      >
                        <Send className="w-5 h-5" />
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
                    <p className="text-gray-600">Choose a worker to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
