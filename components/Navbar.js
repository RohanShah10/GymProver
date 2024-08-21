import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  const isActive = (pathname) => router.pathname === pathname;

  return (
    <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl text-white font-bold">Gym Tracker</h1>
        <div className="flex space-x-4">
          <Link
            href="/"
            className={`${
              isActive("/") ? "bg-gray-900 text-white" : "text-gray-300"
            } px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors duration-200`}
          >
            Home
          </Link>
          <Link
            href="/statistics"
            className={`${
              isActive("/statistics")
                ? "bg-gray-900 text-white"
                : "text-gray-300"
            } px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors duration-200`}
          >
            Statistics
          </Link>
          <Link
            href="/diary"
            className={`${
              isActive("/diary") ? "bg-gray-900 text-white" : "text-gray-300"
            } px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors duration-200`}
          >
            Diary
          </Link>
        </div>
      </div>
    </nav>
  );
}
