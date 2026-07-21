"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  ConversationHeader,
  Avatar
} from '@chatscope/chat-ui-kit-react';
import { useUser } from '@/context/UserContext';

const MAX_MSG_LENGTH = 2000;

const createGreetingMessage = () => ({
  id: 'welcome-message',
  message: 'Hello! How can we help you today? 👋',
  sentTime: new Date().toISOString(),
  sender: 'support',
  direction: 'incoming',
  position: 'single'
});

const normalizeMessage = (msg) => {
  if (!msg) return null;
  const text = typeof msg.text === 'string' ? msg.text : msg.message || '';
  if (!text) return null;
  return {
    id: msg.id || `${msg.timestamp || Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message: text,
    sentTime: msg.timestamp || msg.sentTime || new Date().toISOString(),
    sender: msg.sender || 'support',
    direction: msg.direction || (msg.sender === 'user' ? 'outgoing' : 'incoming'),
    position: 'single'
  };
};

const getSupportSocketUrl = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPPORT_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SUPPORT_SOCKET_URL;
  }
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:3001`;
  }
  return 'http://localhost:3001';
};

const getSendText = (value) => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    if (typeof value.text === 'string') return value.text;
    if (typeof value.message === 'string') return value.message;
    if (typeof value.content === 'string') return value.content;
  }
  return '';
};

const getOrCreateSessionId = () => {
  if (typeof window === 'undefined') return null;
  const existing = window.localStorage.getItem('support-session-id');
  if (existing) return existing;
  const id = `support_${crypto.randomUUID()}`;
  window.localStorage.setItem('support-session-id', id);
  return id;
};

export default function SupportChatWindow({ isOpen, setIsOpen, onUnreadCountChange }) {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('idle'); // idle | connecting | connected | disconnected
  const [isClosed, setIsClosed] = useState(false); // session closed by admin

  const socketRef = useRef(null);
  const sessionIdRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const connectSocket = useCallback(() => {
    if (socketRef.current) return;

    sessionIdRef.current = getOrCreateSessionId();
    setConnectionStatus('connecting');

    const socket = io(getSupportSocketUrl(), {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 8,
      reconnectionDelay: 1500,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('connected');
      socket.emit('register_user', {
        sessionId: sessionIdRef.current,
        userId: user?.id || null,
      });
    });

    socket.on('connect_error', () => setConnectionStatus('disconnected'));
    socket.on('disconnect', () => setConnectionStatus('disconnected'));

    socket.on('session_history', (history = []) => {
      const parsed = (history || []).map(normalizeMessage).filter(Boolean);
      setMessages(parsed.length > 0 ? parsed : [createGreetingMessage()]);
    });

    socket.on('receive_message', (msg) => {
      if (msg?.sender === 'admin') {
        setIsTyping(false);
        clearTimeout(typingTimeoutRef.current);
      }
      const formatted = normalizeMessage(msg);
      if (!formatted) return;

      setMessages((prev) => {
        if (prev.some((m) => m.id === formatted.id)) return prev;
        return [...prev, formatted];
      });

      if (msg?.sender !== 'user') {
        onUnreadCountChange(1); // Increment unread count in parent
      }
    });

    socket.on('session_closed', () => {
      setIsClosed(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `closed-${Date.now()}`,
          message: 'This support session has been closed. Thank you for contacting us!',
          sentTime: new Date().toISOString(),
          sender: 'support',
          direction: 'incoming',
          position: 'single',
        },
      ]);
    });

    socket.on('rate_limited', (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `rl-${Date.now()}`,
          message: `⚠ ${msg}`,
          sentTime: new Date().toISOString(),
          sender: 'support',
          direction: 'incoming',
          position: 'single',
        },
      ]);
    });
  }, [user?.id, onUnreadCountChange]);

  useEffect(() => {
    connectSocket();
    return () => {
      socketRef.current?.disconnect();
      clearTimeout(typingTimeoutRef.current);
    };
  }, [connectSocket]);

  const handleReconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    connectSocket();
  };

  const handleSend = (messageText) => {
    const text = getSendText(messageText).trim();
    if (!text || text.length > MAX_MSG_LENGTH) return;
    if (connectionStatus !== 'connected' || !socketRef.current) return;
    if (isClosed) return;

    const optimistic = normalizeMessage({
      id: `opt-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
      direction: 'outgoing',
    });

    setMessages((prev) => [...prev, optimistic]);
    socketRef.current.emit('user_send_message', {
      sessionId: sessionIdRef.current,
      text,
    });

    setIsTyping(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 15000);
  };

  return (
    <div
      className={`transition-all duration-500 origin-bottom-right ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
      }`}
      style={{
        width: '360px',
        height: '480px',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px -10px rgba(0,0,0,0.25)',
      }}
    >
      <MainContainer>
        <ChatContainer>
          <ConversationHeader>
            <Avatar
              src="https://ui-avatars.com/api/?name=Support&background=003B4A&color=fff"
              name="Support"
            />
            <ConversationHeader.Content
              userName="Customer Support"
              info={
                connectionStatus === 'connected'
                  ? isClosed ? 'Session closed' : 'Active now'
                  : connectionStatus === 'connecting'
                  ? 'Connecting...'
                  : 'Offline'
              }
            />
            <ConversationHeader.Actions>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </ConversationHeader.Actions>
          </ConversationHeader>

          {connectionStatus === 'disconnected' && (
            <div
              style={{ padding: '8px 12px', background: '#fffbeb', borderBottom: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#b45309' }}>
                Support is currently unavailable.
              </span>
              <button
                onClick={handleReconnect}
                style={{ fontSize: '11px', fontWeight: 700, color: '#003B4A', background: 'none', border: '1px solid #003B4A', borderRadius: '9999px', padding: '2px 10px', cursor: 'pointer' }}
              >
                Reconnect
              </button>
            </div>
          )}

          {connectionStatus === 'connecting' && (
            <div style={{ padding: '8px 12px', background: '#eff6ff', borderBottom: '1px solid #bfdbfe', fontSize: '12px', fontWeight: 600, color: '#1d4ed8' }}>
              Connecting to support...
            </div>
          )}

          <MessageList
            typingIndicator={isTyping ? <TypingIndicator content="Support is typing..." /> : null}
          >
            {messages.map((msg, i) => (
              <Message key={msg.id || i} model={msg}>
                {msg.direction === 'incoming' && (
                  <Avatar
                    src="https://ui-avatars.com/api/?name=Support&background=003B4A&color=fff"
                    name="Support"
                  />
                )}
              </Message>
            ))}
          </MessageList>

          <MessageInput
            placeholder={
              isClosed
                ? 'Session closed'
                : connectionStatus === 'connected'
                ? 'Type message here...'
                : 'Reconnecting...'
            }
            onSend={(html, textContent, innerText) =>
              handleSend(innerText || textContent || html)
            }
            attachButton={false}
            sendButton={true}
            disabled={connectionStatus !== 'connected' || isClosed}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
