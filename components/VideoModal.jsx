"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function VideoModal({ video, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !video) return null;

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
          href={video.src}
          download={video.name || "video.mp4"}
          onClick={(e) => e.stopPropagation()} 
          className="absolute top-6 left-6 p-3 bg-white/10 hover:bg-rose text-white rounded-full transition-colors z-[10000] flex items-center justify-center group"
          title="Download"
        >
          <Download size={24} className="group-hover:translate-y-0.5 transition-transform" />
        </a>
        
        <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-8" style={{ height: "100dvh" }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-5xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={video.src}
              controls
              autoPlay
              playsInline
              className="w-full max-h-full object-contain rounded-xl shadow-2xl bg-black"
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}