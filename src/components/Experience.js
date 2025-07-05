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
    <div className="flex flex-col items-center min-h-screen bg-white pt-16 relative">
      {/* Back button top left */}
      <button
        onClick={() => navigate("/cv")}
        className="absolute left-8 top-8 text-xs md:text-sm px-6 py-2 border-b border-neutral-400 text-neutral-500 hover:text-neutral-800 hover:border-neutral-800 transition-colors bg-transparent focus:outline-none z-20"
        style={{ letterSpacing: "0.08em" }}
      >
        &#8592;
      </button>
      <div className="w-full max-w-xl mx-auto flex flex-col gap-4 mt-0">
        {experiences.map((exp, idx) => (
          <div key={idx} className="flex flex-col mb-2">
            <span className="text-sm md:text-base font-normal text-neutral-800 select-none">
              {exp.title}
            </span>
            <span className="text-xs text-neutral-500 select-none">
              {exp.place} &middot; {exp.year}
            </span>
          </div>
        ))}
      </div>
      <footer className="absolute bottom-8 left-0 w-full flex justify-center text-xs text-gray-300 select-none">
        ©{new Date().getFullYear()} Edgar H. | Site by Coolify, Cloudflare
      </footer>
    </div>
  );
}
