import React from "react";
import { useNavigate } from "react-router-dom";

const experiences = [
  { title: "IT Consulting Intern", place: "PwC", year: "2025" },
  {
    title: "Invited AI Hackathon Participant",
    place: "AI Hackathon Berlin from {Tech: Europe}",
    year: "Apr. 2025",
  },
  {
    title: "AI Hackathon Participant",
    place: "AI Hackathon Berlin from {Tech: Europe}",
    year: "Feb. 2025",
  },
  {
    title: "Cloud Software Engineer - Working Student",
    place: "SAP SE",
    year: "2023 - 2024",
  },
  {
    title: "Microsoft Student Learn Ambassador",
    place: "Microsoft",
    year: "2023 - 2024",
  },
  {
    title: "Data Engineer - Working Student",
    place: "1&1 SE",
    year: "2022 - 2023",
  },
  {
    title: "Teaching Assistant",
    place: "Karlsruher Institut für Technologie (KIT)",
    year: "2021 - 2022",
  },

  // Add more experiences as needed
];

export default function Experience() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center min-h-screen pt-16 relative main-dark-bg">
      {/* Back button top left */}
      <button
        onClick={() => navigate("/cv")}
        className="absolute left-8 top-8 text-xs md:text-sm px-6 py-2 border-b border-neutral-400 text-neutral-500 hover:text-neutral-800 hover:border-neutral-800 transition-colors bg-transparent focus:outline-none z-20"
        style={{ letterSpacing: "0.08em" }}
      >
        &#8592;
      </button>
      <div className="w-full max-w-2xl mx-auto grid grid-cols-1 gap-6 mt-0 px-4 md:px-0">
        {experiences.map((exp, idx) => {
          const accentPalette = [
            "bg-yellow-400",
            "bg-rose-500",
            "bg-lime-400",
            "bg-cyan-400",
            "bg-fuchsia-500",
            "bg-orange-400",
          ];
          const accent = accentPalette[idx % accentPalette.length];
          return (
            <section
              key={idx}
              className={`bg-white relative border-4 border-black p-5 md:p-6 select-none
              shadow-[8px_8px_0_0_#000] transition-transform hover:-translate-x-1 hover:-translate-y-1`}
              aria-label={`${exp.title} at ${exp.place}`}
            >
              <div className={`h-2 w-16 ${accent} border-2 border-black mb-3`}></div>
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg md:text-xl font-extrabold text-black tracking-tight">
                  {exp.title}
                </h3>
                <span className="text-xs md:text-sm font-extrabold text-black uppercase">{exp.year}</span>
              </div>
              <p className="mt-1 text-sm md:text-base font-semibold text-black">{exp.place}</p>
            </section>
          );
        })}
      </div>
      <footer className="absolute bottom-8 left-0 w-full flex justify-center text-xs text-gray-300 select-none">
        ©{new Date().getFullYear()} Edgar H. Site by Coolify, Cloudflare
      </footer>
    </div>
  );
}
