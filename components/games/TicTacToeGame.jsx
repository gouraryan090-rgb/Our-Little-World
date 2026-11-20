"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, UserPlus, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useSession } from "next-auth/react";

export default function TicTacToeGame() {
  const { data: session } = useSession();
  const myName = session?.user?.name || "Aryan"; 
  const partnerName = myName === "Aryan" ? "Manshi" : "Aryan";
  const mySign = myName === "Aryan" ? "X" : "O";

  const [gameState, setGameState] = useState("idle"); 
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [turn, setTurn] = useState("");
  const [winner, setWinner] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const timerRef = useRef(null);

  const parseBoard = (boardData) => {
    if (!boardData) return ["", "", "", "", "", "", "", "", ""];
    if (typeof boardData === 'string') {
      try { 
        const parsed = JSON.parse(boardData);
        return Array.isArray(parsed) && parsed.length === 9 ? parsed : ["", "", "", "", "", "", "", "", ""];
      } 
      catch (e) { return ["", "", "", "", "", "", "", "", ""]; }
    }
    if (Array.isArray(boardData)) return boardData;
    return ["", "", "", "", "", "", "", "", ""];
  };

  useEffect(() => {
    if (!gameId) return;
    const channel = supabase
      .channel('game_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games', filter: `id=eq.${gameId}` }, (payload) => {
        const newGame = payload.new;
        setBoard(parseBoard(newGame.board));
        setTurn(newGame.turn);
        setWinner(newGame.winner);
        if (newGame.status === 'playing') setGameState("playing");
        if (newGame.status === 'finished') setGameState("finished");
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [gameId]);

  useEffect(() => {
    if (gameState === "playing" && turn === myName) {
      setTimeLeft(60);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { handleTimeOut(); return 60; }
          return prev - 1;
        });
      }, 1000);
    } else { clearInterval(timerRef.current); }
    return () => clearInterval(timerRef.current);
  }, [turn, gameState, myName]);

  const handleTimeOut = async () => {
    const emptyIndices = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    if (emptyIndices.length > 0) {
      const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      await makeMove(randomIndex);
    }
  };

  const invitePartner = async () => {
    setGameState("inviting");
    const firstTurn = Math.random() > 0.5 ? myName : partnerName;

    const { data } = await supabase.from('games').insert([{
      player1_email: myName,
      player2_email: partnerName,
      status: 'waiting',
      board: JSON.stringify(["", "", "", "", "", "", "", "", ""]),
      turn: firstTurn,
      player1_sign: "X",
      player2_sign: "O"
    }]).select().single();

    if (data) {
      setGameId(data.id);
      setTurn(firstTurn);
    }
  };

  useEffect(() => {
    if (gameState === "idle") {
      const channel = supabase
        .channel('invites')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'games' }, (payload) => {
          const newGame = payload.new;
          if (newGame.player2_email === myName && newGame.status === 'waiting') {
            setGameId(newGame.id);
            setGameState("invited");
            setBoard(parseBoard(newGame.board));
            setTurn(newGame.turn);
          }
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [gameState, myName]);

  const acceptInvite = async () => {
    setGameState("playing");
    await supabase.from('games').update({ status: 'playing' }).eq('id', gameId);
  };

  const makeMove = async (index) => {
    if (board[index] || turn !== myName || gameState !== "playing") return;

    const newBoard = [...board];
    newBoard[index] = mySign;
    
    setBoard(newBoard);
    setTurn(turn === "Aryan" ? "Manshi" : "Aryan");

    const winPattern = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    let gameWinner = null;
    for (let i = 0; i < winPattern.length; i++) {
      const [a, b, c] = winPattern[i];
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        gameWinner = myName;
        break;
      }
    }
    
    if (!gameWinner && newBoard.every(cell => cell !== "")) gameWinner = "Tie";

    const nextTurn = turn === "Aryan" ? "Manshi" : "Aryan";

    await supabase.from('games').update({
      board: JSON.stringify(newBoard),
      turn: nextTurn,
      winner: gameWinner,
      status: gameWinner ? 'finished' : 'playing'
    }).eq('id', gameId);

    if (gameWinner) {
      await supabase.from('game_history').insert([{ winner: gameWinner }]);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[450px]">
      
      {gameState === "idle" && (
        <motion.button 
          onClick={invitePartner}
          className="mt-10 px-10 py-5 bg-gradient-to-r from-rose to-lilac text-white rounded-full font-display font-extrabold text-2xl shadow-xl hover:scale-105 transition-transform"
        >
          Connect to {partnerName}
        </motion.button>
      )}

      {gameState === "inviting" && (
        <div className="mt-20 flex flex-col items-center">
          <Loader2 className="animate-spin text-rose w-16 h-16 mb-6" />
          <p className="font-display text-2xl text-ink font-bold animate-pulse">
            Waiting for {partnerName}...
          </p>
        </div>
      )}

      {gameState === "invited" && (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mt-20 flex flex-col items-center bg-white p-10 rounded-[3rem] shadow-2xl">
          <UserPlus size={60} className="text-rose mb-6" />
          <p className="font-display text-3xl font-bold mb-8 text-ink">{partnerName} wants to play!</p>
          <button onClick={acceptInvite} className="px-8 py-4 bg-mint text-ink rounded-full font-display font-extrabold text-xl shadow-lg hover:scale-105 transition-transform">Accept & Play</button>
        </motion.div>
      )}

      {/* PLAYING STATE - Colourful Board without Black Borders */}
      {gameState === "playing" && (
        <div className="flex flex-col items-center w-full mt-4">
          
          <div className="mb-8 flex items-center gap-4 bg-white/60 backdrop-blur-md px-8 py-3 rounded-full shadow-soft">
            <p className="text-xl font-bold font-display">
              Turn: <span className={turn === myName ? "text-blue-600" : "text-rose-500"}>{turn}</span>
            </p>
            {turn === myName && (
              <p className="text-sm font-bold text-ink/70 bg-yellow-100 px-4 py-1 rounded-full">
                ⏳ {timeLeft}s
              </p>
            )}
          </div>
          
          {/* Soft Pastel Board */}
          <div className="bg-white/40 backdrop-blur-lg p-4 sm:p-6 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {board.map((square, index) => {
                const isHoverable = !square && turn === myName;
                return (
                  <motion.button
                    key={index}
                    onClick={() => makeMove(index)}
                    whileHover={isHoverable ? { scale: 1.05 } : {}}
                    whileTap={isHoverable ? { scale: 0.95 } : {}}
                    className={`w-24 h-24 sm:w-32 sm:h-32 rounded-[1.5rem] text-6xl sm:text-7xl flex items-center justify-center transition-all duration-300 group shadow-sm
                      ${!square ? "bg-white/80 hover:bg-white cursor-pointer" : "bg-white cursor-default shadow-md"}
                    `}
                  >
                    {square ? (
                      <motion.span 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`font-display font-extrabold drop-shadow-lg ${square === "X" ? "text-blue-500" : "text-rose-500"}`}
                      >
                        {square}
                      </motion.span>
                    ) : (
                      // Hover pe halka sa sign
                      <span className={`opacity-0 group-hover:opacity-20 font-display font-extrabold text-6xl sm:text-7xl transition-opacity duration-200 ${mySign === "X" ? "text-blue-500" : "text-rose-500"}`}>
                        {turn === myName ? mySign : ""}
                      </span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {gameState === "finished" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="mt-16 flex flex-col items-center bg-white p-12 rounded-[3rem] shadow-2xl"
        >
          {winner === "Tie" ? (
            <h2 className="text-5xl font-display font-extrabold text-lilac mb-6">It's a Tie! 🤝</h2>
          ) : winner === myName ? (
            <motion.h2 animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-6xl font-display font-extrabold text-green-500 mb-6 drop-shadow-xl">You Won! 🎉</motion.h2>
          ) : (
            <h2 className="text-5xl font-display font-extrabold text-rose-500 mb-6">You Lost! 💔</h2>
          )}
          <button onClick={() => window.location.reload()} className="px-8 py-4 bg-gradient-to-r from-rose to-lilac text-white rounded-full font-display font-extrabold text-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
            <RotateCcw size={24} /> Rematch
          </button>
        </motion.div>
      )}
    </div>
  );
}