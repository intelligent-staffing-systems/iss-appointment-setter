// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import AzureADProvider from "next-auth/providers/azure-ad"
import type { NextAuthOptions } from 'next-auth'

// Extend the default session type to include accessToken
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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
      console.log('JWT callback - token:', token);
      console.log('JWT callback - account:', account);

      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback - session:', session);
      console.log('Session callback - token:', token);

      session.accessToken = token.accessToken;
      return session;
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
