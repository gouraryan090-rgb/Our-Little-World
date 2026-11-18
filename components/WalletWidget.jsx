"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { supabase } from "../lib/supabase";

export default function WalletWidget() {
  const { data: session } = useSession();
  const currentUser =
    session?.user?.name || session?.user?.email?.split("@")[0] || "Aryan";

  const [wallets, setWallets] = useState([]);
  const [rewardToast, setRewardToast] = useState(null);
  const hasCheckedInRef = useRef(false);

  // Get today's & yesterday's date in YYYY-MM-DD (IST/Local)
  const getFormattedDate = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (!currentUser) return;
    handleDailyCheckInAndFetch();
  }, [currentUser]);

  // 1. Daily Login & Streak Calculation
  const handleDailyCheckInAndFetch = async () => {
    const today = getFormattedDate(0);
    const yesterday = getFormattedDate(-1);

    // Fetch both users' wallets
    const { data: allWallets, error } = await supabase
      .from("user_wallets")
      .select("*");

    if (error || !allWallets) return;

    const myWallet = allWallets.find(
      (w) => w.username.toLowerCase() === currentUser.toLowerCase()
    );

    if (myWallet && !hasCheckedInRef.current) {
      hasCheckedInRef.current = true;

      if (myWallet.last_checkin_date !== today) {
        let newStreak = 1;
        // Agar kal login kiya tha toh streak continue hogi
        if (myWallet.last_checkin_date === yesterday) {
          newStreak = myWallet.streak + 1;
        }

        // Day 1 = 50, Day 2 = 60, Day 3 = 70...
        const dailyBonus = 50 + (newStreak - 1) * 10;
        const updatedCoins = myWallet.coins + dailyBonus;

        const { data: updatedRow } = await supabase
          .from("user_wallets")
          .update({
            coins: updatedCoins,
            streak: newStreak,
            last_checkin_date: today,
            updated_at: new Date().toISOString(),
          })
          .eq("username", myWallet.username)
          .select()
          .single();

        if (updatedRow) {
          setWallets(
            allWallets.map((w) =>
              w.username === updatedRow.username ? updatedRow : w
            )
          );
          triggerToast(`Day ${newStreak} Streak! +${dailyBonus} Coins 🔥`);
          return;
        }
      }
    }

    setWallets(allWallets);
  };

  // 2. +2 Coins Per Minute on Web (Only when tab is active/visible)
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(async () => {
      if (document.visibilityState !== "visible") return;

      const { data: latestWallet } = await supabase
        .from("user_wallets")
        .select("*")
        .ilike("username", currentUser)
        .single();

      if (latestWallet) {
        const newTotal = latestWallet.coins + 2;
        await supabase
          .from("user_wallets")
          .update({
            coins: newTotal,
            updated_at: new Date().toISOString(),
          })
          .eq("username", latestWallet.username);

        setWallets((prev) =>
          prev.map((w) =>
            w.username === latestWallet.username ? { ...w, coins: newTotal } : w
          )
        );
      }
    }, 60000); // 60,000 ms = 1 minute

    return () => clearInterval(interval);
  }, [currentUser]);

  const triggerToast = (msg) => {
    setRewardToast(msg);
    setTimeout(() => setRewardToast(null), 4500);
  };

  if (wallets.length === 0) return null;

  return (
    <div className="relative mb-6">
      {/* Daily Reward Popup Toast */}
      <AnimatePresence>
        {rewardToast && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mb-4 px-4 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-sm font-semibold flex items-center justify-between shadow-lg backdrop-blur-md"
          >
            <span>{rewardToast}</span>
            <span className="text-xs opacity-75">Daily Check-in</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dual Scoreboard & Streak Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {wallets.map((user) => {
          const isMe =
            user.username.toLowerCase() === currentUser.toLowerCase();
          return (
            <div
              key={user.username}
              className={`glass rounded-2xl p-4 border flex items-center justify-between transition-all ${
                isMe
                  ? "border-rose/40 bg-rose/5"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-base text-ink">
                    {user.username}
                  </span>
                  {isMe && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose/20 text-rose font-bold">
                      You
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink/50 mt-0.5 font-body">
                  +2 coins/min active
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Streak Badge */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 font-bold text-xs">
                  <span>🔥</span>
                  <span>{user.streak}d</span>
                </div>

                {/* Coins Counter */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-display font-extrabold text-sm">
                  <span>🪙</span>
                  <span>{user.coins}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}