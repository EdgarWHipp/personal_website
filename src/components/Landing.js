import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1
        className="text-6xl md:text-6.3xl font-extrabold tracking-tight mb-10 uppercase text-black select-none"
        style={{ letterSpacing: "0.04em" }}
      >
        Edgar H.
      </h1>
      <p className="text-lg md:text-2xl text-gray-400 mb-20 tracking-wide uppercase select-none">
        Software / Photos / Teaching / Language
      </p>
      <button
        onClick={() => navigate("/cv")}
        className="text-2xl md:text-3xl font-light border-b border-black hover:text-orange-500 hover:border-orange-500 transition-colors duration-200 px-10 py-2 tracking-widest uppercase bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
        style={{ letterSpacing: "0.15em" }}
      >
        Enter
      </button>
    </div>
  );
}
