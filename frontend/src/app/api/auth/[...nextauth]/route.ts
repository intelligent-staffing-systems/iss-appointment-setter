import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import type { NextAuthOptions } from 'next-auth';
import { createUser } from "@/app/api/users";

// Extend the default session and JWT types globally to include accessToken and userId
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    userId?: string; // Add userId to the session
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    userId?: string; // Add userId to the JWT token
  }
}

export const authOptions: NextAuthOptions = {
  debug: true, // Enable debugging
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
    async signIn({ user, account }) {
      console.log('Sign-in callback triggered');
      console.log('User object in signIn:', user);
      console.log('Account object in signIn:', account);

      if (!account || !user.email) {
        console.error('Account or user email is missing');
        return false;
      }

      const userData = {
        email: user.email ?? '',
        provider: 'azure-ad',
        outlook_token: account.access_token
      };

      console.log("User data payload being sent to createUser:", userData);

      try {
        // Call the createUser function and extract the user ID from the response
        const response = await createUser(userData);
        console.log('Response from createUser:', response);

        // Extract the user ID from the backend response
        const userId = response.user?.id;
        if (userId) {
          account.userId = userId; // Store it on the account object for use in the JWT callback
          console.log('User ID from backend:', userId);
        } else {
          console.error('User ID not found in response:', response);
        }

        return true; // Allow the sign-in process to continue
      } catch (error) {
        console.error('Failed to create user:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      console.log('JWT callback triggered');
    
      // This only occurs during the initial sign-in
      if (account && user) {
        console.log('User object in JWT callback:', user);
        console.log('Account object in JWT callback:', account);
    
        // If account exists, add accessToken and userId to the token
        if (account.access_token) {
          token.accessToken = account.access_token;
          console.log('Access token added to JWT:', token.accessToken);
        }
    
        // Attach userId from the account (from signIn) if available
        if (account.userId) {
          token.userId = account.userId;
          console.log('User ID added to JWT from account:', token.userId);
        }
      } else {
        // On subsequent calls, just use the token as it is.
        console.log('No user or account in JWT callback; using existing token values.');
        console.log('Current token values:', token);
      }
    
      console.log('Final JWT token:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback triggered');
      console.log('Session object before modification:', session);
      console.log('Token object in session callback:', token);

      // Assign the accessToken and userId from the token to the session
      session.accessToken = token.accessToken;
      session.userId = token.userId;

      console.log('Access token in session:', session.accessToken);
      console.log('User ID in session:', session.userId);
      console.log('Final session object:', session);

      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
