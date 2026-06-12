import React from "react";
import { useNavigate } from "react-router-dom";

const posts = [
  {
    id: "speculative-design-workshop",
    dateLabel: "June 2026",
    title: "My First Speculative Design Workshop",
    subtitle: "Running workshops on digital afterlives with an eclectic group of participants.",
    content: [
      `For my Master's thesis at KIT, I ran two speculative design workshops in Leipzig and Munich. The workshop was meant to answer the following question: How can deceased pets be represented in extended reality? It is a strange question, but that was the point.`,
      `The participants came from all over: finance doctorates, opera singers, egyptology students, and a few engineers who kept trying to make the problem smaller. The mix made the discussions richer than they would have been with a purely technical group. People argued about ethics, ownership, and grief before anyone mentioned a model architecture.`,
      `I left both workshops convinced that speculative design is less about predicting the future and more about making it concrete enough to discuss.`,
    ],
    images: [
      "/figures/ws1_workshop_overview.jpg",
      "/figures/ws2_workshop_overview.jpg",
    ],
    imageCaptions: [
      "Workshop overview, Leipzig.",
      "Workshop overview, Munich.",
    ],
  },
  {
    id: "job-in-berlin",
    dateLabel: "July 2026",
    title: "Settling in Berlin",
    subtitle: "Back in Germany after Shanghai.",
    content: [
      `Shanghai changed how I think about speed. The scale of the city and the sense that everything is being built in real time pushed me to keep up. It was exciting, but it also made me notice how much I need quieter surroundings to actually get things done.`,
      `Berlin is home, and the pace suits me better. The tech scene is unpretentious and full of people just building things, which is what I want to be around right now.`,
      `I am finishing my Master's thesis while working at a startup here. For now, this is the right place to be.`,
    ],
    images: [],
    imageCaptions: [],
  },
];

export default function Blog() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
      `}</style>

      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-neutral-100">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center">
          <button
            onClick={() => navigate("/info")}
            className="text-xs font-normal text-neutral-400 hover:text-neutral-900 transition-colors tracking-wide"
          >
            ← back
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-32 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Posts */}
          <div className="flex flex-col gap-20">
            {posts.map((post) => (
              <article key={post.id} className="flex flex-col">
                  {/* Date label */}
                  <div className="mb-4">
                    <span className="inline-block text-[11px] font-normal tracking-widest text-neutral-400 uppercase border border-neutral-200 rounded-full px-3 py-1">
                      {post.dateLabel}
                    </span>
                  </div>

                  {/* Title block */}
                  <div className="mb-6">
                    <h2
                      className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-900 mb-2"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-base text-neutral-500 leading-relaxed">
                      {post.subtitle}
                    </p>
                  </div>

                  {/* Images */}
                  {post.images.length > 0 && (
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                      {post.images.map((src, idx) => (
                        <figure
                          key={idx}
                          className={`${post.images.length === 1 ? "w-full" : "w-full md:w-1/2"} flex flex-col`}
                        >
                          <img
                            src={src}
                            alt={post.imageCaptions[idx] || `${post.title} ${idx + 1}`}
                            className="w-full object-cover rounded-md"
                            style={{ maxHeight: "320px" }}
                            loading="lazy"
                          />
                          {post.imageCaptions[idx] && (
                            <figcaption className="mt-2 text-[11px] text-neutral-400 tracking-wide uppercase">
                              {post.imageCaptions[idx]}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  )}

                  {/* Body */}
                  <div className="flex flex-col gap-4">
                    {post.content.map((paragraph, idx) => (
                      <p
                        key={idx}
                        className="text-base text-neutral-700 leading-[1.7]"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="mt-16 w-10 h-px bg-neutral-200" />
                </article>
            ))}
          </div>
        </div>
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
