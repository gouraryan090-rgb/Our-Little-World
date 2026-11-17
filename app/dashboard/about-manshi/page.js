"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

// Countdown Component (Aesthetic Version)
function BirthdayCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      let year = now.getFullYear();
      let birthday = new Date(year, 2, 20); // 20 March (Month index 2)

      if (now > birthday) {
        birthday = new Date(year + 1, 2, 20);
      }

      const difference = birthday - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mt-6 w-full relative overflow-hidden rounded-3xl p-5 glass border border-lilac/20 shadow-[0_0_30px_rgba(201,182,255,0.1)] group"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-lilac/20 blur-3xl group-hover:bg-lilac/30 transition-colors duration-500 -z-10" />

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lilac text-xl">🎂</span>
          <h3 className="font-display text-lg text-ink font-bold tracking-wide">
            Manshi's Birthday
          </h3>
        </div>

        <div className="flex w-full justify-between gap-1 sm:gap-3">
          <div className="flex flex-col items-center flex-1">
            <div className="w-full py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-white/60 shadow-sm">
              <span className="font-display text-xl sm:text-2xl font-extrabold text-ink block text-center">{timeLeft.days}</span>
            </div>
            <span className="text-[10px] sm:text-xs font-body text-ink/50 mt-1.5 uppercase tracking-widest font-semibold">Days</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-full py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-white/60 shadow-sm">
              <span className="font-display text-xl sm:text-2xl font-extrabold text-ink block text-center">{timeLeft.hours}</span>
            </div>
            <span className="text-[10px] sm:text-xs font-body text-ink/50 mt-1.5 uppercase tracking-widest font-semibold">Hours</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-full py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-white/60 shadow-sm">
              <span className="font-display text-xl sm:text-2xl font-extrabold text-ink block text-center">{timeLeft.minutes}</span>
            </div>
            <span className="text-[10px] sm:text-xs font-body text-ink/50 mt-1.5 uppercase tracking-widest font-semibold">Mins</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-full py-2.5 rounded-xl bg-lilac/10 backdrop-blur-sm border border-lilac/30 shadow-sm relative overflow-hidden flex justify-center">
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }} 
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 bg-lilac/20"
              />
              <span className="font-display text-xl sm:text-2xl font-extrabold text-lilac relative z-10 block text-center">{timeLeft.seconds}</span>
            </div>
            <span className="text-[10px] sm:text-xs font-body text-lilac mt-1.5 uppercase tracking-widest font-bold">Secs</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AboutManshi() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="max-w-5xl mx-auto pt-10 pb-20">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-ink/60 hover:text-lilac transition-colors mb-10 font-body font-semibold"
        >
          <span>←</span> Back to Home
        </Link>
      </motion.div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
        
        <div className="w-full max-w-sm lg:w-1/2 shrink-0 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, x: -50, rotate: -5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full"
          >
            <div className="absolute inset-0 bg-lilac/20 blur-3xl rounded-full scale-110 -z-10 animate-float" />
            
            <div className="glass p-3 rounded-[2rem] shadow-soft relative overflow-hidden group">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-ink/5 flex items-center justify-center">
                {imgError && <span className="text-ink/40 font-display text-xl">Manshi's Photo</span>}
                {!imgError && (
                  <img
                    src="https://cdn.phototourl.com/anon/2026-11-16-6754668a-5436-4042-847e-78e5a7ca0c87.jpg" 
                    alt="Manshi"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={() => setImgError(true)}
                  />
                )}
              </div>
            </div>
          </motion.div>

          <BirthdayCountdown />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2 flex flex-col justify-center lg:pt-4"
        >
          <h1 className="font-display text-5xl md:text-6xl font-extrabold text-ink mb-4">
            Manshi <span className="text-lilac">Sharma</span>
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-8 text-ink/70 font-body">
            <span className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/60">
              <span className="text-lilac">📍</span> New Delhi, Delhi
            </span>
            
            {/* Instagram Button */}
            <a
              href="https://instagram.com/manshihihihihieee"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-lilac/10 to-rose/10 hover:from-lilac/20 hover:to-rose/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/60 transition-all text-ink/80 hover:text-ink group"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" 
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="text-lilac group-hover:scale-110 transition-transform"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span className="font-semibold text-sm">@manshihihihihieee</span>
            </a>

            {/* Snapchat Button */}
            <a
              href="https://snapchat.com/add/manshisharma_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-yellow-400/10 hover:bg-yellow-400/20 px-4 py-2 rounded-full backdrop-blur-md border border-yellow-400/30 hover:border-yellow-400/50 transition-all text-ink/80 hover:text-ink group shadow-[0_0_15px_rgba(250,204,21,0)] hover:shadow-[0_0_20px_rgba(250,204,21,0.3)]"
            >
              <img 
                src="data:image/png;base64,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" 
                alt="Snapchat"
                className="w-[18px] h-[18px] object-contain group-hover:scale-110 group-hover:-rotate-6 transition-transform drop-shadow-md"
              />
              <span className="font-semibold text-sm">manshisharma_</span>
            </a>
          </div>

          <div className="glass rounded-3xl p-6 md:p-8 space-y-4 text-lg text-ink/80 leading-relaxed font-body">
            <p className="font-display text-6xl text-lilac/30 text-center py-10">
              ?
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}