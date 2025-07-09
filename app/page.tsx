import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111118] px-4 py-10 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full max-w-5xl flex items-center justify-between mb-16">
        <div className="flex items-center gap-2">
          <Image src="/next.svg" alt="App logo" width={36} height={36} />
          <span className="text-lg font-bold text-white">Whatever Notes</span>
        </div>
        <nav className="hidden md:flex gap-8 text-gray-300 text-sm">
          <a href="#" className="hover:text-white transition-colors">Download</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">Sync</a>
          <a href="#" className="hover:text-white transition-colors">Publish</a>
          <a href="#" className="hover:text-white transition-colors">Enterprise</a>
        </nav>
        <nav className="flex gap-6 text-gray-300 text-sm">
         
          <a
            href="#"
            className="hover:text-white transition-colors flex items-center"
            aria-label="Account"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <title>Account</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14c3.314 0 6 2.239 6 5v1H6v-1c0-2.761 2.686-5 6-5zm0-2a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
          </a>
        </nav>
      </header>
      <main className="flex flex-col items-center text-center gap-8 w-full max-w-2xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#1CB5E0] to-[#000851] bg-clip-text text-transparent">
          Sharpen your thinking.
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 font-medium max-w-xl">
          The free and flexible app for your private thoughts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:justify-center">
          <Link
            href="/signup"
            className="inline-block rounded-lg px-8 py-3 text-lg font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1CB5E0] bg-gradient-to-r from-[#1CB5E0] to-[#000851] transition-all hover:scale-105"
            aria-label="Sign Up"
          >
            Sign Up
          </Link>
          <a
            href="/login"
            className="inline-block rounded-lg px-8 py-3 text-lg font-semibold bg-transparent border-2 border-[#1CB5E0] text-[#1CB5E0] hover:bg-gradient-to-r hover:from-[#1CB5E0] hover:to-[#000851] hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1CB5E0]"
            aria-label="Log In"
          >
            Log In
          </a>
        </div>
        <div className="w-full flex justify-center mt-10">
          <div className="rounded-2xl overflow-hidden shadow-lg bg-[#181828] border border-[#22223a] w-full max-w-2xl aspect-video flex items-center justify-center">
            <Image 
              src="/app-screenshot-placeholder.jpg" 
              alt="App Screenshot Placeholder" 
              width={800} 
              height={400} 
              className="object-cover w-full h-full" 
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}
