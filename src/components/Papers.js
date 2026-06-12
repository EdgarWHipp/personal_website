import React from "react";
import { useNavigate } from "react-router-dom";

export default function Papers() {
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
          <h1
            className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-900 mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Papers
          </h1>
          <p
            className="text-base text-neutral-700 leading-[1.7]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            A place for notes on papers that shaped how I think about HCI, AI, and design. More soon.
          </p>
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
