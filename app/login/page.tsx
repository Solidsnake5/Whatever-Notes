import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111118] px-4 py-10 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center w-full max-w-md mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">Sign in to your account</h1>
        <p className="text-gray-400 text-center mb-8 text-base sm:text-lg">Welcome back! Please enter your details to log in.</p>
        <form className="flex flex-col gap-4 w-full" autoComplete="on">
          <label htmlFor="email" className="text-gray-300 text-sm font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="rounded-md bg-[#181828] border border-[#22223a] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#1CB5E0] placeholder-gray-500"
            placeholder="Enter your email"
            aria-label="Email"
          />
          <label htmlFor="password" className="text-gray-300 text-sm font-medium mt-2">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="rounded-md bg-[#181828] border border-[#22223a] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#1CB5E0] placeholder-gray-500"
            placeholder="Enter your password"
            aria-label="Password"
          />
          {/* Error message placeholder */}
          <div aria-live="polite" className="text-red-500 text-sm min-h-[1.5em]" />
          <button
            type="submit"
            className="mt-4 rounded-lg px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-[#1CB5E0] to-[#000851] shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1CB5E0] transition-all hover:scale-105"
          >
            Log In
          </button>
        </form>
        <div className="flex items-center w-full my-6">
          <div className="flex-grow h-px bg-[#22223a]" />
          <span className="mx-4 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-[#22223a]" />
        </div>
        <button
          type="button"
          className="flex items-center justify-center gap-2 w-full rounded-lg px-8 py-3 text-lg font-semibold bg-white text-[#111118] shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1CB5E0] transition-all hover:scale-105"
          aria-label="Sign in with Gmail"
        >
          <Image src="/google.svg" alt="Google logo" width={24} height={24} />
          Sign in with Gmail
        </button>
        <p className="text-gray-400 text-center mt-8 text-sm">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="bg-gradient-to-r from-[#1CB5E0] to-[#000851] bg-clip-text text-transparent font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1CB5E0]"
            aria-label="Sign up"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
} 