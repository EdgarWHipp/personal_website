// src/components/CV.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

const sections = [
  { title: "Info", href: "/info" },
  { title: "Software", href: "/software" },
  { title: "Experience", href: "/experience" },
  { title: "Hobbies & Blog", href: "/hobbies" },
  { 
    title: "Software to test", 
    href: "#",
    subItems: [
      { title: "Bwell", href: "/bwell" },
      { title: "fluencypunch", href: "/fluencypunch" }
    ]
  },
  { title: "Impressum", href: "/impressum" },
];

export default function CV() {
  const [expandedSections, setExpandedSections] = useState(new Set());

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
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
        {sections.map((section) => (
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
                      {expandedSections.has(section.title) ? '−' : '+'}
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
                      {expandedSections.has(section.title) ? '−' : '+'}
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
