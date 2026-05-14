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

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-[#2a2a2a] text-white px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-24">

        {/* Mission */}
        <section>
          <h1 className="text-5xl font-black mb-6 text-white">Our Mission</h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
            Provide a service that allows users to keep up with the rapid changes
            across a <span className="text-green-400">wide variety</span>{" "}
            of platforms. They should be able to <span className="text-green-400">seamlessly move music</span>{" "}
            across providers and maintain their playlists in one place. We hope to
            become a <span className="text-green-400">go-to solution</span> for hardcore music lovers.
          </p>
        </section>

        {/* Team */}
        <section className="flex flex-col items-end text-right">
          <h2 className="text-4xl font-black mb-10 text-white">About the Crew</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 w-full">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white/5 rounded-2xl p-6 flex flex-col items-center gap-3 border border-white/10"
              >
                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xl font-bold">
                  {member.name[0]}
                </div>
                <p className="font-semibold text-white">{member.name}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
            We are a team of high school developers with the dream of one day creating something that will be impactful across the world. What starts with music hopefully will lead to something that can make the lives of people easier in so many different fields.
          </p>
        </section>

        {/* Platforms */}
        <section className="flex flex-col items-center text-center">
          <h2 className="text-4xl font-black mb-8 text-white">
            Platforms We Support
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {platforms.map((p) => (
              <div
                key={p.name}
                className={`${p.bg} w-14 h-14 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-md`}
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