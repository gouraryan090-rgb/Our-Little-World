"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import WelcomeAnimation from "./WelcomeAnimation";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState(null);
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
      setLoggedInUser(data.name); 
    } else {
      setError("Oops! That password doesn't seem right. 💔");
      setShake((s) => s + 1);
      setLoading(false);
    }
  }

  const handleAnimationComplete = () => {
    router.push("/dashboard");
    router.refresh();
  };

  if (loggedInUser) {
    return (
      <WelcomeAnimation 
        userName={loggedInUser} 
        onComplete={handleAnimationComplete} 
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-md mt-16 sm:mt-10"
    >
      <motion.div
        key={shake}
        animate={shake ? { x: [0, -10, 10, -8, 8, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="bg-white border-2 border-ink rounded-[2.5rem] p-8 sm:p-12 shadow-[8px_8px_0px_rgba(15,15,18,1)] relative"
      >
        {/* Hamster Gif Overlapping Top Left */}
        <div className="absolute -top-14 -left-8 sm:-top-16 sm:-left-12">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-ink overflow-hidden bg-[#FCF4ED] shadow-sm">
            <img 
              src="https://res.cloudinary.com/dt79hdebz/image/upload/lovely/defaults/auth_cat_gif.gif" 
              alt="Cute Hamster" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Logo inside Card */}
        <div className="flex justify-center mb-2 mt-4">
          <h2 className="font-display text-3xl font-extrabold text-rose tracking-tight flex items-center gap-1 bg-pink-100 px-4 py-1 rounded-full border border-rose/30">
            O<span className="text-ink">ur</span>W<span className="text-ink">orld</span>
          </h2>
        </div>
        
        <p className="font-body text-center text-ink/70 mb-8 text-sm sm:text-base px-4">
          Sign in to access our private interactive love space
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="text-ink/40" size={20} />
            </div>
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter your secret password..."
              autoFocus
              className="w-full pl-12 pr-12 py-4 rounded-full bg-white border-2 border-ink/20 focus:border-ink font-body text-ink placeholder:text-ink/40 focus:outline-none transition-all duration-300 shadow-sm"
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
                className="text-rose text-sm text-center font-body font-semibold"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full py-4 rounded-full bg-rose text-white border-2 border-ink font-display font-bold text-lg shadow-[4px_4px_0px_rgba(15,15,18,1)] hover:shadow-[2px_2px_0px_rgba(15,15,18,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Unlocking...
              </>
            ) : (
              "Unlock Our World →"
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-ink/10 text-center">
          <p className="text-xs text-ink/40 font-body">
            By entering, you agree that this is a private space for Aryan & Manshi only.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}