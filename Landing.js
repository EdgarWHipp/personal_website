import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
        Your Name
      </h1>
      <p className="text-lg text-gray-500 mb-12">Info</p>
      <button
        onClick={() => navigate("/cv")}
        className="text-xl border-b-2 border-black hover:text-primary-600 hover:border-primary-600 transition px-6 py-2"
      >
        Enter
      </button>
    </div>
  );
}
