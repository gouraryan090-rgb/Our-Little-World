import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, SESSION_COOKIE } from "../lib/session";

export default async function RootPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect("/login"); // Agar login nahi hai
  }
  
  redirect("/dashboard"); // Agar login hai
}