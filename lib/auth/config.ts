import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { isDbConfigured } from "@/lib/db";

export const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnBookmarks = nextUrl.pathname.includes("/bookmarks");

      if (isOnBookmarks) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    },
    async signIn({ user, account }) {
      if (!user.email || !account) return false;

      // Skip database operations if not configured
      if (!isDbConfigured()) {
        return true;
      }

      try {
        const { db, users } = await import("@/lib/db");
        const { eq } = await import("drizzle-orm");

        // Check if user exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .get();

        if (!existingUser) {
          // Create new user
          await db.insert(users).values({
            id: crypto.randomUUID(),
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account.provider,
          });
        }

        return true;
      } catch {
        // Allow sign-in even if DB fails - user data just won't be persisted
        return true;
      }
    },
    async jwt({ token, user, account }) {
      if (user && account) {
        // If database is configured, fetch user from DB to get the actual ID
        if (isDbConfigured()) {
          try {
            const { db, users } = await import("@/lib/db");
            const { eq } = await import("drizzle-orm");

            const dbUser = await db
              .select()
              .from(users)
              .where(eq(users.email, user.email!))
              .get();

            if (dbUser) {
              token.id = dbUser.id;
              token.provider = account.provider;
              return token;
            }
          } catch {
            // Continue with fallback ID
          }
        }

        // Fallback: use a generated ID if DB is not available
        token.id = user.id || crypto.randomUUID();
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
  },
};
