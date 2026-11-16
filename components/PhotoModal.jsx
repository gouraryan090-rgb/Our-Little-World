"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function PhotoModal({ photo, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !photo) return null;

  // Portal use kar rahe hain taaki page transition ki animation isko kharab na kare
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md overflow-hidden"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-rose text-white rounded-full transition-colors z-[10000]"
        >
          <X size={24} />
        </button>

        {/* Download Button */}
        <a
          href={photo.src}
          download={photo.name || "photo.jpg"}
          onClick={(e) => e.stopPropagation()} // Taki background close na ho
          className="absolute top-6 left-6 p-3 bg-white/10 hover:bg-rose text-white rounded-full transition-colors z-[10000] flex items-center justify-center group"
          title="Download"
        >
          <Download size={24} className="group-hover:translate-y-0.5 transition-transform" />
        </a>
        
        {/* 100dvh use kiya taaki mobile ke address bar ko ignore karke screen fit ho */}
        <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8" style={{ height: "100dvh" }}>
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            src={photo.src}
            alt={photo.name}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body // Body ke andar inject karo
  );
}