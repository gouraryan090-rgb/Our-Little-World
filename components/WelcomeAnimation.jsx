"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

export default function WelcomeAnimation({ userName, onComplete }) {
  // Name decide karo
  const fullName = userName === "Manshi" ? "Welcome Manshi Sharma" : "Welcome Aryan Gour";
  const nameArray = fullName.split("");

  // Animation khatam hone ke baad onComplete call karo
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000); // 4 seconds ka cinematic experience
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Floating particles generate karo (background ke liye)
  const particles = Array.from({ length: 20 });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      
      {/* Expanding Glowing Circle Background */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-gradient-to-br from-rose via-lilac to-mint rounded-full blur-[100px] -z-10"
      />

      {/* Floating Particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            y: "100vh", 
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000), 
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: "-100px", 
            opacity: [0, 1, 0],
          }}
          transition={{ 
            duration: Math.random() * 3 + 2, 
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear"
          }}
          className="absolute w-2 h-2 rounded-full bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        />
      ))}

      {/* Text Container */}
      <div className="relative z-10 text-center flex flex-wrap justify-center max-w-4xl px-4">
        {nameArray.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 100, scale: 0.5, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            transition={{
              duration: 0.8,
              delay: index * 0.06, // Stagger effect
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className={`font-display text-4xl sm:text-6xl md:text-8xl font-extrabold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] ${
              char === " " ? "w-4 sm:w-8" : ""
            }`}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>

      {/* Cinematic glowing line */}
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "80%", opacity: 1 }}
        transition={{ duration: 3, delay: 1 }}
        className="absolute bottom-1/4 h-[2px] bg-gradient-to-r from-transparent via-rose to-transparent blur-sm"
      />
    </div>
  );
}