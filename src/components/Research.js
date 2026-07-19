import React from "react";
import { useNavigate } from "react-router-dom";
import { projects } from "../data/research";

export default function Research() {
  const navigate = useNavigate();
  const serif = { fontFamily: "Georgia, serif" };
  const linkCls =
    "underline decoration-neutral-300 underline-offset-2 hover:text-neutral-900 transition-colors";

  return (
    <div className="min-h-screen bg-white text-neutral-900">
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
          {/* ── Header: photo + name ── */}
          <header className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 mb-12">
            <img
              src="/hobbies/edgar.jpg"
              alt="Edgar Hipp"
              className="w-40 h-52 object-cover rounded-lg border border-neutral-200 shrink-0"
              loading="eager"
            />
            <div className="sm:flex-1 sm:text-center">
              <h1
                className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-900 mb-1"
                style={serif}
              >
                Edgar Hipp
              </h1>
              <p className="text-sm text-neutral-700" style={serif}>
                <b>Developer.</b> <b>KIT / Berlin.</b>
              </p>
            </div>
          </header>

          {/* ── Bio ── */}
          <h2
            className="text-lg font-bold tracking-tight text-neutral-900 mb-6"
            style={serif}
          >
            Bio
          </h2>

          <div className="flex flex-col gap-5 mb-16" style={serif}>
            <p className="text-lg text-neutral-700 leading-[1.7]">
              I spent half a year in Shanghai — learning Chinese and immersing
              myself — and left slightly obsessed with two things: the wet
              markets and the models coming out of Chinese labs.
            </p>
            <p className="text-lg text-neutral-700 leading-[1.7]">
              The seafood markets got me first — tanks of live fish, mantis
              shrimp still twitching, vendors who could gut a fish faster than I
              could point at it.
            </p>
            <p className="text-lg text-neutral-700 leading-[1.7]">
              The AI came next, and it rhymes. While everyone watched San
              Francisco, Chinese labs quietly shipped some of the most
              interesting open work of the last two years.{" "}
              <a href="https://arxiv.org/abs/2412.19437" target="_blank" rel="noreferrer" className={linkCls}>DeepSeek-V3</a>{" "}
              showed a frontier-scale mixture-of-experts could be trained
              cheaply;{" "}
              <a href="https://arxiv.org/abs/2501.12948" target="_blank" rel="noreferrer" className={linkCls}>DeepSeek-R1</a>{" "}
              showed reasoning could emerge from pure reinforcement learning.
              Alibaba's{" "}
              <a href="https://arxiv.org/abs/2412.15115" target="_blank" rel="noreferrer" className={linkCls}>Qwen</a>, Moonshot's Kimi
              {" ("}
              <a href="https://arxiv.org/abs/2507.20534" target="_blank" rel="noreferrer" className={linkCls}>K2</a>,{" "}
              <a href="https://arxiv.org/abs/2501.12599" target="_blank" rel="noreferrer" className={linkCls}>k1.5</a>
              {"), "}and Zhipu's{" "}
              <a href="https://arxiv.org/abs/2406.12793" target="_blank" rel="noreferrer" className={linkCls}>GLM</a>{" "}
              made it a field of its own.
            </p>
          </div>

          {/* ── Research ── */}
          <h2
            className="text-lg font-bold tracking-tight text-neutral-900 mb-6"
            style={serif}
          >
            Research
          </h2>

          <ul className="flex flex-col gap-8">
            {projects.map((p) => (
              <li key={p.slug}>
                <button
                  onClick={() => navigate(`/research/${p.slug}`)}
                  className="group flex gap-5 text-left w-full"
                >
                  {p.thumb && (
                    <span className="shrink-0 hidden sm:block">
                      <img
                        src={p.thumb}
                        alt=""
                        className="w-32 h-24 object-cover rounded border border-neutral-200"
                        loading="lazy"
                      />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span
                      className="block text-base text-neutral-900 group-hover:text-neutral-500 transition-colors underline decoration-neutral-300 underline-offset-2"
                      style={serif}
                    >
                      {p.title}
                    </span>
                    <span className="block text-sm text-neutral-600 mt-1" style={serif}>
                      {p.authors}
                    </span>
                    <span className="block text-xs text-neutral-500 mt-1 tracking-wide">
                      {p.venue}
                      {p.venue && p.year ? " · " : ""}
                      {p.year}
                    </span>
                    <span
                      className="block text-sm text-neutral-700 leading-[1.65] mt-2"
                      style={serif}
                    >
                      {p.summary}
                    </span>
                    <span className="block text-xs text-neutral-400 mt-2 tracking-wide group-hover:text-neutral-900 transition-colors">
                      read more →
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
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
