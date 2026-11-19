"use client"; // <-- Client component banaya

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "../../components/Navbar";
import PageTransition from "../../components/PageTransition";
import FloatingChat from "../../components/FloatingChat"; // <-- FloatingChat import kiya
import { Heart, Star, Sparkles } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Agar user login nahi hai, toh login page pe bhej do
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Loading state jab session check ho raha ho
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose"></div>
      </div>
    );
  }

  // Agar session hai, toh dashboard dikhao
  if (session) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#FDFBF7]">
        
        {/* Background Patterns & Decorations */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-rose/15 blur-[100px] opacity-70" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-lilac/20 blur-[120px] opacity-60" />
          <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-mint/10 blur-[80px] opacity-50" />
          
          <div className="absolute top-40 left-[5%] text-rose/20 animate-float">
            <Heart size={40} fill="currentColor" />
          </div>
          <div className="absolute top-1/2 right-[8%] text-yellow-400/30 animate-float" style={{ animationDelay: "1s" }}>
            <Star size={50} fill="currentColor" />
          </div>
          <div className="absolute bottom-32 left-[15%] text-lilac/30 animate-float" style={{ animationDelay: "2s" }}>
            <Sparkles size={36} />
          </div>
          <div className="absolute top-20 right-[20%] text-rose/20 animate-float" style={{ animationDelay: "1.5s" }}>
            <Heart size={24} fill="currentColor" className="rotate-12" />
          </div>
        </div>

        <Navbar userName={session.user.name} />
        
        <main className="pt-28 pb-20 px-4 max-w-5xl mx-auto relative z-10">
          <PageTransition>
            {children}
          </PageTransition>
        </main>

        {/* Global Floating Chat Box */}
        <FloatingChat currentUser={session.user.name} />
      </div>
    );
  }

  return null;
}