"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";

export default function LeaderboardPage() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("user_wallets")
        .select("*")
        .order("coins", { ascending: false });

      if (!error && data) {
        setWallets(data);
      }
      setLoading(false);
    };

    fetchLeaderboard();

    const channel = supabase
      .channel("leaderboard_live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_wallets" },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Back Button & Badge Header */}
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

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink mb-1">
          🏆 Couple Leaderboard
        </h1>
        <p className="text-sm text-ink/70">
          Who's leading the coin race and streaks right now?
        </p>
      </div>

      {loading ? (
        <div className="glass rounded-3xl p-8 text-center text-ink/60 text-sm">
          Loading Standings... 🪙
        </div>
      ) : (
        <div className="space-y-3">
          {wallets.map((wallet, index) => {
            const isLeader = index === 0;

            return (
              <motion.div
                key={wallet.id || wallet.username}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                  isLeader
                    ? "bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border-amber-500/30 shadow-sm"
                    : "bg-white/40 border-white/60"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-base ${
                      isLeader
                        ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                        : "bg-white/80 text-ink/70 border border-white"
                    }`}
                  >
                    {isLeader ? "👑" : `#${index + 1}`}
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-ink text-base sm:text-lg capitalize">
                      {wallet.username}
                    </h4>
                    <p className="text-xs text-ink/60 flex items-center gap-1">
                      <span>🔥</span> {wallet.streak} Day Streak
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 font-display font-extrabold text-base">
                  <span>🪙</span>
                  <span>{wallet.coins}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}