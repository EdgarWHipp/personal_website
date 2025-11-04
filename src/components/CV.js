// src/components/CV.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const sections = [
  { title: "Info", href: "/info" },
  { title: "Software", href: "/software" },
  { title: "Experience", href: "/experience" },
  { title: "Hobbies & Blog", href: "/hobbies" },
  { title: "Legal Notice", href: "/legal_notice" },
];

export default function CV() {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState(new Set());

  const persona = (() => {
    const qs = new URLSearchParams(location.search);
    return (qs.get("view") || "guest").toLowerCase();
  })();

  const visibleSections = (() => {
    if (persona === "recruiter") {
      // Prioritize experience for recruiter view; optionally hide hobbies
      return [
        { title: "Experience", href: "/experience" },
        { title: "Info", href: "/info" },
        { title: "Impressum", href: "/impressum" },
      ];
    }
    return sections;
  })();

  const toggleSection = (title) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative">
      {/* Top right boxes for favorite spots */}
      <div className="absolute top-8 right-8 flex flex-col gap-3 w-64 hidden lg:flex">
        <section className="bg-orange-500 border-2 border-black p-3 shadow-[4px_4px_0_0_#000] select-none">
          <h3 className="text-sm font-normal text-neutral-800 tracking-tight mb-2">
            Mes endroits préférés à Paris
          </h3>
          <ul className="text-xs font-normal text-neutral-800 space-y-1">
            <li>• </li>
            <li>• </li>
            <li>• </li>
          </ul>
        </section>
        <section className="bg-orange-500 border-2 border-black p-3 shadow-[4px_4px_0_0_#000] select-none">
          <h3 className="text-sm font-normal text-neutral-800 tracking-tight mb-2">
            Meine Lieblingsorte in Berlin
          </h3>
          <ul className="text-xs font-normal text-neutral-800 space-y-1">
            <li>• </li>
            <li>• </li>
            <li>• </li>
          </ul>
        </section>
        <section className="bg-orange-500 border-2 border-black p-3 shadow-[4px_4px_0_0_#000] select-none">
          <h3 className="text-sm font-normal text-neutral-800 tracking-tight mb-2">
            我在上海最喜欢的地方
          </h3>
          <ul className="text-xs font-normal text-neutral-800 space-y-1">
            <li>• </li>
            <li>• </li>
            <li>• </li>
          </ul>
        </section>

        {/* Profile image */}
        <div className="mt-3 border-2 border-black shadow-[4px_4px_0_0_#000]">
          <img
            src="/profile-temple.jpg"
            alt="Edgar at temple in Shanghai"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
        {visibleSections.map((section) => (
          <div key={section.title}>
            {section.href.startsWith("/") ? (
              <div>
                <Link
                  to={section.href}
                  className="flex flex-row justify-between items-center group px-2"
                  style={{ textDecoration: "none" }}
                  onClick={(e) => {
                    if (section.subItems && section.subItems.length > 0) {
                      e.preventDefault();
                      toggleSection(section.title);
                    }
                  }}
                >
                  <span className="text-base md:text-lg font-normal text-neutral-800 group-hover:text-orange-500 transition-colors duration-200 select-none">
                    {section.title}
                  </span>
                  {section.subItems && section.subItems.length > 0 && (
                    <span className="text-neutral-400 group-hover:text-orange-400 transition-colors duration-200">
                      {expandedSections.has(section.title) ? "−" : "+"}
                    </span>
                  )}
                </Link>

                {/* Sub-items */}
                {section.subItems && expandedSections.has(section.title) && (
                  <div className="ml-8 mt-2 space-y-2">
                    {section.subItems.map((subItem) => (
                      <Link
                        key={subItem.title}
                        to={subItem.href}
                        className="flex flex-row justify-between items-center group px-2"
                        style={{ textDecoration: "none" }}
                      >
                        <span className="text-sm md:text-base font-normal text-neutral-600 group-hover:text-orange-500 transition-colors duration-200 select-none">
                          {subItem.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex flex-row justify-between items-center group px-2 w-full text-left"
                  style={{ textDecoration: "none" }}
                >
                  <span className="text-base md:text-lg font-normal text-neutral-800 group-hover:text-orange-500 transition-colors duration-200 select-none">
                    {section.title}
                  </span>
                  {section.subItems && section.subItems.length > 0 && (
                    <span className="text-neutral-400 group-hover:text-orange-400 transition-colors duration-200">
                      {expandedSections.has(section.title) ? "−" : "+"}
                    </span>
                  )}
                </button>

                {/* Sub-items */}
                {section.subItems && expandedSections.has(section.title) && (
                  <div className="ml-8 mt-2 space-y-2">
                    {section.subItems.map((subItem) => (
                      <Link
                        key={subItem.title}
                        to={subItem.href}
                        className="flex flex-row justify-between items-center group px-2"
                        style={{ textDecoration: "none" }}
                      >
                        <span className="text-sm md:text-base font-normal text-neutral-600 group-hover:text-orange-500 transition-colors duration-200 select-none">
                          {subItem.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <footer className="absolute bottom-8 left-0 w-full flex justify-center text-xs text-gray-300 select-none">
        ©{new Date().getFullYear()} Edgar H. Site by Coolify, Cloudflare
      </footer>
    </div>
  );
}
