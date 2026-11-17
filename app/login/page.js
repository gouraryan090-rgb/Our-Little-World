import LoginForm from "../../components/LoginForm";
import { Heart, Star, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center px-4 bg-[#FCF4ED]">
      
      {/* Background Elements (Hearts & Stars) */}
      <div className="absolute top-20 left-[10%] text-yellow-400 opacity-80 animate-float">
        <Star size={48} fill="currentColor" strokeWidth={1} />
      </div>
      <div className="absolute bottom-32 left-[15%] text-rose/80 animate-float" style={{ animationDelay: "1s" }}>
        <Heart size={40} fill="currentColor" strokeWidth={1} />
      </div>
      <div className="absolute top-1/3 right-[15%] text-rose/90 animate-float" style={{ animationDelay: "2s" }}>
        <Heart size={60} fill="currentColor" strokeWidth={1} className="-rotate-12" />
      </div>
      <div className="absolute bottom-20 right-[10%] text-yellow-400 opacity-90 animate-float" style={{ animationDelay: "0.5s" }}>
        <Star size={56} fill="currentColor" strokeWidth={1} className="rotate-12" />
      </div>
      <div className="absolute top-1/4 left-[20%] text-lilac animate-float" style={{ animationDelay: "1.5s" }}>
        <Sparkles size={32} />
      </div>
      <div className="absolute bottom-1/3 right-[25%] text-lilac animate-float" style={{ animationDelay: "2.5s" }}>
        <Sparkles size={24} />
      </div>

      {/* Top Logo */}
      <div className="absolute top-8 left-8">
        <h1 className="font-display text-3xl font-bold text-rose tracking-tighter flex items-center gap-1">
          O<span className="text-ink">ur</span>W<span className="text-ink">orld</span>
        </h1>
      </div>

      <LoginForm />

      {/* Footer Link */}
      <div className="mt-8 z-10">
        <a href="/" className="text-ink/60 hover:text-rose transition-colors flex items-center gap-2 font-body text-sm font-semibold">
          <span>←</span> Back to home
        </a>
      </div>
    </main>
  );
}