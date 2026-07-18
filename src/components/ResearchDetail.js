import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProject } from "../data/research";

export default function ResearchDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const project = getProject(slug);
  const serif = { fontFamily: "Georgia, serif" };

  if (!project) {
    return (
      <div className="min-h-screen bg-white text-neutral-900 flex flex-col items-center justify-center px-6">
        <p className="text-base text-neutral-600 mb-6" style={serif}>
          This project could not be found.
        </p>
        <button
          onClick={() => navigate("/research")}
          className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors tracking-wide"
        >
          ← back to research
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-neutral-100">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center">
          <button
            onClick={() => navigate("/research")}
            className="text-xs font-normal text-neutral-400 hover:text-neutral-900 transition-colors tracking-wide"
          >
            ← research
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-32 px-6">
        <article className="max-w-2xl mx-auto">
          {/* Title block */}
          <h1
            className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-900 mb-2"
            style={serif}
          >
            {project.title}
          </h1>
          <p className="text-sm text-neutral-600 mb-1" style={serif}>
            {project.authors}
          </p>
          <p className="text-xs text-neutral-500 tracking-wide mb-10">
            {project.venue}
            {project.venue && project.year ? " · " : ""}
            {project.year}
          </p>

          {/* Hero image */}
          {project.hero && (
            <figure className="mb-12">
              <img
                src={project.hero}
                alt={project.heroCaption || project.title}
                className="w-full object-cover rounded-md"
                style={{ maxHeight: "420px" }}
                loading="eager"
              />
              {project.heroCaption && (
                <figcaption className="mt-2 text-[11px] text-neutral-400 tracking-wide uppercase">
                  {project.heroCaption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Body */}
          <div className="flex flex-col gap-5">
            {project.body.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-base text-neutral-700 leading-[1.75]"
                style={serif}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.gallery.map((img, idx) => (
                <figure key={idx} className="flex flex-col">
                  <img
                    src={img.src}
                    alt={img.caption || `${project.title} ${idx + 1}`}
                    className="w-full object-cover rounded-md"
                    style={{ maxHeight: "260px" }}
                    loading="lazy"
                  />
                  {img.caption && (
                    <figcaption className="mt-2 text-[11px] text-neutral-400 tracking-wide uppercase">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </article>
      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-neutral-100">
        <div className="max-w-2xl mx-auto px-6 flex items-center justify-center">
          <span className="text-xs text-neutral-400">
            ©2026 Edgar Hipp. No rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
