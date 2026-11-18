"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function AryansExpectations() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="max-w-5xl mx-auto pt-10 pb-20 px-4 sm:px-6">
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
                  <span className="text-ink/40 font-display text-xl text-center px-4">Aryan's Expectations</span>
                )}

                {!imgError && (
                  <img
                    src="https://dummyimage.com/600x800/fce7f3/9f1239.png&text=Aryan's+Expectations" 
                    alt="Aryan's Expectations"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={() => setImgError(true)}
                  />
                )}
              </div>
            </div>
          </motion.div>
          
          <div className="mt-6 text-center lg:text-left w-full">
            <h2 className="font-display text-2xl font-bold text-ink mb-2">
              Aryan's <span className="text-rose italic">Heart & Hope</span>
            </h2>
            <p className="font-accent text-ink/60">What he expects and dreams of...</p>
          </div>
        </div>

        {/* RIGHT SIDE: Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2 flex flex-col justify-center"
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-ink mb-6">
            Aryan's <span className="text-rose">Expectations</span>
          </h1>

          <div className="glass rounded-3xl p-6 md:p-8 space-y-6 text-base sm:text-lg text-ink/80 leading-relaxed font-body border border-rose/15 shadow-sm">
            <p>
              Aryan doesn’t expect Manshi to blindly agree with everything he says. He just wants her to understand the things that truly matter. More than anything, he wishes that Manshi could understand his unsaid thoughts and feelings even without him having to explain them out loud.
            </p>
            <p>
              He expects transparency—if anything he says or does ever upsets her, he wants her to be open and tell him right away. Whenever she feels angry, hurt, or annoyed for any reason, he hopes she will share it with him instead of keeping it to herself.
            </p>
            <p>
              He also longs for a little more trust from her, something he feels is missing right now. He wants her to call him her own completely, keeping him close to her heart.
            </p>
            <p>
              Whenever he makes a mistake, he expects her to point it out honestly and even scold him if needed to keep him on the right track. Above all, his biggest boundary is simple: in any argument or conversation between the two of them, no third person should ever be involved. They should always be enough for each other.
            </p>

            <p className="font-accent italic text-rose font-semibold text-xl pt-4 border-t border-rose/20 mt-4">
              "No third persons, no doubts—just you, me, and a love that understands everything." ❤️
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}