import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Redirect authenticated users to the dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col h-screen text-white" style={{ backgroundColor: 'rgb(29, 65, 101)' }}>
      {/* Header Section */}
      <header className="custom-header py-4 px-6 flex justify-between items-center">
        <Link href="/dashboard">
          <h1 className="text-3xl font-bold cursor-pointer">ISS Appointment Setter</h1>
        </Link>
        <Link href="/signin">
          <button className="custom-btn">
            Sign in or sign up
          </button>
        </Link>
      </header>

      {/* Main Content Section */}
      <main className="flex-grow flex items-start justify-start pt-16 px-8">
        <div className="text-left max-w-3xl"> {/* max-w-xl limits the width of the description */}
          <h2 className="text-3xl font-semibold mb-4">
            Automate Your Appointment Scheduling
          </h2>
          <p className="text-lg mb-6 break-words">
            The ISS Appointment Setter is an innovative AI-powered system
            designed to streamline scheduling appointments. Using advanced
            language models and speech recognition technology, it handles
            real-time phone conversations with clients, booking appointments
            efficiently and naturally.
          </p>
          <p className="text-lg mb-6 break-words">
            Sign up or sign in today to experience the future of appointment
            management.
          </p>
          <Link href="/signin">
            <button className="custom-btn">
              Sign in or sign up
            </button>
          </Link>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="custom-footer text-white py-4 px-8 text-sm"> {/* Footer background set to black */}
        <div className="text-left">
          <p>
            ISS Appointment Setter, powered by cutting-edge AI technologies,
            automating appointment scheduling since 2024.
          </p>
          <p>Contact support: support@iss.com | Phone: (800) 123-4567</p>
          <p>&copy; 2024 ISS Technologies, All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
