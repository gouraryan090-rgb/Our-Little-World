"use client";

import { useRef, useState } from "react";
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
    
    // Mouse ki position calculate karo (-0.5 to 0.5 ke beech)
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
    <Link href={`/dashboard/${item.id}`} className="block h-full">
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
        className="glass rounded-4xl p-8 h-full relative overflow-hidden group cursor-pointer 
                   hover:shadow-[0_0_40px_rgba(255,77,109,0.3)] transition-shadow duration-500"
      >
        {/* Dynamic Glow Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
        
        {/* 3D Pop-out effect for content */}
        <div style={{ transform: "translateZ(50px)" }} className="relative z-10">
          <h2 className="font-display text-2xl font-bold text-ink mb-2 group-hover:text-rose transition-colors">
            {item.title}
          </h2>
          <p className="font-body text-ink/70 text-sm">{item.desc}</p>
          
          <div className="mt-8 flex items-center text-rose font-semibold text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            Explore &rarr;
          </div>
        </div>
      </motion.div>
    </Link>
  );
}