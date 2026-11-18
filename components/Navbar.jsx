"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { supabase } from "../lib/supabase";
import CoinInfoModal from "./CoinInfoModal"; // <-- Import kiya new file ko

export default function Navbar({ userName }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [wallets, setWallets] = useState([]);
  const [streakPopup, setStreakPopup] = useState(null);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [nextRewardTimer, setNextRewardTimer] = useState(60); // 60 seconds countdown
  const hasCheckedInRef = useRef(false);

  const currentUser = userName || "Aryan";

  const getFormattedDate = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split("T")[0];
  };

  // 1. Daily Check-in Logic
  useEffect(() => {
    if (!currentUser) return;

    const handleDailyCheckIn = async () => {
      const today = getFormattedDate(0);
      const yesterday = getFormattedDate(-1);

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
          const oldStreak = myWallet.streak || 0;
          let newStreak = 1;

          if (myWallet.last_checkin_date === yesterday) {
            newStreak = oldStreak + 1;
          }

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
            setStreakPopup({ oldStreak, newStreak, bonus: dailyBonus });
            setTimeout(() => setStreakPopup(null), 4500);
            return;
          }
        }
      }
      setWallets(allWallets);
    };

    handleDailyCheckIn();
  }, [currentUser]);

  // 2. Active Tab Timer & +2 Coins logic every 60 seconds
  useEffect(() => {
    if (!currentUser) return;

    const timerInterval = setInterval(() => {
      if (document.visibilityState !== "visible") return;

      setNextRewardTimer((prev) => {
        if (prev <= 1) {
          // Time up! Add +2 coins to Supabase
          updateCoinsInSupabase();
          return 60; // Reset timer back to 60 seconds
        }
        return prev - 1;
      });
    }, 1000); // 1-second tick for smooth countdown display

    return () => clearInterval(timerInterval);
  }, [currentUser]);

  const updateCoinsInSupabase = async () => {
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
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
      await signOut({ redirect: false });
      router.push("/login");
      router.refresh();
    } catch (error) {
      setIsLoggingOut(false);
    }
  };

  const myWalletInfo = wallets.find(
    (w) => w.username.toLowerCase() === currentUser.toLowerCase()
  );

  return (
    <>
      {/* Streak Popup */}
      <AnimatePresence>
        {streakPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setStreakPopup(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.5, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xs rounded-3xl p-6 text-center bg-gradient-to-b from-orange-500/20 via-zinc-900/95 to-zinc-950 border border-orange-500/40 shadow-xl"
            >
              <div className="text-5xl mb-2">🔥</div>
              <p className="text-xs font-bold uppercase text-orange-400 mb-1">Streak Extended!</p>
              <span className="font-display text-4xl font-black text-amber-300">
                {streakPopup.newStreak} Days
              </span>
              <div className="mt-3 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold inline-block">
                +{streakPopup.bonus} Coins
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coin Guide Modal */}
      <AnimatePresence>
        {showCoinModal && (
          <CoinInfoModal
            onClose={() => setShowCoinModal(false)}
            nextRewardTimer={nextRewardTimer}
          />
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 py-4 flex justify-center"
      >
        <div className="glass rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between w-full max-w-5xl shadow-soft">
          <Link href="/dashboard" className="font-display font-bold text-base sm:text-xl text-ink flex items-center gap-2">
            <span className="text-rose">🏠</span>
            <span className="hidden xs:block">Our World</span>
          </Link>

          {myWalletInfo && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 border border-white/60 shadow-xs">
              <div className="flex items-center gap-1 text-orange-500 text-xs font-bold">
                <span>🔥</span>
                <span>{myWalletInfo.streak}d</span>
              </div>
              <span className="text-ink/20">|</span>
              <button
                onClick={() => setShowCoinModal(true)}
                title="Click to view Coin Rules & Live Timer"
                className="flex items-center gap-1 text-amber-600 text-xs font-display font-extrabold hover:scale-105 transition-transform cursor-pointer"
              >
                <span>🪙</span>
                <span>{myWalletInfo.coins}</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-body text-xs sm:text-sm text-ink/70 hidden sm:inline-block">
              Hi, <span className="font-bold text-rose">{userName}</span>
            </span>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-1.5 sm:p-2 rounded-full bg-white/40 border border-white/60 hover:bg-rose/10 hover:text-rose transition-all flex items-center justify-center cursor-pointer"
            >
              {isLoggingOut ? <Loader2 size={16} className="animate-spin text-rose" /> : <LogOut size={16} />}
            </button>
          </div>
        </div>
      </motion.nav>
    </>
  );
}