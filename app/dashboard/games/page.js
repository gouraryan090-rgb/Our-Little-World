"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Gamepad2, Play } from "lucide-react";

export default function GamesPage() {
  // Future me naye games yaha add honge
  const gamesList = [
    {
      id: "tic-tac-toe",
      title: "Tic Tac Toe",
      desc: "The classic battle of X and O. Who will win this time?",
      icon: <Gamepad2 size={48} className="text-blue-500" />,
      color: "from-blue-100 to-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      href: "/dashboard/games/tic-tac-toe"
    },
    // {
    //   id: "connect-4",
    //   title: "Connect 4",
    //   desc: "Coming soon...",
    //   icon: <CircleDashed size={48} className="text-yellow-500" />,
    //   color: "from-yellow-100 to-yellow-50",
    //   borderColor: "border-yellow-200",
    //   textColor: "text-yellow-600",
    //   href: "#"
    // }
  ];

  return (
    <div className="max-w-5xl mx-auto pt-10 pb-20">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-ink/60 hover:text-rose transition-colors mb-10 font-body font-semibold"
        >
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="font-display text-5xl md:text-6xl font-extrabold text-ink mb-4">
          Our Play <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose to-lilac">Zone</span>
        </h1>
        <p className="font-accent italic text-ink/60 text-lg">
          Where our love meets a little healthy competition.
        </p>
      </motion.div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {gamesList.map((game, index) => (
          <Link key={game.id} href={game.href}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`relative group rounded-[2rem] p-8 bg-white border ${game.borderColor} shadow-soft hover:shadow-glow transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

              {/* Icon */}
              <div className={`w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6 border ${game.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                {game.icon}
              </div>

              {/* Text Content */}
              <h2 className={`font-display text-2xl font-bold mb-2 ${game.textColor}`}>
                {game.title}
              </h2>
              <p className="font-body text-ink/60 text-sm flex-grow">
                {game.desc}
              </p>

              {/* Play Button Indicator */}
              <div className={`mt-6 flex items-center gap-2 font-bold text-sm ${game.textColor} opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300`}>
                <Play size={16} fill="currentColor" /> Play Now
              </div>
            </motion.div>
          </Link>
        ))}

        {/* Coming Soon Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative group rounded-[2rem] p-8 bg-white/50 border-2 border-dashed border-ink/10 flex flex-col items-center justify-center min-h-[250px] opacity-70"
        >
          <Gamepad2 size={48} className="text-ink/20 mb-4" />
          <p className="font-display font-bold text-ink/40">More games coming soon...</p>
        </motion.div>
      </div>
    </div>
  );
}