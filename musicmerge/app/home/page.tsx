"use client";
import Link from "next/link";

const platforms = [
  { name: "Spotify", bg: "bg-[#1DB954]", letter: "S" },
  { name: "Apple Music", bg: "bg-[#fc3c44]", letter: "A" },
  { name: "Amazon Music", bg: "bg-[#00A8E1]", letter: "Am" },
  { name: "YouTube Music", bg: "bg-[#FF0000]", letter: "Y" },
  { name: "Tidal", bg: "bg-[#000000] border border-white/20", letter: "T" },
  { name: "Deezer", bg: "bg-[#A238FF]", letter: "D" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero card */}
      <section className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center gap-6">
        <p className="text-sm tracking-[0.3em] uppercase text-green-400 font-mono">
          Music Transfer Platform
        </p>
        <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tight">
          <span className="text-green-400">Transfer</span>{" "}
          <span className="text-white">Your</span>
          <br />
          <span className="text-white">Music</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-md">
          Spotify, Apple Music, Amazon, Youtube. Transfer, store, and share your
          customizable playlists across all platforms.
        </p>
        <Link
          href="/user/dashboard"
          className="mt-4 bg-green-500 hover:bg-green-400 text-black font-bold px-10 py-4 rounded-full text-lg transition-all hover:scale-105"
        >
          Transfer Playlist
        </Link>
      </section>

      {/* Platforms */}
      <section className="px-6 pb-24 text-center">
        <h2 className="text-2xl font-bold text-gray-300 mb-8">
          Platforms We Support
        </h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-sm mx-auto">
          {platforms.map((p) => (
            <div
              key={p.name}
              className={`${p.bg} w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-md`}
              title={p.name}
            >
              {p.letter}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}