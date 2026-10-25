import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Phone,
  Video,
  Search,
  User,
  Sparkles
} from 'lucide-react';

const MessagesPage = () => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeRecipient, setActiveRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeRecipient) {
      fetchMessagesWithUser(activeRecipient._id);
    }
  }, [activeRecipient]);

  // Listen for incoming live socket messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      // If message is from the active open chat, append it!
      if (activeRecipient && data.senderId === activeRecipient._id) {
        setMessages((prev) => [
          ...prev,
          {
            _id: Math.random().toString(),
            sender: { _id: data.senderId, name: activeRecipient.name },
            content: data.content,
            createdAt: new Date().toISOString()
          }
        ]);
      }
      // Refresh conversations list to update snippet
      fetchConversations();
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, activeRecipient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    setLoadingConv(true);
    try {
      const res = await API.get('/messages/conversations');
      if (res.data.success) {
        setConversations(res.data.conversations);
        if (res.data.conversations.length > 0 && !activeRecipient) {
          setActiveRecipient(res.data.conversations[0].user);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoadingConv(false);
    }
  };

  const fetchMessagesWithUser = async (otherUserId) => {
    setLoadingMessages(true);
    try {
      const res = await API.get(`/messages/${otherUserId}`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newText.trim() || !activeRecipient) return;

    const textToSend = newText.trim();
    setNewText('');

    try {
      const res = await API.post('/messages', {
        recipientId: activeRecipient._id,
        content: textToSend
      });

      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.message]);

        // Emit through socket for real-time delivery
        if (socket) {
          socket.emit('send_message', {
            recipientId: activeRecipient._id,
            senderId: user._id,
            content: textToSend
          });
        }

        fetchConversations();
      }
    } catch (err) {
      alert('Failed to send message');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-[78vh] flex overflow-hidden">
        {/* Left Conversations Sidebar */}
        <div className="w-full sm:w-80 md:w-96 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-800" />
              Messaging
            </h2>
            <span className="text-[10px] bg-brand-50 text-brand-800 font-bold px-2 py-0.5 rounded-full">
              Live Socket
            </span>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingConv ? (
              <p className="text-xs text-slate-400 text-center py-8">Loading conversations...</p>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                <p>No active conversations yet.</p>
                <p className="mt-1">Connect with mentors or students through the Mentorship or Directory page.</p>
              </div>
            ) : (
              conversations.map((conv, idx) => {
                const isActive = activeRecipient?._id === conv.user?._id;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveRecipient(conv.user)}
                    className={`w-full text-left p-4 flex items-start space-x-3 transition-colors ${
                      isActive ? 'bg-brand-50/70 border-r-4 border-brand-800' : 'hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={conv.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.user?.name}`}
                      alt={conv.user?.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {conv.user?.name}
                          </h4>
                          {conv.user?.isVerifiedAlumni && (
                            <CheckCircle2 className="w-3 h-3 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {conv.user?.role === 'alumni'
                          ? `@${conv.user?.company}`
                          : conv.user?.department}
                      </p>
                      <p className="text-xs text-slate-600 truncate mt-1">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Chat Pane */}
        {activeRecipient ? (
          <div className="hidden sm:flex flex-1 flex-col h-full bg-slate-50">
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-3">
                <img
                  src={activeRecipient.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeRecipient.name}`}
                  alt={activeRecipient.name}
                  className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    {activeRecipient.name}
                    {activeRecipient.isVerifiedAlumni && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" title="Verified Alumni" />
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activeRecipient.role === 'alumni'
                      ? `${activeRecipient.designation || 'Alumnus'} @ ${activeRecipient.company}`
                      : `${activeRecipient.department} • Batch ${activeRecipient.batchYear}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href="https://meet.google.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-slate-500 hover:text-brand-800 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Launch Google Meet"
                >
                  <Video className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMessages ? (
                <div className="text-center py-10 text-xs text-slate-400">Loading chat history...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  <p>No messages yet.</p>
                  <p className="mt-1">Send a greeting to start your mentorship discussion!</p>
                </div>
              ) : (
                messages.map((msg, mIdx) => {
                  const isMine =
                    (typeof msg.sender === 'object' ? msg.sender._id : msg.sender) === user?._id;

                  return (
                    <div
                      key={mIdx}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
                          isMine
                            ? 'bg-brand-800 text-white rounded-br-none'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.content}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200">
              <div className="flex items-center space-x-2 bg-slate-50 rounded-xl px-4 py-2 border border-slate-200">
                <input
                  type="text"
                  placeholder={`Message ${activeRecipient.name}...`}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="flex-1 bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!newText.trim()}
                  className="bg-brand-800 hover:bg-brand-900 disabled:opacity-40 text-white p-2 rounded-lg transition-colors font-bold"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="hidden sm:flex flex-1 items-center justify-center bg-slate-50 text-slate-400 text-xs">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
