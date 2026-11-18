"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

export default function MaintenanceGuard() {
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // 1. Initial fetch (Non-blocking)
    const checkStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("app_config")
          .select("is_maintenance")
          .eq("id", 1)
          .single();

        if (!error && data && isMounted) {
          setIsMaintenance(Boolean(data.is_maintenance));
        }
      } catch (err) {
        console.error("Maintenance check error:", err);
      }
    };

    checkStatus();

    // 2. Realtime listener
    const channel = supabase
      .channel("maintenance_watcher")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "app_config",
          filter: "id=eq.1",
        },
        (payload) => {
          if (payload && payload.new && isMounted) {
            setIsMaintenance(Boolean(payload.new.is_maintenance));
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <AnimatePresence>
      {isMaintenance && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-2xl select-none"
        >
          {/* Ambient Glow */}
          <div className="absolute w-72 h-72 bg-rose-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute w-72 h-72 bg-amber-500/15 rounded-full blur-[100px] translate-x-20 translate-y-20 pointer-events-none" />

          {/* Main Card */}
          <motion.div
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="relative w-full max-w-md rounded-3xl p-8 text-center bg-zinc-900/90 border border-white/15 shadow-[0_0_60px_rgba(244,63,94,0.2)] overflow-hidden"
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center text-4xl shadow-inner"
            >
              🛠️
            </motion.div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Maintenance Mode</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Developer is working on the web
            </h2>

            <p className="font-body text-sm sm:text-base text-zinc-300 leading-relaxed mb-6">
              We are currently making things even better behind the scenes. Please check the website after some time!
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-zinc-400 mb-2">
                Need urgent access or have a query?
              </p>
              <a
                href="https://instagram.com/thearyangour_"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-500/25 hover:opacity-90 transition-opacity"
              >
                <span>📸</span>
                <span>DM @thearyangour_</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}