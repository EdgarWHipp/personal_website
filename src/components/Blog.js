import React from "react";
import { useNavigate } from "react-router-dom";

const posts = [
  {
    id: "speculative-design-workshop",
    title: "My First Speculative Design Workshop",
    date: "May 2025",
    content: `For my Master's thesis at KIT, I ran speculative design workshops in Leipzig and Munich. We explored what digitally resurrected animals might actually look like — a question far removed from the usual CS curriculum. I was hooked immediately: finally, a creative research topic that had nothing to do with threading exercises, object-oriented programming, or yet another AI chatbot thesis. The participant pool across both cities was wonderfully eclectic, spanning finance doctorates, opera singers, and egyptology students. That diversity is exactly what made the ideas so fresh. Leipzig set the foundation; Munich let us dig deeper into the concepts we uncovered.`,
    images: [
      "/figures/ws1_workshop_overview.jpg",
      "/figures/ws1_groupwork.jpg",
    ],
  },
  {
    id: "job-in-berlin",
    title: "Thoughts and getting a job in Berlin",
    date: "June 2025",
    content: `I loved my time in Paris — long evenings by the Seine, discovering spots like Partisan Café and Caveau de la Huchette, wandering through the city with no plan. Shanghai was equally unforgettable, from late nights at SLAB TOWN to exploring neighborhoods I'd never heard of. But I'm glad to settle down in Berlin for now. The tech scene here is strong, unpretentious, and full of people actually building things. It feels like the right place to be at this stage.`,
    images: [],
  },
];

export default function Blog() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen py-12 relative main-dark-bg items-center">
      {/* Back button top left */}
      <button
        onClick={() => navigate("/info")}
        className="absolute left-8 top-8 text-xs md:text-sm px-6 py-2 border-b border-neutral-400 text-neutral-500 hover:text-neutral-800 hover:border-neutral-800 transition-colors bg-transparent focus:outline-none z-20"
        style={{ letterSpacing: "0.08em" }}
      >
        &#8592;
      </button>

      <div className="w-full max-w-2xl mx-auto px-6 md:px-8 mt-12">
        <h1 className="text-2xl md:text-3xl font-normal text-neutral-800 mb-12 text-center tracking-tight">
          Blog
        </h1>

        <div className="flex flex-col gap-16">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg md:text-xl font-normal text-neutral-800 tracking-tight">
                  {post.title}
                </h2>
                <span className="text-xs text-neutral-400 uppercase tracking-widest">
                  {post.date}
                </span>
              </div>

              {post.images.length > 0 && (
                <div className="flex flex-col md:flex-row gap-3 my-2">
                  {post.images.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`${post.title} ${idx + 1}`}
                      className="w-full md:w-1/2 object-cover rounded-sm"
                      style={{ maxHeight: "280px" }}
                      loading="lazy"
                    />
                  ))}
                </div>
              )}

              <div className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
            </article>
          ))}
        </div>
      </div>

      <footer className="absolute bottom-8 left-0 w-full flex justify-center text-xs text-gray-300 select-none">
        ©{new Date().getFullYear()} Edgar H. Site by Coolify, Cloudflare
      </footer>
    </div>
  );
}
