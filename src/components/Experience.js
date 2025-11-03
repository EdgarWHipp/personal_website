import React from "react";
import { useNavigate } from "react-router-dom";

const experiences = [
  {
    title: "IT Consulting Intern",
    place: "PwC",
    year: "February 2025 - Juli 2025",
  },
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
    year: "October 2023 - October 2024",
  },
  {
    title: "Microsoft Student Learn Ambassador",
    place: "Microsoft",
    year: "Juli 2023 - February 2024",
  },
  {
    title: "Data Engineer - Working Student",
    place: "1&1 SE",
    year: "October 2022 - September 2023",
  },
  {
    title: "Teaching Assistant",
    place: "Karlsruher Institut für Technologie (KIT)",
    year: "October 2021 - March 2022",
  },

  // Add more experiences as needed
];

export default function Experience() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center min-h-screen pt-12 relative main-dark-bg">
      {/* Back button top left */}
      <button
        onClick={() => navigate("/cv")}
        className="absolute left-8 top-8 text-xs md:text-sm px-6 py-2 border-b border-neutral-400 text-neutral-500 hover:text-neutral-800 hover:border-neutral-800 transition-colors bg-transparent focus:outline-none z-20"
        style={{ letterSpacing: "0.08em" }}
      >
        &#8592;
      </button>
      <div className="w-full max-w-2xl mx-auto grid grid-cols-1 gap-2.5 mt-0 px-4 md:px-0 pb-20">
        {experiences.map((exp, idx) => {
          return (
            <section
              key={idx}
              className="bg-orange-500 relative border-2 border-black p-3 md:p-3.5 select-none shadow-[4px_4px_0_0_#000] transition-all hover:shadow-[6px_6px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5"
              aria-label={`${exp.title} at ${exp.place}`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-sm md:text-base font-normal text-neutral-800 tracking-tight">
                  {exp.title}
                </h3>
                <span className="text-xs font-normal text-neutral-800 uppercase whitespace-nowrap">
                  {exp.year}
                </span>
              </div>
              <p className="mt-0.5 text-xs md:text-sm font-normal text-neutral-800">
                {exp.place}
              </p>
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
