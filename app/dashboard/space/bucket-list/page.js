"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react"; // NextAuth session hook
import { supabase } from "../../../../lib/supabase";

const CATEGORIES = ["All", "Travel", "Food", "Dates", "Other"];

const CATEGORY_ICONS = {
  Travel: "✈️",
  Food: "🍜",
  Dates: "🕯️",
  Other: "✨",
};

export default function BucketListPage() {
  const { data: session } = useSession();
  
  // Logged in user ka naam automatically set ho jayega (fallback to "Aryan" agar session load na ho)
  const currentUser = session?.user?.name || session?.user?.email?.split("@")[0] || "Aryan";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  // Add Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Travel");

  // Edit States
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Travel");

  // Fetch Bucket List Items
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bucket_list")
      .select("*")
      .order("is_completed", { ascending: true })
      .order("created_at", { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  // Add New Item (Using logged in user automatically)
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const { data, error } = await supabase
      .from("bucket_list")
      .insert([{ title: newTitle.trim(), category: newCategory, added_by: currentUser }])
      .select();

    if (!error && data) {
      setItems([data[0], ...items]);
      setNewTitle("");
      setIsAddOpen(false);
    }
  };

  // Toggle Checkbox
  const toggleComplete = async (id, currentStatus) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, is_completed: !currentStatus } : item
      )
    );

    await supabase
      .from("bucket_list")
      .update({ is_completed: !currentStatus })
      .eq("id", id);
  };

  // Delete Item
  const handleDelete = async (id) => {
    setItems(items.filter((item) => item.id !== id));
    await supabase.from("bucket_list").delete().eq("id", id);
  };

  // Start Editing
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditCategory(item.category);
  };

  // Save Edit
  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;

    setItems(
      items.map((item) =>
        item.id === id ? { ...item, title: editTitle.trim(), category: editCategory } : item
      )
    );
    setEditingId(null);

    await supabase
      .from("bucket_list")
      .update({ title: editTitle.trim(), category: editCategory })
      .eq("id", id);
  };

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const completedCount = items.filter((i) => i.is_completed).length;
  const progressPercent =
    items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100);

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-24 px-4 sm:px-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/dashboard/space"
          className="inline-flex items-center gap-2 text-ink/60 hover:text-rose transition-colors font-body font-semibold"
        >
          <span>←</span> Back to Space
        </Link>

        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-rose/10 text-rose border border-rose/20">
          Our Shared Space ✨
        </span>
      </div>

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-ink">
            Our <span className="text-rose">Bucket List</span>
          </h1>
          <p className="font-body text-ink/60 mt-2">
            Little dreams, chaotic plans, and places we will conquer together.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-rose text-white font-body font-bold px-5 py-3 rounded-2xl shadow-lg shadow-rose/25 hover:bg-rose/90 transition-all cursor-pointer shrink-0"
        >
          <span className="text-xl leading-none">+</span> Add Wish
        </motion.button>
      </div>

      {/* Progress Card */}
      <div className="glass rounded-3xl p-5 mb-8 border border-rose/15">
        <div className="flex justify-between items-center mb-2 text-sm font-body font-semibold">
          <span className="text-ink/70">Memories Unlocked</span>
          <span className="text-rose">
            {completedCount} / {items.length} ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2.5 bg-ink/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6 }}
            className="h-full bg-gradient-to-r from-rose to-pink-500 rounded-full"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full font-body text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === cat
                ? "bg-ink text-white shadow-md"
                : "glass text-ink/70 hover:text-ink border border-white/50"
            }`}
          >
            {cat !== "All" && <span className="mr-1.5">{CATEGORY_ICONS[cat]}</span>}
            {cat}
          </button>
        ))}
      </div>

      {/* Bucket List Items */}
      {loading ? (
        <div className="text-center py-16 text-ink/50 font-body animate-pulse">
          Loading our dreams...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center border border-dashed border-ink/20">
          <p className="font-display text-xl text-ink/60 font-bold mb-2">
            Nothing here yet!
          </p>
          <p className="font-body text-sm text-ink/50">
            Click "+ Add Wish" to add something like "Go to Ayodhya together".
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass rounded-2xl p-4 sm:p-5 border transition-all flex items-center justify-between gap-4 ${
                  item.is_completed
                    ? "border-emerald-500/20 bg-emerald-500/5 opacity-75"
                    : "border-white/60 hover:border-rose/30"
                }`}
              >
                {editingId === item.id ? (
                  /* EDIT MODE */
                  <div className="flex-1 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/70 border border-ink/20 font-body text-ink focus:outline-none focus:border-rose"
                    />
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white/70 border border-ink/20 font-body text-sm text-ink"
                    >
                      {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-2 bg-ink/10 text-ink rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* VIEW MODE */
                  <>
                    <div className="flex items-start sm:items-center gap-3.5 flex-1">
                      {/* Custom Checkbox */}
                      <button
                        onClick={() => toggleComplete(item.id, item.is_completed)}
                        className={`mt-1 sm:mt-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                          item.is_completed
                            ? "bg-rose border-rose text-white"
                            : "border-ink/30 hover:border-rose"
                        }`}
                      >
                        {item.is_completed && (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      {/* Title & Badges */}
                      <div className="flex-1">
                        <p
                          className={`font-body text-base sm:text-lg font-semibold transition-all ${
                            item.is_completed ? "line-through text-ink/40" : "text-ink"
                          }`}
                        >
                          {item.title}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="text-xs font-body font-medium px-2.5 py-0.5 rounded-full bg-white/60 text-ink/70 border border-ink/10">
                            {CATEGORY_ICONS[item.category]} {item.category}
                          </span>
                          <span
                            className={`text-xs font-body font-semibold px-2.5 py-0.5 rounded-full ${
                              item.added_by === "Aryan"
                                ? "bg-blue-500/10 text-blue-700"
                                : "bg-rose/10 text-rose"
                            }`}
                          >
                            Added by {item.added_by}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Edit & Delete Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => startEdit(item)}
                        title="Edit"
                        className="p-2 text-ink/50 hover:text-ink hover:bg-white/60 rounded-xl transition-colors cursor-pointer"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                        className="p-2 text-ink/50 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ADD NEW WISH MODAL */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-display text-2xl font-bold text-ink">
                  Add to Bucket List
                </h3>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="text-ink/50 hover:text-ink text-xl cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4 font-body">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/60 mb-1.5">
                    What do you wanna do?
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Go to Ayodhya together 🛕"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-ink/5 border border-ink/10 text-ink focus:outline-none focus:border-rose"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/60 mb-1.5">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-3 rounded-2xl bg-ink/5 border border-ink/10 text-ink focus:outline-none focus:border-rose"
                    >
                      {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_ICONS[cat]} {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/60 mb-1.5">
                      Added By
                    </label>
                    {/* Non-changeable fixed field showing logged-in user */}
                    <div className="w-full px-4 py-3 rounded-2xl bg-ink/5 border border-ink/10 text-ink font-semibold flex items-center justify-between">
                      <span>{currentUser}</span>
                      <span className="text-xs text-ink/40">🔒</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-rose text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-rose/25 hover:bg-rose/90 transition-all cursor-pointer"
                >
                  Save to Our List ✨
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}