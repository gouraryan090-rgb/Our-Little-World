"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const FEATURES = [
  {
    id: "bucket-list",
    title: "Our Bucket List",
    description: "Places to travel, food to try, and crazy dreams we will complete together.",
    href: "/dashboard/space/bucket-list",
    icon: "✨",
    badge: "Live",
    color: "from-rose/20 to-pink-500/10 border-rose/30",
  },
  {
    id: "promise-letter",
    title: "Eternal Promise Letter",
    description: "A permanent pact sealed with our real thumbprints—locked forever.",
    href: "#",
    icon: "🖋️",
    badge: "Coming Soon",
    color: "from-amber-500/15 to-yellow-500/5 border-amber-500/20",
    disabled: true,
  },
];

export default function OurSpaceHub() {
  const router = useRouter();
  const [loadingBack, setLoadingBack] = useState(false);
  const [loadingFeatureId, setLoadingFeatureId] = useState(null);

  const handleBack = (e) => {
    e.preventDefault();
    setLoadingBack(true);
    router.push("/dashboard");
  };

  const handleFeatureClick = (e, feature) => {
    e.preventDefault();
    if (feature.disabled) return;
    setLoadingFeatureId(feature.id);
    router.push(feature.href);
  };

  return (
    <div className="max-w-5xl mx-auto pt-10 pb-24 px-4 sm:px-6">
      {/* Back Button with Loading */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <button
          onClick={handleBack}
          disabled={loadingBack}
          className="inline-flex items-center gap-2 text-ink/60 hover:text-rose transition-colors font-body font-semibold cursor-pointer disabled:opacity-50"
        >
          {loadingBack ? (
            <div className="flex items-center gap-2 text-rose">
              <div className="w-4 h-4 border-2 border-rose border-t-transparent rounded-full animate-spin" />
              <span>Returning...</span>
            </div>
          ) : (
            <>
              <span>←</span> Back to Main Story
            </>
          )}
        </button>
      </motion.div>

      {/* Header */}
      <div className="mb-12">
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-rose/10 text-rose border border-rose/20">
          Interactive Playground
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-ink mt-4">
          Our Shared <span className="text-rose">Space</span>
        </h1>
        <p className="font-body text-ink/60 text-base sm:text-lg mt-3 max-w-2xl">
          Beyond our story—a place where we plan, promise, and build our little world together in real time.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEATURES.map((feature, index) => {
          const isThisLoading = loadingFeatureId === feature.id;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {feature.disabled ? (
                <div
                  className={`glass rounded-3xl p-7 border bg-gradient-to-br ${feature.color} opacity-65 cursor-not-allowed h-full flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{feature.icon}</span>
                      <span className="text-xs font-body font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-ink/10 text-ink/60">
                        {feature.badge}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-ink mb-2">
                      {feature.title}
                    </h2>
                    <p className="font-body text-sm text-ink/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  onClick={(e) => handleFeatureClick(e, feature)}
                  className="block h-full group cursor-pointer relative"
                >
                  <div
                    className={`glass rounded-3xl p-7 border bg-gradient-to-br ${feature.color} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between relative overflow-hidden`}
                  >
                    {isThisLoading && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center text-rose font-body font-bold text-base gap-2 z-10">
                        <div className="w-5 h-5 border-2 border-rose border-t-transparent rounded-full animate-spin" />
                        <span>Opening Feature...</span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl group-hover:scale-110 transition-transform">
                          {feature.icon}
                        </span>
                        <span className="text-xs font-body font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose text-white shadow-sm">
                          {feature.badge}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl font-bold text-ink group-hover:text-rose transition-colors mb-2">
                        {feature.title}
                      </h2>
                      <p className="font-body text-sm text-ink/70 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-rose font-body font-bold text-sm">
                      <span>Open Feature</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}