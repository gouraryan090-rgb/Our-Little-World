"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingChat({ currentUser = "Aryan" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [hasUnread, setHasUnread] = useState(false);
  
  // Edit & Active Menu States
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editText, setEditText] = useState("");

  const scrollRef = useRef(null);

  const isAryanLoggedIn = currentUser?.toLowerCase().includes("aryan");
  const partnerName = isAryanLoggedIn ? "Manshi" : "Aryan";
  const partnerAvatar = isAryanLoggedIn
    ? "https://cdn.phototourl.com/anon/2026-11-16-6754668a-5436-4042-847e-78e5a7ca0c87.jpg"
    : "https://cdn.phototourl.com/anon/2026-11-16-563a4d22-6ffc-437c-b975-20413ec7ef05.png";

  // Real-time messages fetch
  useEffect(() => {
    const q = query(collection(db, "couple_chats"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));

      if (isOpen === false && msgs.length > messages.length) {
        setHasUnread(true);
      }
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [isOpen, messages.length]);

  // Auto scroll
  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  // Send Message
  async function sendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "couple_chats"), {
      sender: currentUser,
      text: newMessage.trim(),
      createdAt: serverTimestamp(),
      isEdited: false,
    });

    setNewMessage("");
  }

  // Delete / Unsend Message (Sirf apna message)
  async function handleDelete(msg) {
    if (msg.sender !== currentUser) return;
    try {
      await deleteDoc(doc(db, "couple_chats", msg.id));
      setSelectedMsgId(null);
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  }

  // Check if edit is within 10 minutes
  function canEdit(msg) {
    if (msg.sender !== currentUser) return false;
    if (!msg.createdAt) return true;
    
    const msgTime = msg.createdAt.toDate ? msg.createdAt.toDate().getTime() : new Date(msg.createdAt).getTime();
    const now = new Date().getTime();
    const diffMinutes = (now - msgTime) / (1000 * 60);

    return diffMinutes <= 10;
  }

  // Save Edited Message
  async function handleSaveEdit(msgId) {
    if (!editText.trim()) return;
    try {
      await updateDoc(doc(db, "couple_chats", msgId), {
        text: editText.trim(),
        isEdited: true,
      });
      setEditingMsgId(null);
      setEditText("");
      setSelectedMsgId(null);
    } catch (error) {
      console.error("Error updating message: ", error);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Bubble Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(true);
            setHasUnread(false);
          }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 text-white flex items-center justify-center shadow-[0_0_25px_rgba(244,63,94,0.4)] border border-white/20 text-2xl"
        >
          💬
          {hasUnread && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-zinc-950 rounded-full animate-bounce" />
          )}
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[360px] sm:w-[390px] h-[520px] rounded-3xl bg-zinc-950/95 border border-white/15 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 bg-zinc-900/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 shadow-inner">
                  <img
                    src={partnerAvatar}
                    alt={partnerName}
                    className="w-full h-full rounded-full object-cover bg-zinc-900"
                  />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-sm tracking-wide">
                    {partnerName}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 border border-white/15 text-zinc-200 hover:text-white flex items-center justify-center text-xs transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/60">
              {messages.map((msg) => {
                const isMe = msg.sender === currentUser;
                const isSelected = selectedMsgId === msg.id;
                const isEditing = editingMsgId === msg.id;

                const timeString = msg.createdAt?.toDate 
                  ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                  : "Just now";

                return (
                  <div key={msg.id} className={`flex flex-col relative ${isMe ? "items-end" : "items-start"}`}>
                    
                    {/* Message Bubble */}
                    <div
                      onClick={() => {
                        if (isMe) {
                          setSelectedMsgId(isSelected ? null : msg.id);
                        }
                      }}
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-body transition-all ${
                        isMe ? "cursor-pointer" : ""
                      } ${
                        isMe
                          ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-br-none shadow-lg shadow-rose-500/25 border border-rose-400/20"
                          : "bg-zinc-900 text-zinc-100 rounded-bl-none border border-white/15 shadow-md"
                      }`}
                    >
                      {isEditing ? (
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs outline-none border border-white/30"
                            autoFocus
                          />
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => setEditingMsgId(null)}
                              className="text-[11px] text-zinc-300 hover:text-white px-2 py-0.5"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => handleSaveEdit(msg.id)}
                              className="text-[11px] bg-white text-zinc-950 px-2.5 py-0.5 rounded-md font-bold shadow"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="leading-relaxed">{msg.text}</p>
                          <div className="flex items-center gap-1.5 justify-end mt-1">
                            {msg.isEdited && <span className="text-[9px] text-white/70 italic">(edited)</span>}
                            <span className="text-[9px] text-white/80">{timeString}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Popup Menu (Edit & Unsend) */}
                    {isSelected && isMe && !isEditing && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="absolute z-30 mt-1.5 bg-zinc-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col py-1.5 text-xs text-white right-0 top-full backdrop-blur-xl"
                      >
                        {canEdit(msg) && (
                          <button
                            onClick={() => {
                              setEditingMsgId(msg.id);
                              setEditText(msg.text);
                              setSelectedMsgId(null);
                            }}
                            className="px-4 py-2.5 text-left text-zinc-200 hover:bg-white/10 transition-colors flex items-center gap-2 font-medium"
                          >
                            <span>✏️</span> Edit Message
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(msg)}
                          className="px-4 py-2.5 text-left text-rose-400 hover:bg-white/10 transition-colors flex items-center gap-2 font-medium"
                        >
                          <span>🗑️</span> Unsend
                        </button>
                      </motion.div>
                    )}
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            {/* Input Box */}
            <form onSubmit={sendMessage} className="p-3 border-t border-white/10 bg-zinc-900/80 flex gap-2 items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message..."
                className="flex-1 px-4 py-2.5 rounded-full bg-zinc-950 border border-white/15 text-white placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:border-rose-500 transition-colors shadow-inner"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-xs transition-all shadow-md shadow-rose-500/30"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}