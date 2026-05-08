"use client";

const platforms = [
  { name: "Spotify", bg: "bg-[#1DB954]", letter: "S" },
  { name: "Apple Music", bg: "bg-[#fc3c44]", letter: "A" },
  { name: "Amazon Music", bg: "bg-[#00A8E1]", letter: "Am" },
  { name: "YouTube Music", bg: "bg-[#FF0000]", letter: "Y" },
  { name: "Tidal", bg: "bg-[#111] border border-white/20", letter: "T" },
  { name: "Deezer", bg: "bg-[#A238FF]", letter: "D" },
];

const team = [
  { name: "Member 1", role: "Developer" },
  { name: "Member 2", role: "Developer" },
  { name: "Member 3", role: "Developer" },
  { name: "Member 4", role: "Developer" },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-24">

        {/* Mission */}
        <section>
          <h1 className="text-5xl font-black mb-6 text-white">Our Mission</h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
            Provide a service that allows users to keep up with the rapid changes
            across all platforms. They should be able to move music across all
            platforms easily and maintain all of their playlists. We hope to
            become the go-to solution for all music lovers.
          </p>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-4xl font-black mb-10 text-white">About the Crew</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-[#1a1a1a] rounded-2xl p-6 flex flex-col items-center gap-3 border border-white/5"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 text-2xl font-bold">
                  {member.name[0]}
                </div>
                <p className="font-bold text-white">{member.name}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platforms */}
        <section>
          <h2 className="text-4xl font-black mb-10 text-white">
            Platforms We Support
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {platforms.map((p) => (
              <div
                key={p.name}
                className={`${p.bg} aspect-square rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg`}
                title={p.name}
              >
                {p.letter}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}