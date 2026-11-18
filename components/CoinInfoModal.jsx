"use client";

import { motion } from "framer-motion";

export default function CoinInfoModal({ onClose, nextRewardTimer }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md cursor-pointer"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl p-6 bg-white/95 backdrop-blur-xl border border-white shadow-2xl font-body"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪙</span>
            <h3 className="font-display text-xl font-bold text-ink">
              Economy & Coin Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-ink/50 hover:text-ink text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Live Timer Countdown Banner */}
        <div className="mb-4 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between">
          <span className="text-xs font-bold text-amber-900">Next +2 Coins in:</span>
          <span className="font-display font-extrabold text-amber-600 text-sm animate-pulse">
            ⏱️ {nextRewardTimer}s
          </span>
        </div>

        <p className="text-xs text-ink/60 mb-4">
          How you and your partner earn coins and maintain streaks:
        </p>

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center justify-between font-bold text-sm text-amber-900 mb-1">
              <span>🔥 Daily Login Check-in</span>
              <span>50 - 100+ Coins</span>
            </div>
            <p className="text-xs text-ink/70 leading-relaxed">
              Day 1 gives 50 coins. Consecutive days add +10 extra daily. Missing a day resets the streak back to 50!
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose/10 border border-rose/20">
            <div className="flex items-center justify-between font-bold text-sm text-rose-900 mb-1">
              <span>⏱️ Active Web Presence</span>
              <span>+2 Coins / min</span>
            </div>
            <p className="text-xs text-ink/70 leading-relaxed">
              Every 60 seconds you keep the web tab open and active, +2 coins are automatically credited to your wallet.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-2xl bg-rose text-white font-bold text-sm shadow-lg shadow-rose/25 hover:bg-rose/90 transition-all cursor-pointer"
        >
          Got It! ✨
        </button>
      </motion.div>
    </motion.div>
  );
}