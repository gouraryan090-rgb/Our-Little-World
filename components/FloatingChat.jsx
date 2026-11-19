"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingChat({ currentUser = "Aryan" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [hasUnread, setHasUnread] = useState(false);
  
  // Reply, Edit & Active Menu States
  const [replyingTo, setReplyingTo] = useState(null);
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editText, setEditText] = useState("");

  const scrollRef = useRef(null);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const cleanCurrentUser = currentUser?.trim().toLowerCase() || "aryan";
  const isAryanLoggedIn = cleanCurrentUser.includes("aryan");
  
  // Partner Name & Avatar Mapping
  const partnerName = isAryanLoggedIn ? "Manshi" : "Aryan";
  const partnerAvatar = isAryanLoggedIn
    ? "https://cdn.phototourl.com/anon/2026-11-16-6754668a-5436-4042-847e-78e5a7ca0c87.jpg"
    : "https://cdn.phototourl.com/anon/2026-11-16-563a4d22-6ffc-437c-b975-20413ec7ef05.png";

  // Real-time syncing with Supabase
  useEffect(() => {
    async function fetchMessages() {
      const { data, error } = await supabase
        .from("couple_chats")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data || []);
      }
    }

    fetchMessages();

    // Supabase Realtime Subscription
    const channel = supabase
      .channel("couple_chats_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "couple_chats" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const incomingMsg = payload.new;
            const incomingSender = incomingMsg.sender?.trim().toLowerCase() || "";

            setMessages((prev) => {
              if (prev.some((msg) => msg.id === incomingMsg.id)) return prev;
              const updated = [...prev, incomingMsg];

              if (!isOpenRef.current && incomingSender !== cleanCurrentUser) {
                setHasUnread(true);
              }

              return updated;
            });
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === payload.new.id ? payload.new : msg))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cleanCurrentUser]);

  // Auto scroll & clear unread when opened
  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  // Send Message with Optional Reply
  async function sendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      sender: currentUser.trim(),
      text: newMessage.trim(),
      is_edited: false,
      reply_to: replyingTo ? { id: replyingTo.id, sender: replyingTo.sender, text: replyingTo.text } : null,
    };

    const { error } = await supabase.from("couple_chats").insert([messageData]);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setNewMessage("");
      setReplyingTo(null);
    }
  }

  // Unsend Message (Delete)
  async function handleDelete(msg) {
    const msgSender = msg.sender?.trim().toLowerCase() || "";
    if (msgSender !== cleanCurrentUser) return;

    const { error } = await supabase
      .from("couple_chats")
      .delete()
      .eq("id", msg.id);

    if (error) {
      console.error("Error deleting message:", error);
    } else {
      setSelectedMsgId(null);
    }
  }

  // Check if edit is within 10 minutes
  function canEdit(msg) {
    const msgSender = msg.sender?.trim().toLowerCase() || "";
    if (msgSender !== cleanCurrentUser) return false;
    if (!msg.created_at) return true;
    
    const msgTime = new Date(msg.created_at).getTime();
    const now = new Date().getTime();
    const diffMinutes = (now - msgTime) / (1000 * 60);

    return diffMinutes <= 10;
  }

  // Save Edited Message
  async function handleSaveEdit(msgId) {
    if (!editText.trim()) return;

    const { error } = await supabase
      .from("couple_chats")
      .update({ text: editText.trim(), is_edited: true })
      .eq("id", msgId);

    if (error) {
      console.error("Error updating message:", error);
    } else {
      setEditingMsgId(null);
      setEditText("");
      setSelectedMsgId(null);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Bubble Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(true);
            setHasUnread(false);
          }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 text-white flex items-center justify-center shadow-[0_8px_30px_rgba(244,63,94,0.35)] border border-white/30 text-2xl transition-all"
        >
          💬
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 border-2 border-[#FDFBF7] rounded-full animate-bounce shadow-md" />
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/60 relative">
              {messages.map((msg, index) => {
                const msgSender = msg.sender?.trim().toLowerCase() || "";
                const isMe = msgSender === cleanCurrentUser;
                const isSelected = selectedMsgId === msg.id;
                const isEditing = editingMsgId === msg.id;

                const isNearBottom = index >= messages.length - 2;

                const timeString = msg.created_at 
                  ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                  : "Just now";

                return (
                  <div key={msg.id} className={`flex flex-col relative ${isMe ? "items-end" : "items-start"}`}>
                    
                    {/* Message Bubble */}
                    <div
                      onClick={() => {
                        setSelectedMsgId(isSelected ? null : msg.id);
                      }}
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-body cursor-pointer transition-all ${
                        isMe
                          ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-br-none shadow-lg shadow-rose-500/25 border border-rose-400/20"
                          : "bg-zinc-900 text-zinc-100 rounded-bl-none border border-white/15 shadow-md"
                      }`}
                    >
                      {/* Quoted Reply Preview Inside Bubble */}
                      {msg.reply_to && (
                        <div className="mb-1.5 p-2 rounded-lg bg-black/30 border-l-2 border-rose-400 text-[11px] text-zinc-300">
                          <p className="font-semibold text-rose-300">
                            {msg.reply_to.sender?.trim().toLowerCase() === cleanCurrentUser ? "You" : partnerName}
                          </p>
                          <p className="truncate text-zinc-400">{msg.reply_to.text}</p>
                        </div>
                      )}

                      {isEditing ? (
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs outline-none border border-white/30"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
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
                            {msg.is_edited && <span className="text-[9px] text-white/70 italic">(edited)</span>}
                            <span className="text-[9px] text-white/80">{timeString}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Popup Menu (Aligned dynamically to respective side) */}
                    {isSelected && !isEditing && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: isNearBottom ? 5 : -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`absolute z-40 bg-zinc-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col py-1.5 text-xs text-white backdrop-blur-xl ${
                          isMe ? "right-0" : "left-0"
                        } ${isNearBottom ? "bottom-full mb-1.5" : "top-full mt-1.5"}`}
                      >
                        <button
                          onClick={() => {
                            setReplyingTo(msg);
                            setSelectedMsgId(null);
                          }}
                          className="px-4 py-2.5 text-left text-zinc-200 hover:bg-white/10 transition-colors flex items-center gap-2 font-medium"
                        >
                          <span>↩️</span> Reply
                        </button>

                        {isMe && canEdit(msg) && (
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

                        {isMe && (
                          <button
                            onClick={() => handleDelete(msg)}
                            className="px-4 py-2.5 text-left text-rose-400 hover:bg-white/10 transition-colors flex items-center gap-2 font-medium"
                          >
                            <span>🗑️</span> Unsend
                          </button>
                        )}
                      </motion.div>
                    )}
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            {/* Active Reply Banner Above Input */}
            {replyingTo && (
              <div className="px-4 py-2 bg-zinc-900/90 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-rose-400 font-bold">↩️ Replying to {replyingTo.sender?.trim().toLowerCase() === cleanCurrentUser ? "yourself" : partnerName}:</span>
                  <span className="text-zinc-400 truncate">{replyingTo.text}</span>
                </div>
                <button 
                  onClick={() => setReplyingTo(null)}
                  className="text-zinc-400 hover:text-white font-bold ml-2 text-sm"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Input Box */}
            <form onSubmit={sendMessage} className="p-3 border-t border-white/10 bg-zinc-900/80 flex gap-2 items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={replyingTo ? "Type a reply..." : "Message..."}
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