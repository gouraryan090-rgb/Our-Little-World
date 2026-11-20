"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Swords, Handshake } from "lucide-react";
import TicTacToeGame from "../../../../components/games/TicTacToeGame";
import { supabase } from "../../../../lib/supabase";

export default function TicTacToePage() {
  const [stats, setStats] = useState({ aryan: 0, manshi: 0, tie: 0 });

  const fetchStats = async () => {
    const { data } = await supabase.from('game_history').select('winner');
    if (data) {
      setStats({
        aryan: data.filter(g => g.winner === "Aryan").length,
        manshi: data.filter(g => g.winner === "Manshi").length,
        tie: data.filter(g => g.winner === "Tie").length,
      });
    }
  };

  useEffect(() => {
    // Pehli baar data fetch karo
    fetchStats();

    // Real-time subscription lagao taaki naya game khatam hote hi stats update ho
    const channel = supabase
      .channel('history_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'game_history' }, () => {
        fetchStats(); // Jab bhi naya insert ho, dobara fetch karo
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="max-w-4xl mx-auto pt-10 pb-20 flex flex-col items-center">
      <Link 
        href="/dashboard" 
        className="self-start inline-flex items-center gap-2 text-ink/60 hover:text-rose transition-colors mb-6 font-body font-semibold"
      >
        <ArrowLeft size={20} /> Back to Home
      </Link>

      <h1 className="font-display text-4xl md:text-5xl font-extrabold text-ink mb-2">Tic Tac Toe</h1>
      <p className="font-accent italic text-ink/60 mb-8">The ultimate battle of hearts.</p>

      {/* PREMIUM STATS BAR */}
      <div className="flex flex-wrap justify-center gap-4 mb-10 w-full">
        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-3xl shadow-soft border border-blue-100 min-w-[150px]">
          <div className="bg-blue-100 p-2 rounded-full"><Trophy className="text-blue-500" size={24} /></div>
          <div>
            <p className="text-xs text-ink/50 font-bold uppercase tracking-wider">Aryan</p>
            <p className="text-2xl font-extrabold text-blue-500">{stats.aryan} Wins</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-3xl shadow-soft border border-rose-100 min-w-[150px]">
          <div className="bg-rose-100 p-2 rounded-full"><Swords className="text-rose-500" size={24} /></div>
          <div>
            <p className="text-xs text-ink/50 font-bold uppercase tracking-wider">Manshi</p>
            <p className="text-2xl font-extrabold text-rose-500">{stats.manshi} Wins</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-3xl shadow-soft border border-lilac/30 min-w-[150px]">
          <div className="bg-lilac/20 p-2 rounded-full"><Handshake className="text-lilac" size={24} /></div>
          <div>
            <p className="text-xs text-ink/50 font-bold uppercase tracking-wider">Draws</p>
            <p className="text-2xl font-extrabold text-lilac">{stats.tie} Ties</p>
          </div>
        </div>
      </div>

      <TicTacToeGame />
    </div>
  );
}