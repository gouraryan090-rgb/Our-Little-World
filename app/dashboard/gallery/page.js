"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ImageIcon, Play, RefreshCw } from "lucide-react"; // <-- RefreshCw import kiya
import Link from "next/link";
import PhotoModal from "../../../components/PhotoModal";
import VideoModal from "../../../components/VideoModal";

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("photos");
  const [data, setData] = useState({ photos: [], videos: [] });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // <-- Naya state
  const [error, setError] = useState(null);
  
  // Modal states
  const [activeVideo, setActiveVideo] = useState(null);
  const [activePhoto, setActivePhoto] = useState(null);

  const fetchDriveData = () => {
    setLoading(true);
    setError(null);
    fetch("/api/drive")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.error) throw new Error(resData.error);
        setData({ photos: resData.photos || [], videos: resData.videos || [] });
        setLoading(false);
        setIsRefreshing(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Media load nahi ho payi. Drive check karo.");
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    fetchDriveData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDriveData();
  };

  const currentItems = activeTab === "photos" ? data.photos : data.videos;

  return (
    <div className="max-w-5xl mx-auto pt-10 pb-20">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-ink/60 hover:text-rose transition-colors mb-8 font-body font-semibold"
      >
        <ArrowLeft size={20} /> Back to Home
      </Link>

      {/* Header with Refresh Button */}
      <div className="flex justify-between items-start mb-12">
        <div className="flex-1 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-5xl md:text-6xl font-extrabold text-ink mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose to-lilac">Gallery</span>
            </h1>
            <p className="font-accent italic text-ink/60">Every picture tells our story.</p>
          </motion.div>
        </div>
        
        {/* Refresh Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={isRefreshing || loading}
          className="mt-2 p-3 bg-white border-2 border-ink/10 hover:border-rose/50 rounded-full shadow-soft hover:shadow-glow transition-all duration-300 text-ink/70 hover:text-rose disabled:opacity-50"
          title="Refresh from Drive"
        >
          <RefreshCw size={24} className={isRefreshing ? "animate-spin" : ""} />
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setActiveTab("photos")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-display font-semibold transition-all duration-300 ${
            activeTab === "photos" ? "bg-rose text-white shadow-glow" : "glass text-ink/60 hover:text-ink"
          }`}
        >
          <ImageIcon size={20} /> Photos
        </button>
        <button
          onClick={() => setActiveTab("videos")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-display font-semibold transition-all duration-300 ${
            activeTab === "videos" ? "bg-rose text-white shadow-glow" : "glass text-ink/60 hover:text-ink"
          }`}
        >
          <Play size={20} /> Videos
        </button>
      </div>

      {/* Loading & Error State */}
      {loading && <div className="text-center py-20 text-ink/50 font-body">Loading from Drive...</div>}
      {error && <div className="text-center py-20 text-rose font-body">{error}</div>}

      {/* Media Grid */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4"
        >
          {currentItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="relative group rounded-2xl overflow-hidden break-inside-avoid glass p-2 cursor-pointer"
              onClick={() => {
                if (activeTab === "videos") setActiveVideo(item);
                else setActivePhoto(item);
              }}
            >
              <div className="relative rounded-xl overflow-hidden bg-ink/5">
                
                {/* PHOTO */}
                {activeTab === "photos" && (
                  <img
                    src={item.src}
                    alt={item.name}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                )}

                {/* VIDEO COVER */}
                {activeTab === "videos" && (
                  <div className="relative aspect-video bg-black flex items-center justify-center">
                    {item.thumbnail ? (
                       <img 
                         src={item.thumbnail} 
                         alt={item.name} 
                         className="w-full h-full object-cover opacity-80"
                       />
                    ) : (
                      <video 
                        src={item.src} 
                        preload="metadata" 
                        className="w-full h-full object-cover opacity-80"
                        muted
                      />
                    )}
                    
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Play size={28} className="text-white fill-white ml-1" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Title overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
                  <p className="text-white font-display font-bold text-sm truncate">{item.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !error && currentItems.length === 0 && (
        <div className="text-center py-20 text-ink/50 font-body">
          Drive folder me abhi koi {activeTab} nahi hai.
        </div>
      )}

      {/* Alag Components Render kar diye (React Portal ke through body me jayenge) */}
      <PhotoModal photo={activePhoto} onClose={() => setActivePhoto(null)} />
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}