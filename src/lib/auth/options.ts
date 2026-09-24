import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateUniqueUserId, generateCandidateId } from "./unique-id";
import type { AuthProvider } from "@/lib/supabase/types";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
    // Development Mock Provider for local environment testing
    ...(process.env.NODE_ENV === "development"
      ? [
          CredentialsProvider({
            id: "academic-dev",
            name: "Academic Test Student (Dev)",
            credentials: {
              email: { label: "Email", type: "email", placeholder: "student@university.edu" },
              name: { label: "Full Name", type: "text", placeholder: "Alex Rivera" },
            },
            async authorize(credentials) {
              if (!credentials?.email) return null;
              return {
                id: "dev-student-1",
                email: credentials.email,
                name: credentials.name || "Alex Rivera",
              };
            },
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Gracefully handle private GitHub emails
      if (!user.email && account?.provider === "github") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ghLogin = (profile as any)?.login || user.id;
        user.email = `${ghLogin}@users.noreply.github.com`;
      }

      if (!user.email) return false;

      // When Supabase is configured, sync or create user in Supabase 'users' and 'user_profiles'
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        // If placeholder credentials, allow sign in to proceed in dev
        if (
          !supabaseUrl ||
          !serviceKey ||
          supabaseUrl.includes("mock-project") ||
          serviceKey.includes("mock")
        ) {
          return true;
        }

        const adminClient = createAdminClient();
        const provider = (account?.provider || "google") as AuthProvider;
        const providerId = account?.providerAccountId || user.id;

        // Check if user already exists
        const { data: existingUser } = await adminClient
          .from("users")
          .select("id, unique_user_id")
          .eq("email", user.email)
          .maybeSingle();

        if (!existingUser) {
          const uniqueUserId = await generateUniqueUserId(adminClient);
          const { data: newUser, error: insertError } = await adminClient
            .from("users")
            .insert({
              email: user.email,
              auth_provider: provider,
              auth_provider_id: providerId,
              unique_user_id: uniqueUserId,
            })
            .select("id")
            .single();

          if (insertError) {
            console.error("Error creating user record in Supabase:", insertError);
            return false;
          }

          if (newUser) {
            // Seed initial empty profile
            await adminClient.from("user_profiles").insert({
              user_id: newUser.id,
              full_name: user.name || null,
              extra_fields: {},
            });
          }
        }

        return true;
      } catch (err) {
        console.error("Error during NextAuth signIn callback:", err);
        return true; // Still allow session creation for resiliency
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email || undefined;
        token.name = user.name || undefined;

        // Attempt to fetch matching unique_user_id from DB
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

          if (
            supabaseUrl &&
            serviceKey &&
            !supabaseUrl.includes("mock") &&
            user.email
          ) {
            const adminClient = createAdminClient();
            const { data: dbUser } = await adminClient
              .from("users")
              .select("id, unique_user_id")
              .eq("email", user.email)
              .maybeSingle();

            if (dbUser) {
              token.id = dbUser.id;
              token.uniqueUserId = dbUser.unique_user_id;
            }
          }
        } catch {
          // Fallback in case of network or mock database
        }

        if (!token.uniqueUserId) {
          token.uniqueUserId = `STU-${generateCandidateId().slice(0, 5)}`;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || "user-id-default";
        session.user.uniqueUserId =
          (token.uniqueUserId as string) || `STU-${generateCandidateId().slice(0, 5)}`;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
