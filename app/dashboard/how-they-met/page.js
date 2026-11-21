"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function HowTheyMet() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="max-w-5xl mx-auto pt-10 pb-20 px-4 sm:px-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-ink/60 hover:text-rose transition-colors mb-10 font-body font-semibold"
        >
          <span>←</span> Back to Home
        </Link>
      </motion.div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
        
        {/* LEFT SIDE: Photo (Sticky on Desktop) */}
        <div className="w-full max-w-sm lg:w-1/2 shrink-0 lg:sticky lg:top-28 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full"
          >
            {/* Decorative background blob */}
            <div className="absolute inset-0 bg-rose/20 blur-3xl rounded-full scale-110 -z-10 animate-float" />
            
            <div className="glass p-3 rounded-[2rem] shadow-soft relative overflow-hidden group">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-ink/5 flex items-center justify-center">
                
                {imgError && (
                  <span className="text-ink/40 font-display text-xl text-center px-4">Our First Meet</span>
                )}

                {!imgError && (
                  <img
                    src="https://cdn.phototourl.com/anon/2026-11-21-ff0148ab-4fa4-4846-b88e-1bb3eba3b147.webp" 
                    alt="How They Met"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={() => setImgError(true)}
                  />
                )}
              </div>
            </div>
          </motion.div>
          
          <div className="mt-6 text-center lg:text-left w-full">
            <h2 className="font-display text-2xl font-bold text-ink mb-2">
              Where it all <span className="text-rose italic">began...</span>
            </h2>
            <p className="font-accent text-ink/60">A journey from "Admin Sahab" to forever.</p>
          </div>
        </div>

        {/* RIGHT SIDE: Timeline Story */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2 flex flex-col justify-center relative pl-6 sm:pl-0"
        >
          {/* Vertical Line for Timeline */}
          <div className="absolute left-[15px] sm:left-[15px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-rose/40 via-lilac/40 to-rose/40 opacity-40 rounded-full block" />

          <div className="space-y-8 sm:space-y-12">
            
            {/* Step 1 */}
            <div className="relative pl-8 sm:pl-12">
              <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-rose/20 border-2 border-rose flex items-center justify-center flex shadow-[0_0_15px_rgba(225,29,72,0.4)]">
                <div className="w-3 h-3 rounded-full bg-rose" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink mb-2">The "Admin Sahab" Era</h3>
              <p className="text-ink/70 text-base leading-relaxed font-body">
                It all started in a group chat owned by Aryan's friend, where Aryan was the Admin. Manshi playfully started calling him <span className="font-bold text-rose">"Admin Sahab"</span>. Back then, they barely talked, and their conversations were strictly limited to the group chat.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative pl-8 sm:pl-12">
              <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-lilac/20 border-2 border-lilac flex items-center justify-center flex shadow-[0_0_15px_rgba(201,182,255,0.5)]">
                <div className="w-3 h-3 rounded-full bg-lilac" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink mb-2">A New Space</h3>
              <p className="text-ink/70 text-base leading-relaxed font-body">
                After a long gap of silence, Aryan and his best friend Divy created a new group chat. Divy already knew Manshi and added her. Even there, the conversations between Aryan and Manshi were minimal, just passing interactions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative pl-8 sm:pl-12">
              <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-rose/20 border-2 border-rose flex items-center justify-center flex shadow-[0_0_15px_rgba(225,29,72,0.5)]">
                <div className="w-3 h-3 rounded-full bg-rose" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink mb-2">The First DM</h3>
              <p className="text-ink/70 text-base leading-relaxed font-body">
                One day, when only the two of them were online, Manshi asked Aryan to talk in DMs. He agreed, but being shy, he didn't text first. Later, when Manshi pushed him to finally message her, he gave in. That was the very first time they actually talked in private, and slowly, the conversation never stopped.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative pl-8 sm:pl-12">
              <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-rose flex items-center justify-center flex shadow-[0_0_20px_rgba(225,29,72,0.8)]">
                <span className="text-white text-xs">❤️</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-rose mb-2 mt-4">From Friends to Soulmates</h3>
              <div className="glass rounded-2xl p-5 sm:p-6 border border-rose/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose/5 to-transparent -z-10" />
                <p className="text-ink/80 text-base leading-relaxed font-body">
                  They quickly became the best of friends. But somewhere around the end of March 2026, that beautiful friendship quietly blossomed into deep love. They fell for each other, hard. And today, they are the happiest they've ever been, right by each other's side.
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}