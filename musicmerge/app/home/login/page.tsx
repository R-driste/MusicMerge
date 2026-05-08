"use client";
import { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      router.push("/user/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
      router.push("/user/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Google sign-in failed");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#161616] rounded-3xl p-10 border border-white/5 shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-8 text-center">Login</h1>

        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-widest mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#222] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-widest mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#222] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-all mt-2 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-gray-600 text-sm">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogle}
            className="w-full bg-[#222] hover:bg-[#2a2a2a] border border-white/10 text-white py-3 rounded-xl flex items-center justify-center gap-3 transition"
          >
            <span className="text-lg">G</span> Continue with Google
          </button>
          <button className="w-full bg-[#222] hover:bg-[#2a2a2a] border border-white/10 text-white py-3 rounded-xl flex items-center justify-center gap-3 transition">
            <span className="text-lg"></span> Continue with Apple
          </button>
          <button className="w-full bg-[#222] hover:bg-[#2a2a2a] border border-white/10 text-white py-3 rounded-xl flex items-center justify-center gap-3 transition">
            <span className="text-lg">M</span> Continue with Microsoft
          </button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          No account?{" "}
          <Link href="/home/createacc" className="text-green-400 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}