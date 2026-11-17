"use client";

import { motion } from "framer-motion";
import MagneticCard from "../../components/MagneticCard";

const menuItems = [
  { id: "about-aryan", title: "About Aryan", desc: "The story of the boy from Jaipur.", accent: "from-rose/20 to-rose/5", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2jXa0_VF4Lh9r9wWUWLz2UlGyFguYaETL-PhBcU60Hw&s=10" },
  { id: "about-manshi", title: "About Manshi", desc: "The girl who means the world.", accent: "from-lilac/20 to-lilac/5", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-kt367Bjr-iwt-_mqO88R9ZO9W_2slqkiI9d7M7i0Ig&s=10" },
  { id: "how-they-met", title: "How They Met", desc: "Where it all began.", accent: "from-mint/20 to-mint/5", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ9GqCF8mV7awg77o8CJk5KzHyGUkJp-iFIPIaV6XOKw&s=10" },
  { id: "manshi-expectations", title: "Manshi's Expectations", desc: "What she hopes for.", accent: "from-lilac/20 to-lilac/5", image: "https://i.pinimg.com/originals/41/97/f0/4197f0a6016776034bc61c071915d57a.jpg?nii=t" },
  { id: "aryan-expectations", title: "Aryan's Expectations", desc: "What he hopes for.", accent: "from-rose/20 to-rose/5", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk1k8i3v_gOV_v2eNMxaYrgEP81SFocyoxr0zoI_JYjQ&s=10" },
  { id: "manshi-intentions", title: "Manshi's Intentions", desc: "Her true feelings.", accent: "from-lilac/20 to-lilac/5", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4_UdR5P3raummfjIFFGw02zUvPfKvVezMQFXkPg6rAw&s" },
  { id: "aryan-intentions", title: "Aryan's Intentions", desc: "His true feelings.", accent: "from-rose/20 to-rose/5", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAgRYp0He-Bxpip1_zqoPivJ1wja7Lds4OYO6LPwhCYg&s=10" },
  { id: "gallery", title: "Gallery", desc: "Our memories together.", accent: "from-amber-200/20 to-amber-200/5", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYDiDKBtjkONeWLvUJ977NzGP3slOVuwh7rY3Bm8gtyg&s=10" },
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

      {/* pt-12 added so images don't get cut off at the top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-12" style={{ perspective: "1000px" }}>
        {menuItems.map((item, index) => (
          <MagneticCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}