"use client";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("https://route53-clone-z4m4.onrender.com/api/v1/auth/login", {
        username: username,
        password: password
      });

      localStorage.setItem("route53_token", res.data.access_token);
      localStorage.setItem("route53_user", res.data.user);

      window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f2f3f3]">
      <div className="bg-white p-8 border border-gray-300 rounded shadow-sm w-full max-w-md">
        
        <div className="flex justify-center mb-6">
          <div className="text-2xl font-bold text-[#232f3e] flex items-center gap-2">
             <span className="bg-[#ff9900] text-white p-1 rounded text-sm">Mock</span> AWS Auth
          </div>
        </div>
        
        <h1 className="text-xl font-medium mb-6 text-gray-900">Sign in</h1>

        {error && (
          <div className="mb-4 text-red-600 text-sm border border-red-300 bg-red-50 p-3 rounded flex items-center gap-2">
            <span className="font-bold">!</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb] outline-none"
              placeholder="Enter any username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded focus:border-[#0073bb] focus:ring-1 focus:ring-[#0073bb] outline-none"
              placeholder="Enter any password"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ff9900] hover:bg-[#e88b00] text-white font-bold py-2 px-4 rounded transition-colors mt-4 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

      </div>
    </div>
  );
}