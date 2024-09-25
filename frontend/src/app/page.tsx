// src/app/page.tsx
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Link href="/api/auth/signin?callbackUrl=/dashboard&provider=google"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Sign in with Google
      </Link>
      <Link href="/api/auth/signin?callbackUrl=/dashboard&provider=azure-ad"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Sign in with Microsoft
      </Link>
    </div>
  )
}
