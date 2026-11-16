import LoginForm from "../../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cream via-blush to-lilac 
                      bg-[length:200%_200%] animate-gradient-shift" />

      {/* Floating blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full 
                      bg-rose/30 blur-3xl animate-float" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full 
                      bg-lilac/40 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full 
                      bg-mint/40 blur-3xl animate-float" style={{ animationDelay: "1s" }} />

      <LoginForm />
    </main>
  );
}