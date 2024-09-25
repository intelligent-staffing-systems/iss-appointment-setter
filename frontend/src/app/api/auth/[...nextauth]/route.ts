// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    AzureADProvider({
		clientId: process.env.AZURE_AD_CLIENT_ID as string,
		clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
		tenantId: process.env.AZURE_AD_TENANT_ID as string,
		authorization: { params: { scope: "openid profile user.Read email" } },
	  }),
  ],
  // Add any additional NextAuth configuration here
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
