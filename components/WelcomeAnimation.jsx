"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

export default function WelcomeAnimation({ userName, onComplete }) {
  const fullName = userName === "Manshi" ? "Welcome Manshi Sharma" : "Welcome Aryan Gour";
  
  // Text ko words me split karo taaki words beech me na tootein
  const words = fullName.split(" ");
  let globalCharCount = 0; // Animation delay sequential rakhne ke liye

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000); // 4 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  const particles = Array.from({ length: 20 });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      
      {/* Background Glow */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-gradient-to-br from-rose via-lilac to-mint rounded-full blur-[100px] -z-10"
      />

      {/* Particles */}
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

      {/* Text Container - Words me wrap kiya */}
      <div className="relative z-10 text-center flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-[90vw] sm:max-w-4xl px-4">
        {words.map((word, wordIndex) => (
          <div key={wordIndex} className="flex flex-nowrap">
            {word.split("").map((char, charIndex) => {
              // Har letter ke liye ek global delay calculate karo
              const delay = globalCharCount * 0.05;
              globalCharCount++;
              
              return (
                <motion.span
                  key={charIndex}
                  initial={{ opacity: 0, y: 50, scale: 0.5, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: delay,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  className="font-display text-5xl sm:text-7xl md:text-8xl font-extrabold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] inline-block"
                >
                  {char}
                </motion.span>
              );
            })}
          </div>
        ))}
      </div>

      {/* Glowing line */}
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "80%", opacity: 1 }}
        transition={{ duration: 3, delay: 1 }}
        className="absolute bottom-1/4 h-[2px] bg-gradient-to-r from-transparent via-rose to-transparent blur-sm"
      />
    </div>
  );
}