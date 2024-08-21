import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl text-white font-bold">GymProver</h1>
        <div className="flex space-x-4">
          <Link
            href="/"
            className="text-white hover:text-gray-300 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/statistics"
            className="text-white hover:text-gray-300 transition-colors duration-200"
          >
            Statistics
          </Link>
          <Link
            href="/diary"
            className="text-white hover:text-gray-300 transition-colors duration-200"
          >
            Diary
          </Link>
        </div>
      </div>
    </nav>
  );
}
