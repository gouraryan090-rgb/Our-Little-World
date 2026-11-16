import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, SESSION_COOKIE } from "../../lib/session";
import Navbar from "../../components/Navbar";
import PageTransition from "../../components/PageTransition";

export default async function DashboardLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-cream">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blush/40 blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-lilac/30 blur-3xl -z-10" />
      
      {/* Navbar */}
      <Navbar userName={session.name} />
      
      {/* Main Content with Smooth Page Transition */}
      <main className="pt-24 pb-20 px-4 max-w-5xl mx-auto">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  );
}