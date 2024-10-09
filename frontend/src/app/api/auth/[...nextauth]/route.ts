import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import type { NextAuthOptions } from 'next-auth';
import { createUser } from "@/app/api/users"; // Import createUser function

// Extend the default session and JWT types globally to include accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: 'common',
      authorization: {
        params: {
          scope: "openid profile email offline_access User.Read Calendars.Read Calendars.ReadWrite"
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account }) {
      // Check if account exists and add accessToken to the token
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Assign the accessToken from token to session
      session.accessToken = token.accessToken;
      return session;
    },
    async signIn({ user, account }) {
      try {
        console.log("Sign-in callback - user:", user);
        console.log("Sign-in callback - account:", account);

        // Ensure account is not null before accessing its properties
        if (!account || !user.email) {
          console.error('Account or user email is missing');
          return false;
        }

        // Create user payload
        const userData = {
          email: user.email ?? '', // Fallback to an empty string if email is null/undefined
          provider: 'azure-ad',
          outlook_token: account.access_token
        };

        // Log the user data payload
        console.log("User data payload:", userData);

        // Call the createUser function
        const response = await createUser(userData);
        console.log('User created or already exists:', response);

        return true;  // Continue the sign-in process
      } catch (error) {
        console.error('Failed to create user:', error);
        return false; // Stop the sign-in process if there was an error
      }
    }
  },
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
