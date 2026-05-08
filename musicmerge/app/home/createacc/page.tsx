"use client";
import { useState } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";

export default function CreateAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(cred.user, { displayName: username });
      router.push("/user/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Account creation failed");
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
        <h1 className="text-3xl font-black text-white mb-8 text-center">Create Account</h1>

        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </p>
        )}

        <form onSubmit={handleCreate} className="space-y-4">
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
            <label className="text-xs text-gray-500 uppercase tracking-widest mb-1 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-[#222] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition"
              placeholder="cooluser123"
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
            {loading ? "Creating..." : "Create Account"}
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
            <span></span> Continue with Apple
          </button>
          <button className="w-full bg-[#222] hover:bg-[#2a2a2a] border border-white/10 text-white py-3 rounded-xl flex items-center justify-center gap-3 transition">
            <span>M</span> Continue with Microsoft
          </button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          Already have an account?{" "}
          <Link href="/home/login" className="text-green-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}