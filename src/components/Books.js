import React from "react";
import { useNavigate } from "react-router-dom";

const books = [
  {
    id: "klein-und-wagner",
    dateLabel: "July 2026",
    title: "Klein und Wagner",
    author: "Hermann Hesse",
    note: "A short, tense novel about a man who leaves his life behind and drifts toward something he cannot name. I read it in a few sittings and keep thinking about the tension between escape and self-destruction.",
  },
  {
    id: "tschick",
    dateLabel: "June 2026",
    title: "Tschick",
    author: "Wolfgang Herrndorf",
    note: "Two boys steal a car and drive across eastern Germany with no real plan. It is funny and sad in exactly the way adolescence is. The dialogue stayed with me for days.",
  },
  {
    id: "fuer-polina",
    dateLabel: "May 2026",
    title: "Für Polina",
    author: "—",
    note: "A slim book I picked up without knowing much about it. Quiet, precise, and unexpectedly moving.",
  },
];

export default function Books() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
      `}</style>

      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-neutral-100">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
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
          <div className="flex flex-col gap-16">
            {books.map((book) => (
              <article key={book.id} className="flex flex-col">
                <div className="mb-3">
                  <span className="inline-block text-[11px] font-normal tracking-widest text-neutral-400 uppercase border border-neutral-200 rounded-full px-3 py-1">
                    {book.dateLabel}
                  </span>
                </div>
                <h2
                  className="text-xl md:text-2xl font-medium tracking-tight text-neutral-900 mb-1"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {book.title}
                </h2>
                <p className="text-sm text-neutral-400 mb-4">{book.author}</p>
                <p
                  className="text-base text-neutral-700 leading-[1.7]"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {book.note}
                </p>
                <div className="mt-12 w-10 h-px bg-neutral-200" />
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
