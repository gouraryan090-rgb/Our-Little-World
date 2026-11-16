"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LogOut, Home } from "lucide-react";
import Link from "next/link";

export default function Navbar({ userName }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 py-3 sm:py-4 flex justify-center"
    >
      <div className="glass rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between w-full max-w-5xl shadow-soft">
        
        {/* Logo / Home Link */}
        <Link href="/dashboard" className="font-display font-bold text-lg sm:text-xl text-ink flex items-center gap-2 hover:text-rose transition-colors">
          <Home size={18} className="sm:w-5 sm:h-5" />
          <span className="hidden xs:block">Our Little World</span>
        </Link>

        {/* Right Side (Name + Logout) */}
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="font-body text-xs sm:text-sm text-ink/70">
            Hi, <span className="font-semibold text-rose">{userName}</span>
          </span>
          <button
            onClick={handleLogout}
            className="p-1.5 sm:p-2 rounded-full bg-ink/5 hover:bg-rose/10 hover:text-rose transition-all duration-300 group"
            title="Logout"
          >
            <LogOut size={16} className="sm:w-[18px] sm:h-[18px] group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
        
      </div>
    </motion.nav>
  );
}