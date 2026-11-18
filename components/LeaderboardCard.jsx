"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

export default function LeaderboardCard() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("user_wallets")
        .select("*")
        .order("coins", { ascending: false }); // Sabse zyada coins wala upar rahega

      if (!error && data) {
        setWallets(data);
      }
      setLoading(false);
    };

    fetchLeaderboard();

    // Optional: Realtime update listener taaki coin badhte hi rank live update ho
    const channel = supabase
      .channel("leaderboard_realtime")
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

  if (loading) {
    return (
      <div className="glass rounded-3xl p-6 text-center text-ink/60 text-sm">
        Loading Leaderboard... 🪙
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6 shadow-soft relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <h3 className="font-display text-lg font-bold text-ink">
            Couple Leaderboard
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-800 border border-amber-500/30">
          Live Standings
        </span>
      </div>

      <div className="space-y-3">
        {wallets.map((wallet, index) => {
          const isWinner = index === 0;

          return (
            <motion.div
              key={wallet.id || wallet.username}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-center justify-between p-4 rounded-2xl border transition-all ${
                isWinner
                  ? "bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border-amber-500/30 shadow-sm"
                  : "bg-white/40 border-white/60"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank Badge / Crown */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-sm ${
                    index === 0
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                      : "bg-white/80 text-ink/70 border border-white"
                  }`}
                >
                  {index === 0 ? "👑" : `#${index + 1}`}
                </div>

                <div>
                  <h4 className="font-display font-bold text-ink text-sm sm:text-base capitalize">
                    {wallet.username}
                  </h4>
                  <p className="text-xs text-ink/60 flex items-center gap-1">
                    <span>🔥</span> {wallet.streak} Day Streak
                  </p>
                </div>
              </div>

              {/* Coin Count */}
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 font-display font-extrabold text-sm">
                <span>🪙</span>
                <span>{wallet.coins}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}