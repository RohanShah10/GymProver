import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl text-white font-bold">GymProver</h1>
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className={`${
              router.pathname === "/" ? "text-white" : "text-gray-400"
            } hover:text-white transition-colors`}
          >
            Home
          </Link>
          <Link
            href="/statistics"
            className={`${
              router.pathname === "/statistics" ? "text-white" : "text-gray-400"
            } hover:text-white transition-colors`}
          >
            Statistics
          </Link>
          <Link
            href="/diary"
            className={`${
              router.pathname === "/diary" ? "text-white" : "text-gray-400"
            } hover:text-white transition-colors`}
          >
            Diary
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-sm text-white font-semibold px-3 py-1 rounded transition-transform transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
