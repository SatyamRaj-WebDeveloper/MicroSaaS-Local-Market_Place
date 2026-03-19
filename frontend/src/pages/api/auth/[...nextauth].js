// frontend/pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const apiUrl = process.env.INTERNAL_API_URL || "http://backend:5000/api";
          
          const res = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          });
          
          const user = await res.json();
          
          // Added user.role here so NextAuth captures it from the backend
          if (res.ok && user && user.token) {
            return { 
              id: user._id, 
              shopSlug: user.shopSlug, 
              role: user.role, 
              accessToken: user.token 
            };
          }
          return null;
        } catch (e) {
          console.error("Login Error:", e);
          return null;
        }
      }
    })
  ],
  callbacks: {
    // Pass the role from the user object into the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.shopSlug = user.shopSlug;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    // Pass the role from the JWT token into the active browser session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.shopSlug = token.shopSlug;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || "dnsbfjadsbfjanflmsjkdnfskjdoasjojns",
  debug: true, 
};

export default NextAuth(authOptions);