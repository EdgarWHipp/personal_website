import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Software() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center min-h-screen bg-white pt-24 relative" style={{ fontFamily: 'inherit' }}>
      {/* Back button top left */}
      <button
        onClick={() => navigate('/cv')}
        className="absolute left-8 top-8 text-xs md:text-sm px-6 py-2 border-b border-neutral-400 text-neutral-500 hover:text-neutral-800 hover:border-neutral-800 transition-colors bg-transparent focus:outline-none z-20"
        style={{ letterSpacing: '0.08em' }}
      >
        &#8592;
      </button>
      <div className="w-full max-w-md mx-auto flex flex-col gap-6 mt-0 items-center justify-center" style={{ minHeight: '220px' }}>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold text-neutral-800 mb-1">Amplify</h2>
          <p className="text-sm text-neutral-600 text-center">Portfolio optimization with statistical physics.</p>
          <em className="text-sm text-neutral-500 text-center">Vercel, React, Tailwind, Python, FastAPI, Google Cloud</em>
        </div>
          <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold text-neutral-800 mb-1">Bachelor Thesis</h2>
          <p className="text-sm text-neutral-600 text-center">Fine-grained access control for model driven software.</p>
          <em className="text-sm text-neutral-500 text-center">Key-Policy and Ciphertext-Policy Attribute-Based Encryption</em>
        </div>
      </div>
      <footer className="absolute bottom-8 left-0 w-full flex justify-center text-xs text-gray-300 select-none">
        ©{new Date().getFullYear()} Edgar H.      Site by Coolify, Cloudflare
      </footer>
    </div>
  );
}
