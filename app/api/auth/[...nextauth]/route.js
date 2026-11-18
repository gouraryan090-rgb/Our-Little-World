import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Password",
      credentials: {
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.password) return null;
        
        // Server side pe check karo (wahi purana logic)
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
          method: 'POST',
          body: JSON.stringify({ password: credentials.password }),
          headers: { "Content-Type": "application/json" }
        });
        
        const user = await res.json();
        if (res.ok && user) {
          return { name: user.name, email: user.name === "Aryan" ? "gouraryan090@gmail.com" : "sharwanmaya3730@gmail.com" };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user }) {
      const emailString = process.env.ALLOWED_EMAILS || "gouraryan090@gmail.com,sharwanmaya3730@gmail.com";
      const allowedEmails = emailString.split(",").map(e => e.trim());
      return allowedEmails.includes(user.email);
    },
    async session({ session }) {
      const emailString = process.env.ALLOWED_EMAILS || "gouraryan090@gmail.com,sharwanmaya3730@gmail.com";
      const allowedEmails = emailString.split(",").map(e => e.trim());
      
      if (session.user.email === allowedEmails[0]) session.user.name = "Aryan";
      else if (session.user.email === allowedEmails[1]) session.user.name = "Manshi";
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes("/dashboard")) return `${baseUrl}/login`;
      return url;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };