// src/components/CV.js
import React from "react";
import { Link } from "react-router-dom";

const sections = [
  { title: "Info", href: "/info" },
  { title: "Software", href: "/software" },
  { title: "Experience", href: "/experience" },
  { title: "Hobbies & Blog", href: "/hobbies" },
  { title: "Bwell", href: "/bwell" },
  { title: "Impressum", href: "/impressum" },
];

export default function CV() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
        {sections.map((section) =>
          section.href.startsWith("/") ? (
            <Link
              key={section.title}
              to={section.href}
              className="flex flex-row justify-between items-center group px-2"
              style={{ textDecoration: "none" }}
            >
              <span className="text-base md:text-lg font-normal text-neutral-800 group-hover:text-orange-500 transition-colors duration-200 select-none">
                {section.title}
              </span>
            </Link>
          ) : (
            <a
              key={section.title}
              href={section.href}
              className="flex flex-row justify-between items-center group px-2"
              style={{ textDecoration: "none" }}
            >
              <span className="text-base md:text-lg font-normal text-neutral-800 group-hover:text-orange-500 transition-colors duration-200 select-none">
                {section.title}
              </span>
            </a>
          ),
        )}
      </div>
      <footer className="absolute bottom-8 left-0 w-full flex justify-center text-xs text-gray-300 select-none">
        ©{new Date().getFullYear()} Edgar H. Site by Coolify, Cloudflare
      </footer>
    </div>
  );
}
