"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function MagneticCard({ item, index }) {
  const ref = useRef(null);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current || isNavigating) return;
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
    <Link 
      href={`/dashboard/${item.id}`} 
      className="block h-full perspective-1000"
      onClick={() => setIsNavigating(true)}
    >
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
        className={`glass rounded-[2rem] p-6 sm:p-8 h-full relative overflow-hidden group cursor-pointer shadow-soft hover:shadow-glow transition-all duration-500 ${isNavigating ? "scale-95 opacity-80" : ""}`}
      >
        {/* Loading Overlay on Click */}
        {isNavigating && (
          <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-[2rem]">
            <Loader2 className="animate-spin text-rose w-8 h-8" />
          </div>
        )}

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