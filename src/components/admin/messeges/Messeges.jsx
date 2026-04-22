// FILE: src/components/admin/messages/Messages.jsx
//
// Admin Messages panel.
// Left  → conversation list (from ContactUs submissions)
// Right → selected message detail + admin reply
//
// ═══════════════════════════════════════════════════════════════
// DATA STRUCTURE expected from backend:
//
// GET /api/admin/messages
//   → [{ id, senderName, senderEmail, senderPhone, subject,
//         message, createdAt, read, starred, replies: [] }]
//
// POST /api/admin/messages/:id/reply
//   → { body: "reply text" }
//
// PATCH /api/admin/messages/:id/read
// PATCH /api/admin/messages/:id/star
// DELETE /api/admin/messages/:id
//
// ContactUs page should POST to /api/messages on submit.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from "react";
// import { getContactInfo } from '../../../services/adminService';

// ── Mock messages seeded from localStorage contact submissions ──
const MOCK_MESSAGES = [
  {
    id: 1,
    senderName: "Rakib Hossain",
    senderEmail: "rakib@gmail.com",
    senderPhone: "01711111111",
    subject: "Booking Inquiry",
    message:
      "We would like to schedule a family trip to Cox's Bazar in May. Could you please provide availability and pricing details for a group of 5?",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    starred: false,
    replies: [],
  },
  {
    id: 2,
    senderName: "Fatema Begum",
    senderEmail: "fatema@gmail.com",
    senderPhone: "01722222222",
    subject: "Tour Cancellation",
    message:
      "Congratulations! We are pleased to offer you the opportunity to reschedule your tour. Please let us know your preferred dates so we can arrange accordingly.",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
    starred: true,
    replies: [
      {
        id: 101,
        body: "Thank you for reaching out! We have noted your request and will process it shortly.",
        sentAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        fromAdmin: true,
      },
    ],
  },
  {
    id: 3,
    senderName: "Tanvir Ahmed",
    senderEmail: "tanvir@gmail.com",
    senderPhone: "01733333333",
    subject: "Group Booking",
    message:
      "Your application has been shortlisted. We would like to discuss the details of your group booking for the Bandarban trek scheduled for June.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    starred: false,
    replies: [],
  },
  {
    id: 4,
    senderName: "Shahriar Kabir",
    senderEmail: "shahriar@gmail.com",
    senderPhone: "01744444444",
    subject: "Payment Issue",
    message:
      "I made a payment via bKash for booking ID JTR-1234 but have not received a confirmation yet. Could you please look into this?",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    starred: false,
    replies: [],
  },
  {
    id: 5,
    senderName: "Nusrat Jahan",
    senderEmail: "nusrat@gmail.com",
    senderPhone: "01755555555",
    subject: "Women Only Package",
    message:
      "Hello, I am interested in the women-only tour packages. Could you share more details about upcoming Sajek and Kuakata trips specifically for female travelers?",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    starred: true,
    replies: [],
  },
];

// ── Helpers ──────────────────────────────────────────────────────
const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const initials = (name) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "??";

const AVATAR_COLORS = [
  "bg-teal-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-amber-500",
  "bg-emerald-500",
];
const avatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];

// ════════════════════════════════════════════════════════════════
// LEFT PANEL — Conversation List
// ════════════════════════════════════════════════════════════════
const ConversationList = ({
  messages,
  selected,
  onSelect,
  filter,
  setFilter,
  search,
  setSearch,
}) => {
  const filtered = messages
    .filter((m) => {
      if (filter === "Unread") return !m.read;
      if (filter === "Starred") return m.starred;
      return true;
    })
    .filter(
      (m) =>
        m.senderName.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase()) ||
        m.message.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <div className="w-72 flex-shrink-0 border-r border-gray-200 flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-teal-400 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 px-3 py-2.5 border-b border-gray-100">
        {["All", "Unread", "Starred"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer
              ${
                filter === f
                  ? "bg-teal-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 text-xs py-10">
            No messages found.
          </div>
        ) : (
          filtered.map((msg) => (
            <div
              key={msg.id}
              onClick={() => onSelect(msg)}
              className={`px-4 py-3.5 border-b border-gray-100 cursor-pointer transition-colors
                ${selected?.id === msg.id ? "bg-teal-50 border-l-2 border-l-teal-500" : "hover:bg-gray-50 border-l-2 border-l-transparent"}
                ${!msg.read ? "bg-blue-50/30" : ""}`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-2xl ${avatarColor(msg.id)} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white text-xs font-bold">
                    {initials(msg.senderName)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p
                      className={`text-sm truncate ${!msg.read ? "font-extrabold text-gray-900" : "font-semibold text-gray-700"}`}
                    >
                      {msg.senderName}
                    </p>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                      {msg.starred && (
                        <span className="text-amber-400 text-xs">★</span>
                      )}
                      {!msg.starred && (
                        <span className="text-gray-300 text-xs">☆</span>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-0.5">
                    {msg.subject}
                  </p>
                  <p
                    className={`text-xs truncate ${!msg.read ? "font-semibold text-gray-700" : "text-gray-400"}`}
                  >
                    {msg.message}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {timeAgo(msg.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// RIGHT PANEL — Message Detail + Reply
// ════════════════════════════════════════════════════════════════
const MessageDetail = ({
  message,
  onReply,
  onToggleStar,
  onMarkRead,
  onDelete,
}) => {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message?.replies?.length]);

  if (!message)
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="w-24 h-24 bg-teal-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <h3 className="text-xl font-extrabold text-gray-800 mb-2">
          Select a Conversation
        </h3>
        <p className="text-sm text-gray-400">
          Choose a contact from the list to view messages and reply
        </p>
      </div>
    );

  const handleSend = async () => {
    if (!reply.trim()) return;
    setSending(true);
    await onReply(message.id, reply.trim());
    setReply("");
    setSending(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl ${avatarColor(message.id)} flex items-center justify-center`}
          >
            <span className="text-white text-xs font-bold">
              {initials(message.senderName)}
            </span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">
              {message.senderName}
            </p>
            <p className="text-xs text-gray-500">{message.senderEmail}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Star */}
          <button
            onClick={() => onToggleStar(message.id)}
            className={`p-2 rounded-lg transition-colors cursor-pointer hover:bg-gray-100
              ${message.starred ? "text-amber-400" : "text-gray-300 hover:text-amber-400"}`}
            title="Star"
          >
            <span className="text-lg">{message.starred ? "★" : "☆"}</span>
          </button>
          {/* Mark read */}
          <button
            onClick={() => onMarkRead(message.id)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-teal-600 transition-colors cursor-pointer"
            title="Mark as read"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </button>
          {/* Delete */}
          <button
            onClick={() => onDelete(message.id)}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            title="Delete"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sender info card */}
      <div className="mx-6 mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl flex-shrink-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wide text-[10px] mb-0.5">
              From
            </p>
            <p className="font-bold text-gray-800">{message.senderName}</p>
          </div>
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wide text-[10px] mb-0.5">
              Email
            </p>
            <p className="font-medium text-gray-700">{message.senderEmail}</p>
          </div>
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wide text-[10px] mb-0.5">
              Phone
            </p>
            <p className="font-medium text-gray-700">{message.senderPhone}</p>
          </div>
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-wide text-[10px] mb-0.5">
              Received
            </p>
            <p className="font-medium text-gray-700">
              {new Date(message.createdAt).toLocaleString("en-BD")}
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-gray-400 font-semibold uppercase tracking-wide text-[10px] mb-1">
            Subject
          </p>
          <p className="font-bold text-gray-800 text-sm">{message.subject}</p>
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {/* Original message */}
        <div className="flex gap-3">
          <div
            className={`w-8 h-8 rounded-xl ${avatarColor(message.id)} flex items-center justify-center flex-shrink-0 mt-1`}
          >
            <span className="text-white text-[10px] font-bold">
              {initials(message.senderName)}
            </span>
          </div>
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <p className="text-sm text-gray-700 leading-relaxed">
                {message.message}
              </p>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 ml-1">
              {timeAgo(message.createdAt)}
            </p>
          </div>
        </div>

        {/* Replies */}
        {message.replies.map((r) => (
          <div
            key={r.id}
            className={`flex gap-3 ${r.fromAdmin ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1
              ${r.fromAdmin ? "bg-teal-500" : avatarColor(message.id)}`}
            >
              <span className="text-white text-[10px] font-bold">
                {r.fromAdmin ? "AD" : initials(message.senderName)}
              </span>
            </div>
            <div className="flex-1">
              <div
                className={`rounded-2xl px-4 py-3 shadow-sm inline-block max-w-[85%]
                ${
                  r.fromAdmin
                    ? "bg-teal-500 text-white rounded-tr-sm ml-auto"
                    : "bg-white border border-gray-200 text-gray-700 rounded-tl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{r.body}</p>
              </div>
              <p
                className={`text-[10px] text-gray-400 mt-1 ${r.fromAdmin ? "text-right" : "ml-1"}`}
              >
                {r.fromAdmin ? "Admin · " : ""}
                {timeAgo(r.sentAt)}
              </p>
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Reply input */}
      <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex gap-3 items-end">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply..."
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) handleSend();
            }}
            className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:border-teal-400 focus:bg-white transition-colors resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!reply.trim() || sending}
            className="px-5 py-3 bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white text-sm font-bold rounded-2xl transition-colors cursor-pointer flex items-center gap-2 self-end disabled:cursor-not-allowed"
          >
            {sending ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            )}
            Send
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
          Ctrl + Enter to send
        </p>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// MAIN Messages Component
// ════════════════════════════════════════════════════════════════
const Messages = () => {
  // TODO: replace with → GET /api/admin/messages
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const unreadCount = messages.filter((m) => !m.read).length;

  // Mark as read when opened
  const handleSelect = (msg) => {
    setSelected(msg);
    // TODO: PATCH /api/admin/messages/:id/read
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)),
    );
    setSelected((prev) =>
      prev?.id === msg.id ? { ...msg, read: true } : prev,
    );
  };

  // Reply
  const handleReply = async (msgId, body) => {
    // TODO: POST /api/admin/messages/:id/reply  { body }
    await new Promise((r) => setTimeout(r, 600));
    const newReply = {
      id: Date.now(),
      body,
      sentAt: new Date().toISOString(),
      fromAdmin: true,
    };
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, replies: [...m.replies, newReply] } : m,
      ),
    );
    setSelected((prev) =>
      prev ? { ...prev, replies: [...prev.replies, newReply] } : prev,
    );
  };

  // Star toggle
  const handleToggleStar = (msgId) => {
    // TODO: PATCH /api/admin/messages/:id/star
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, starred: !m.starred } : m)),
    );
    setSelected((prev) =>
      prev?.id === msgId ? { ...prev, starred: !prev.starred } : prev,
    );
  };

  // Mark read
  const handleMarkRead = (msgId) => {
    // TODO: PATCH /api/admin/messages/:id/read
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, read: true } : m)),
    );
    setSelected((prev) =>
      prev?.id === msgId ? { ...prev, read: true } : prev,
    );
  };

  // Delete
  const handleDelete = (msgId) => {
    if (!confirm("Delete this message?")) return;
    // TODO: DELETE /api/admin/messages/:id
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    setSelected(null);
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-extrabold text-gray-800">Messages</h2>
          {unreadCount > 0 && (
            <p className="text-xs text-teal-600 font-semibold mt-0.5">
              {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{messages.length} total</span>
          {/* TODO: Add refresh button → re-fetch GET /api/admin/messages */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-teal-600 transition-colors cursor-pointer"
            title="Refresh"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main panel */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white flex h-[600px] shadow-sm">
        {/* Left: conversation list */}
        <ConversationList
          messages={messages}
          selected={selected}
          onSelect={handleSelect}
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
        />

        {/* Right: message detail */}
        <MessageDetail
          message={selected}
          onReply={handleReply}
          onToggleStar={handleToggleStar}
          onMarkRead={handleMarkRead}
          onDelete={handleDelete}
        />
      </div>

      {/* Backend integration notes */}
      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-xs font-bold text-amber-700 mb-2">
          🔧 Backend Integration Notes
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-xs text-amber-600 font-mono">
          <span>GET /api/admin/messages</span>
          <span>POST /api/admin/messages/:id/reply</span>
          <span>PATCH /api/admin/messages/:id/read</span>
          <span>PATCH /api/admin/messages/:id/star</span>
          <span>DELETE /api/admin/messages/:id</span>
          <span>POST /api/messages ← from ContactUs form</span>
        </div>
      </div>
    </div>
  );
};

export default Messages;
