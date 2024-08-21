// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import AuthForm from "../components/AuthForm";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleAuth = async (email, password) => {
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <AuthForm onAuth={handleAuth} isRegistering={isRegistering} />
      <button
        onClick={() => setIsRegistering(!isRegistering)}
        className="mt-4 text-indigo-500"
      >
        {isRegistering
          ? "Already have an account? Login here"
          : "Don't have an account? Register here"}
      </button>
    </div>
  );
}
