import React from "react";
import { useNavigate } from "react-router-dom";

export default function Software() {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col items-center min-h-screen pt-24 relative main-dark-bg"
      style={{ fontFamily: "inherit" }}
    >
      {/* Back button top left */}
      <button
        onClick={() => navigate("/cv")}
        className="absolute left-8 top-8 text-xs md:text-sm px-6 py-2 border-b border-neutral-400 text-neutral-500 hover:text-neutral-800 hover:border-neutral-800 transition-colors bg-transparent focus:outline-none z-20"
        style={{ letterSpacing: "0.08em" }}
      >
        &#8592;
      </button>
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 mt-0 px-4 md:px-0 pb-20">
        <section className="bg-orange-500 relative border-2 border-black p-4 md:p-5 select-none shadow-[4px_4px_0_0_#000] transition-all hover:shadow-[6px_6px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5">
          <div className="flex items-start gap-2 mb-2">
            <h2 className="text-base md:text-lg font-normal text-neutral-800 tracking-tight flex-1">
              Generation of generic distribution network models based on
              statistical analyses
            </h2>
            <span className="bg-black text-white text-xs font-normal px-2 py-1 uppercase whitespace-nowrap">
              Current
            </span>
          </div>
          <p className="text-sm md:text-base font-normal text-neutral-800">
            Research project on distribution network modeling.
          </p>
        </section>
        <section className="bg-orange-500 relative border-2 border-black p-4 md:p-5 select-none shadow-[4px_4px_0_0_#000] transition-all hover:shadow-[6px_6px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5">
          <div className="flex items-start gap-2 mb-2">
            <h2 className="text-base md:text-lg font-normal text-neutral-800 tracking-tight flex-1">
              Interactive Language learning App for conversation practise
            </h2>
            <span className="bg-black text-white text-xs font-normal px-2 py-1 uppercase whitespace-nowrap">
              Current
            </span>
          </div>
          <p className="text-sm md:text-base font-normal text-neutral-800">
            App for practicing language conversations interactively.
          </p>
        </section>
        <section className="bg-orange-500 relative border-2 border-black p-4 md:p-5 select-none shadow-[4px_4px_0_0_#000] transition-all hover:shadow-[6px_6px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5">
          <h2 className="text-base md:text-lg font-normal text-neutral-800 tracking-tight mb-2">
            Amplify
          </h2>
          <p className="text-sm md:text-base font-normal text-neutral-800">
            Portfolio optimization with statistical physics.
          </p>
          <p className="text-xs md:text-sm font-normal text-neutral-800 mt-1 italic">
            Vercel, React, Tailwind, Python, FastAPI, Google Cloud
          </p>
        </section>
        <section className="bg-orange-500 relative border-2 border-black p-4 md:p-5 select-none shadow-[4px_4px_0_0_#000] transition-all hover:shadow-[6px_6px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5">
          <h2 className="text-base md:text-lg font-normal text-neutral-800 tracking-tight mb-2">
            Bachelor Thesis
          </h2>
          <p className="text-sm md:text-base font-normal text-neutral-800">
            Fine-grained access control for model driven software.
          </p>
          <p className="text-xs md:text-sm font-normal text-neutral-800 mt-1 italic">
            Key-Policy and Ciphertext-Policy Attribute-Based Encryption
          </p>
        </section>
      </div>
      <footer className="absolute bottom-8 left-0 w-full flex justify-center text-xs text-gray-300 select-none">
        ©{new Date().getFullYear()} Edgar H. Site by Coolify, Cloudflare
      </footer>
    </div>
  );
}
