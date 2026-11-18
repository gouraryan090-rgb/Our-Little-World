export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#FDFBF7]/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Cute Heart Loader */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-rose/20 rounded-full animate-ping"></div>
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-soft">
            <span className="text-2xl animate-pulse">💖</span>
          </div>
        </div>
        <p className="font-accent italic text-ink/60 animate-pulse">Opening our little world...</p>
      </div>
    </div>
  );
}