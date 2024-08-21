// components/AuthForm.js
import { useState } from "react";

export default function AuthForm({ onAuth, isRegistering }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuth(email, password);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-8 shadow-lg fade-in">
      <h2 className="text-2xl font-semibold mb-6">
        {isRegistering ? "Register" : "Login"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full p-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-lg font-semibold transition-transform transform hover:scale-105"
        >
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>
    </div>
  );
}
