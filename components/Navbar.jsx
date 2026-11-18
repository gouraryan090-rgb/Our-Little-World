"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react"; // <-- Loader2 import kiya
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react"; // <-- useState import kiya

export default function Navbar({ userName }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false); // <-- Logout loading state

  const handleLogout = async () => {
    if (isLoggingOut) return; // Double click se bachne ke liye
    setIsLoggingOut(true);

    try {
      // Purana custom logout (isse cookie clear hoga)
      await fetch("/api/logout", { method: "POST" });
      
      // Naya NextAuth logout (isse Google session clear hoga)
      await signOut({ 
        redirect: false, // NextAuth ko khud redirect karne se roka
      });

      // Manual redirect
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false); // Error aaye toh wapas normal kar do
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 py-4 flex justify-center"
    >
      <div className="glass rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between w-full max-w-5xl shadow-soft">
        
        {/* Logo / Home Link */}
        <Link href="/dashboard" className="font-display font-bold text-lg sm:text-xl text-ink flex items-center gap-2 hover:text-rose transition-colors group">
          <div className="bg-rose/10 p-1.5 sm:p-2 rounded-full group-hover:bg-rose/20 transition-colors">
            <span className="text-rose">🏠</span>
          </div>
          <span className="hidden xs:block">Our World</span>
        </Link>

        {/* Right Side (Name + Logout) */}
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="font-body text-xs sm:text-sm text-ink/70">
            Hi, <span className="font-bold text-rose">{userName}</span>
          </span>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="p-1.5 sm:p-2 rounded-full bg-white/40 border border-white/60 hover:bg-rose/10 hover:text-rose transition-all duration-300 group shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[32px] min-h-[32px]"
            title="Logout"
          >
            {isLoggingOut ? (
              <Loader2 size={16} className="animate-spin text-rose sm:w-[18px] sm:h-[18px]" />
            ) : (
              <LogOut size={16} className="sm:w-[18px] sm:h-[18px] group-hover:-translate-x-1 transition-transform" />
            )}
          </button>
        </div>
        
      </div>
    </motion.nav>
  );
}