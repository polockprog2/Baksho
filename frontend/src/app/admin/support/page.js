"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar,
  Sidebar,
  ConversationList,
  Conversation
} from '@chatscope/chat-ui-kit-react';

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_SOCKET_TOKEN || '';

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

/** Whether the last message in a session was sent by the user (needs reply) */
const lastSenderIsUser = (session) => {
  const msgs = session.messages || [];
  if (!msgs.length) return false;
  return msgs[msgs.length - 1].sender === 'user';
};

export default function SupportDashboard() {
  const [sessions, setSessions] = useState({});         // open sessions
  const [closedSessions, setClosedSessions] = useState({}); // resolved sessions
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [activeTab, setActiveTab] = useState('open');   // 'open' | 'resolved'
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [errorMessage, setErrorMessage] = useState('');
  const [readMap, setReadMap] = useState({});            // sessionId -> last read msg id
  const socketRef = useRef(null);
  const messageListRef = useRef(null);

  // ── Socket setup ───────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(getSupportSocketUrl(), {
      transports: ['websocket'],
      reconnectionAttempts: 8,
      reconnectionDelay: 1500,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('connected');
      setErrorMessage('');
      socket.emit('join_admin', { token: ADMIN_TOKEN });
    });

    socket.on('connect_error', () => {
      setConnectionStatus('disconnected');
      setErrorMessage('Socket.IO backend is not reachable. Make sure the support server is running on port 3001.');
    });

    socket.on('disconnect', () => setConnectionStatus('disconnected'));

    socket.on('auth_error', (msg) => {
      setErrorMessage(`Admin auth failed: ${msg}`);
    });

    socket.on('all_sessions', (allSessions = []) => {
      const map = {};
      allSessions.forEach((s) => { map[s.id] = s; });
      setSessions(map);
      setActiveSessionId((cur) => cur || allSessions[0]?.id || null);
    });

    socket.on('closed_sessions', (all = []) => {
      const map = {};
      all.forEach((s) => { map[s.id] = s; });
      setClosedSessions(map);
    });

    socket.on('session_updated', (updated) => {
      setSessions((prev) => ({ ...prev, [updated.id]: updated }));
    });

    socket.on('session_closed_ack', (closed) => {
      // Move from open → resolved
      setSessions((prev) => {
        const next = { ...prev };
        delete next[closed.id];
        return next;
      });
      setClosedSessions((prev) => ({ ...prev, [closed.id]: closed }));
      setActiveSessionId((cur) => (cur === closed.id ? null : cur));
    });

    return () => socket.disconnect();
  }, []);

  // ── Auto-scroll when active session messages change ────────────────────────
  useEffect(() => {
    if (messageListRef.current) {
      const el = messageListRef.current.querySelector('[class*="MessageList"]') || messageListRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [activeSessionId, sessions, closedSessions]);

  // ── Mark session as read when it is selected ──────────────────────────────
  useEffect(() => {
    if (!activeSessionId) return;
    const session = sessions[activeSessionId] || closedSessions[activeSessionId];
    if (!session) return;
    const lastId = session.messages?.[session.messages.length - 1]?.id;
    if (lastId) {
      setReadMap((prev) => ({ ...prev, [activeSessionId]: lastId }));
    }
  }, [activeSessionId, sessions, closedSessions]);

  // ── Send reply ─────────────────────────────────────────────────────────────
  const handleSend = useCallback((value) => {
    const text = getSendText(value).trim();
    if (!text || !activeSessionId || !socketRef.current) return;

    // Do NOT add optimistically — the server will echo back via session_updated
    // with the persisted message, avoiding duplicates.
    socketRef.current.emit('admin_send_reply', { sessionId: activeSessionId, text });
  }, [activeSessionId]);


  // ── Close a session ────────────────────────────────────────────────────────
  const handleClose = useCallback((sessionId) => {
    if (!socketRef.current || !sessionId) return;
    socketRef.current.emit('close_session', { sessionId, token: ADMIN_TOKEN });
  }, []);

  // ── Derived data ───────────────────────────────────────────────────────────
  const openList = Object.values(sessions).sort(
    (a, b) => new Date(b.lastActive) - new Date(a.lastActive)
  );
  const resolvedList = Object.values(closedSessions).sort(
    (a, b) => new Date(b.lastActive) - new Date(a.lastActive)
  );

  const pendingReplies = openList.filter(lastSenderIsUser).length;

  const hasUnread = (session) => {
    const msgs = session.messages || [];
    if (!msgs.length) return false;
    const lastMsg = msgs[msgs.length - 1];
    return lastMsg.sender === 'user' && readMap[session.id] !== lastMsg.id;
  };

  const activeSession =
    activeSessionId
      ? sessions[activeSessionId] || closedSessions[activeSessionId]
      : null;

  const displayList = activeTab === 'open' ? openList : resolvedList;

  const sessionLabel = (session, index) =>
    session.userId ? `User (${session.userId.slice(0, 6)}…)` : `Guest #${index + 1}`;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-end">
        <div>
          <h1 className="text-2xl font-black text-[#003B4A]">Live Support Chat</h1>
          <p className="text-sm font-bold text-slate-400">
            Manage and respond to customer support sessions in real-time.
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-black ${
            connectionStatus === 'connected'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              connectionStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          {connectionStatus === 'connected' ? 'Socket connected' : 'Waiting for socket'}
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
          {errorMessage}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Active chats</p>
          <p className="mt-3 text-3xl font-black text-[#003B4A]">{openList.length}</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Awaiting reply</p>
          <p className="mt-3 text-3xl font-black text-[#003B4A]">{pendingReplies}</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Resolved today</p>
          <p className="mt-3 text-3xl font-black text-[#003B4A]">{resolvedList.length}</p>
        </div>
      </div>

      {/* Main chat panel */}
      <div className="h-[calc(100vh-320px)] min-h-[620px] bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col">
        <MainContainer className="flex-1 flex overflow-hidden w-full h-full border-none">

          {/* Sidebar */}
          <Sidebar position="left" scrollable={true} className="border-r border-slate-100 w-full xl:w-1/3">
            {/* Tab switcher */}
            <div className="flex border-b border-slate-100">
              {['open', 'resolved'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setActiveSessionId(null); }}
                  className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-[#003B4A] text-[#003B4A]'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab === 'open' ? `Open (${openList.length})` : `Resolved (${resolvedList.length})`}
                </button>
              ))}
            </div>

            <ConversationList>
              {displayList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm font-bold">
                  {activeTab === 'open' ? 'No active sessions right now.' : 'No resolved sessions yet.'}
                </div>
              ) : (
                displayList.map((session, index) => (
                  <Conversation
                    key={session.id}
                    name={
                      <span className="flex items-center gap-1.5">
                        {hasUnread(session) && (
                          <span className="inline-block h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                        )}
                        {sessionLabel(session, index)}
                      </span>
                    }
                    lastSenderName={
                      session.messages?.[session.messages.length - 1]?.sender === 'admin'
                        ? 'You'
                        : 'User'
                    }
                    info={
                      session.messages?.[session.messages.length - 1]?.text?.substring(0, 35) ||
                      'New session'
                    }
                    active={activeSessionId === session.id}
                    onClick={() => setActiveSessionId(session.id)}
                    unreadCnt={hasUnread(session) ? 1 : 0}
                  >
                    <Avatar
                      src={`https://ui-avatars.com/api/?name=U&background=0D8ABC&color=fff`}
                      name="User"
                    />
                  </Conversation>
                ))
              )}
            </ConversationList>
          </Sidebar>

          {/* Chat area */}
          {activeSession ? (
            <ChatContainer>
              <ConversationHeader>
                <ConversationHeader.Back onClick={() => setActiveSessionId(null)} />
                <Avatar src="https://ui-avatars.com/api/?name=U&background=0D8ABC&color=fff" name="User" />
                <ConversationHeader.Content
                  userName={
                    activeSession.userId
                      ? `Registered user (${activeSession.userId.slice(0, 8)}…)`
                      : activeSession.id.substring(0, 20)
                  }
                  info={`Last active: ${new Date(activeSession.lastActive).toLocaleTimeString()}`}
                />
                <ConversationHeader.Actions>
                  {activeTab === 'open' && (
                    <button
                      onClick={() => handleClose(activeSessionId)}
                      title="Close this session"
                      className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-black text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Close
                    </button>
                  )}
                </ConversationHeader.Actions>
              </ConversationHeader>

              <MessageList>
                <div ref={messageListRef} style={{ display: 'contents' }}>
                  {(activeSession.messages || []).map((msg, i) => (
                    <Message
                      key={msg.id || i}
                      model={{
                        message: msg.text,
                        direction: msg.sender === 'admin' ? 'outgoing' : 'incoming',
                        position: 'single',
                      }}
                    />
                  ))}
                </div>
              </MessageList>

              <MessageInput
                placeholder={
                  activeTab === 'resolved'
                    ? 'Session is resolved'
                    : 'Type reply here...'
                }
                onSend={(html, textContent, innerText) =>
                  handleSend(innerText || textContent || html)
                }
                attachButton={false}
                sendButton={true}
                disabled={activeTab === 'resolved'}
              />
            </ChatContainer>
          ) : (
            <div className="flex-1 h-full flex flex-col items-center justify-center gap-3 text-slate-400 bg-slate-50/50">
              <svg className="h-12 w-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm font-bold">Select a conversation to start chatting</p>
            </div>
          )}
        </MainContainer>
      </div>
    </div>
  );
}
