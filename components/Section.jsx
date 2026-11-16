"use client";

import { motion } from "framer-motion";

export default function Section({ title, content, accent = "rose" }) {
  // Accent colors for different sections
  const accentColors = {
    rose: "text-rose border-rose/20 bg-rose/5",
    lilac: "text-lilac border-lilac/20 bg-lilac/5",
    mint: "text-mint border-mint/20 bg-mint/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-4xl p-8 md:p-10 relative overflow-hidden group"
    >
      {/* Decorative blurred blob inside the card */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-50 transition-transform duration-700 group-hover:scale-150 ${accentColors[accent].split(" ")[2]}`} />

      <div className="relative z-10">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
          <span className={`w-2 h-8 rounded-full ${accentColors[accent].split(" ")[2]}`} />
          {title}
        </h2>
        <div className="font-body text-ink/80 leading-relaxed text-lg space-y-4 whitespace-pre-wrap">
          {content || "Yaha abhi kuch nahi likha hai..."}
        </div>
      </div>
    </motion.div>
  );
}