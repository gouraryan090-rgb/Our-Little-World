import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check karo ki email allowed list me hai ya nahi
      const allowedEmails = process.env.ALLOWED_EMAILS.split(",");
      if (allowedEmails.includes(user.email)) {
        return true; // Login allow
      } else {
        return false; // Login reject
      }
    },
    async session({ session, token }) {
      // Session me user ka naam set karo (Aryan ya Manshi)
      const allowedEmails = process.env.ALLOWED_EMAILS.split(",");
      if (session.user.email === allowedEmails[0]) {
        session.user.name = "Aryan";
      } else if (session.user.email === allowedEmails[1]) {
        session.user.name = "Manshi";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Error aane pe login page pe bhejega
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };