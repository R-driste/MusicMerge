"use client";
import Link from "next/link";

const platforms = [
  { name: "Spotify", icon: "/icons/spotify.png", bg: "bg-[#1DB954]" },
  { name: "Apple Music", icon: "/icons/apple.png", bg: "bg-[#fc3c44]" },
  { name: "Amazon Music", icon: "/icons/amazon.png", bg: "bg-[#00A8E1]" },
  { name: "Pandora", icon: "/icons/pandora.png", bg: "bg-[#0078D4]" },
  { name: "YouTube Music", icon: "/icons/youtube.png", bg: "bg-[#FF0000]" },
  { name: "SoundCloud", icon: "/icons/soundcloud.jpg", bg: "bg-[#FF5500]" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero card :D */}
      <section className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center gap-6">
        <p className="text-sm tracking-[0.3em] uppercase text-green-400 font-mono">
          Music Provider Centralization Platform
        </p>
        <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tight">
          <span className="text-red-800">Transfer</span>{" "}
          <span className="text-white">Your</span>{" "}
          <span className="text-green-800">Music</span>
        </h1>
        <p className="text-white text-2xl">
          Spotify, Apple Music, Amazon, Youtube.
        </p>
        <p className="text-gray-400 text-lg">
          Transfer, store, and share your customizable playlists across all
          platforms.
        </p>
        <Link
          href="/user/dashboard"
          className="mt-4 bg-green-500 hover:bg-green-400 text-black font-bold px-10 py-4 rounded-full text-lg transition-all hover:scale-105"
        >
          Get Started
        </Link>
      </section>

      {/* Platforms */}
      <section className="flex flex-col items-center text-center px-6 pb-24">
        <h2 className="text-2xl font-bold text-gray-300 mb-4">
          Platforms We Support
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mb-8">
          We support Amazon, Pandora, Spotify, Apple Music, YouTube, SoundCloud, and
          background music sources for easy playlist transfer.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className={`${platform.bg} w-14 h-14 rounded-xl flex items-center justify-center shadow-lg`}
              title={platform.name}
            >
              <img
                src={platform.icon}
                alt={platform.name}
                className="w-8 h-8 object-contain"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}