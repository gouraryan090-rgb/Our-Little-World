"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Heart, Loader2 } from "lucide-react";
import WelcomeAnimation from "./WelcomeAnimation"; // <-- Import animation

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState(null); // Login hone ke baad user state
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!password || loading) return;

    setLoading(true);
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      const data = await res.json();
      setLoggedInUser(data.name); // Animation show karne ke liye state set
    } else {
      setError("Oops! That password doesn't seem right. 💔");
      setShake((s) => s + 1);
      setLoading(false);
    }
  }

  // Jab animation complete ho jaye tab redirect karo
  const handleAnimationComplete = () => {
    router.push("/dashboard");
    router.refresh();
  };

  // Agar user logged in hai, toh sabse pehle WelcomeAnimation dikhao
  if (loggedInUser) {
    return (
      <WelcomeAnimation 
        userName={loggedInUser} 
        onComplete={handleAnimationComplete} 
      />
    );
  }

  // Warna normal login form dikhao
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-md"
    >
      <motion.div
        key={shake}
        animate={shake ? { x: [0, -12, 12, -8, 8, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="glass rounded-4xl p-8 sm:p-10 shadow-soft"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-6 w-16 h-16 rounded-full bg-gradient-to-br from-rose to-lilac flex items-center justify-center shadow-glow"
        >
          <Heart className="w-8 h-8 text-white fill-white" />
        </motion.div>

        <h1 className="font-display text-3xl sm:text-4xl text-center text-ink mb-2">
          Our Little World
        </h1>
        <p className="font-accent italic text-center text-ink/60 mb-8">
          Just for the two of us.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter your secret password..."
              autoFocus
              className="w-full px-5 py-4 rounded-full bg-white/70 border border-white/60 
                         font-body text-ink placeholder:text-ink/40 
                         focus:outline-none focus:ring-2 focus:ring-rose/50 
                         transition-all duration-300 pr-14"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink transition"
            >
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-rose text-sm text-center font-body"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading && !loggedInUser ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Unlocking...
              </>
            ) : (
              "Unlock Our World →"
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}