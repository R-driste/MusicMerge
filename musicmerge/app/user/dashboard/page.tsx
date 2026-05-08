"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { firebaseAuth } from "@/lib/firebaseClient";

const platforms = [
  { id: "spotify", name: "Spotify", bg: "bg-[#1DB954]", letter: "S" },
  { id: "apple", name: "Apple Music", bg: "bg-[#fc3c44]", letter: "A" },
  { id: "amazon", name: "Amazon Music", bg: "bg-[#00A8E1]", letter: "Am" },
  { id: "youtube", name: "YouTube Music", bg: "bg-[#FF0000]", letter: "Y" },
  { id: "tidal", name: "Tidal", bg: "bg-[#111] border border-white/20", letter: "T" },
  { id: "deezer", name: "Deezer", bg: "bg-[#A238FF]", letter: "D" },
];

export default function DashboardPage() {
  const router = useRouter();
  const user = firebaseAuth.currentUser;
  const [sourcePlatform, setSourcePlatform] = useState<string | null>(null);
  const [targetPlatform, setTargetPlatform] = useState<string | null>(null);
  const [step, setStep] = useState<"source" | "target">("source");

  const handlePlatformClick = (id: string) => {
    if (step === "source") {
      setSourcePlatform(id);
      setStep("target");
    } else {
      if (id !== sourcePlatform) setTargetPlatform(id);
    }
  };

  const handleConvert = () => {
    if (sourcePlatform && targetPlatform) {
      router.push(`/user/playlists?from=${sourcePlatform}&to=${targetPlatform}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-green-400 text-sm tracking-widest uppercase font-mono mb-2">
            Welcome back
          </p>
          <h1 className="text-5xl font-black">
            {user?.displayName ? `Welcome, ${user.displayName}!` : "Dashboard"}
          </h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === "source" ? "text-green-400" : "text-gray-500"}`}>
            <span className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold border-current">1</span>
            <span className="text-sm font-semibold">My Platforms</span>
          </div>
          <div className="w-8 h-px bg-white/10" />
          <div className={`flex items-center gap-2 ${step === "target" ? "text-green-400" : "text-gray-500"}`}>
            <span className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold border-current">2</span>
            <span className="text-sm font-semibold">Target Platform</span>
          </div>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {platforms.map((p) => {
            const isSource = sourcePlatform === p.id;
            const isTarget = targetPlatform === p.id;
            const isDisabled = step === "target" && p.id === sourcePlatform;
            return (
              <button
                key={p.id}
                onClick={() => !isDisabled && handlePlatformClick(p.id)}
                disabled={isDisabled}
                className={`
                  ${p.bg} aspect-square rounded-2xl flex items-center justify-center
                  text-white text-3xl font-black shadow-lg transition-all
                  ${isSource ? "ring-4 ring-white scale-105" : ""}
                  ${isTarget ? "ring-4 ring-green-400 scale-105" : ""}
                  ${isDisabled ? "opacity-30 cursor-not-allowed" : "hover:scale-105 hover:brightness-110"}
                `}
                title={p.name}
              >
                {p.letter}
              </button>
            );
          })}
        </div>

        {/* Status */}
        <div className="bg-[#161616] border border-white/5 rounded-2xl px-6 py-4 mb-6 flex justify-between text-sm">
          <span className="text-gray-500">
            From:{" "}
            <span className="text-white font-bold">
              {sourcePlatform ? platforms.find((p) => p.id === sourcePlatform)?.name : "—"}
            </span>
          </span>
          <span className="text-gray-500">
            To:{" "}
            <span className="text-white font-bold">
              {targetPlatform ? platforms.find((p) => p.id === targetPlatform)?.name : "—"}
            </span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => { setSourcePlatform(null); setTargetPlatform(null); setStep("source"); }}
            className="flex-1 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-gray-400 font-bold py-4 rounded-2xl transition"
          >
            Reset
          </button>
          <button
            onClick={handleConvert}
            disabled={!sourcePlatform || !targetPlatform}
            className="flex-1 bg-green-500 hover:bg-green-400 text-black font-black py-4 rounded-2xl text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02]"
          >
            CONVERT
          </button>
        </div>
      </div>
    </main>
  );
}