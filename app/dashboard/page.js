"use client";

import { motion } from "framer-motion";
import MagneticCard from "../../components/MagneticCard";

const menuItems = [
  { id: "about-aryan", title: "About Aryan", desc: "The story of the boy from Jaipur.", accent: "from-rose/20 to-rose/5" },
  { id: "about-manshi", title: "About Manshi", desc: "The girl who means the world.", accent: "from-lilac/20 to-lilac/5" },
  { id: "how-they-met", title: "How They Met", desc: "Where it all began.", accent: "from-mint/20 to-mint/5" },
  { id: "manshi-expectations", title: "Manshi's Expectations", desc: "What she hopes for.", accent: "from-lilac/20 to-lilac/5" },
  { id: "aryan-expectations", title: "Aryan's Expectations", desc: "What he hopes for.", accent: "from-rose/20 to-rose/5" },
  { id: "manshi-intentions", title: "Manshi's Intentions", desc: "Her true feelings.", accent: "from-lilac/20 to-lilac/5" },
  { id: "aryan-intentions", title: "Aryan's Intentions", desc: "His true feelings.", accent: "from-rose/20 to-rose/5" },
  { id: "gallery", title: "Gallery", desc: "Our memories together.", accent: "from-amber-200/20 to-amber-200/5" },
];

export default function DashboardHome() {
  return (
    <div className="space-y-12 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center pt-8 pb-4"
      >
        <h1 className="font-display text-5xl md:text-6xl font-extrabold text-ink mb-4">
          Our Little <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose to-lilac">World</span>
        </h1>
        <p className="font-accent italic text-ink/60">Select a memory to explore.</p>
      </motion.div>

      {/* Perspective wrapper for 3D effect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8" style={{ perspective: "1000px" }}>
        {menuItems.map((item, index) => (
          <MagneticCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}