import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, SESSION_COOKIE } from "../../lib/session";
import Navbar from "../../components/Navbar";
import PageTransition from "../../components/PageTransition";
import { Heart, Star, Sparkles } from "lucide-react";

export default async function DashboardLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FDFBF7]">
      
      {/* Background Patterns & Decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft Gradient Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-rose/15 blur-[100px] opacity-70" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-lilac/20 blur-[120px] opacity-60" />
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-mint/10 blur-[80px] opacity-50" />
        
        {/* Floating Cute Elements */}
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

      {/* Navbar */}
      <Navbar userName={session.name} />
      
      {/* Main Content */}
      <main className="pt-28 pb-20 px-4 max-w-5xl mx-auto relative z-10">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  );
}