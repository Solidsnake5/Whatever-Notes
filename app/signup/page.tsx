export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111118] px-4 py-10 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center w-full max-w-md mx-auto">
       
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">Create an account</h1>
        <p className="text-gray-400 text-center mb-8 text-base sm:text-lg">A Wahtever account allows you to purchase licenses and add-on services. Creating an account is not required to download or use the app.</p>
        <form className="flex flex-col gap-4 w-full">
          <label htmlFor="fullname" className="text-gray-300 text-sm font-medium">Full name</label>
          <input
            id="fullname"
            name="fullname"
            type="text"
            autoComplete="name"
            required
            className="rounded-md bg-[#181828] border border-[#22223a] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#1CB5E0] placeholder-gray-500"
            placeholder="Enter your full name"
            aria-label="Full name"
          />
          <label htmlFor="email" className="text-gray-300 text-sm font-medium mt-2">Email</label>
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
            autoComplete="new-password"
            required
            className="rounded-md bg-[#181828] border border-[#22223a] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#1CB5E0] placeholder-gray-500"
            placeholder="Enter your password"
            aria-label="Password"
          />
          <button
            type="submit"
            className="mt-6 rounded-lg px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-[#1CB5E0] to-[#000851] shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1CB5E0] transition-all hover:scale-105"
          >
            Sign up
          </button>
        </form>
        <p className="text-gray-400 text-center mt-8 text-sm">
          Already have an account?{' '}
          <a
            href="#"
            className="bg-gradient-to-r from-[#1CB5E0] to-[#000851] bg-clip-text text-transparent font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1CB5E0]"
            aria-label="Sign in"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
} 