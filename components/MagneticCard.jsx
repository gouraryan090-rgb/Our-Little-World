"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";

export default function MagneticCard({ item, index }) {
  const ref = useRef(null);
  
  // Mouse position track karne ke liye
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring animation
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Tilt effect (Rotate X aur Y)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link href={`/dashboard/${item.id}`} className="block h-full perspective-1000">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="glass rounded-[2rem] p-6 sm:p-8 h-full relative overflow-hidden group cursor-pointer shadow-soft hover:shadow-glow transition-shadow duration-500"
      >
        {/* Dynamic Glow Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
        
        {/* Content */}
        <div style={{ transform: "translateZ(40px)" }} className="relative z-10 flex flex-col h-full">
          <h2 className="font-display text-2xl font-bold text-ink mb-2 group-hover:text-rose transition-colors">
            {item.title}
          </h2>
          <p className="font-body text-ink/60 text-sm flex-grow">{item.desc}</p>
          
          <div className="mt-6 flex items-center text-rose font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            Explore &rarr;
          </div>
        </div>
      </motion.div>
    </Link>
  );
}