import React, { useState } from 'react';

const infoText = `I was thinking of starting a little blog in this section of the website. It's something I've never tried before, and I think it could boost my creativity. Throughout my academic journey, I've often struggled to find time to relax and keep an open mind. However, since starting my master's degree, I've experienced greater mental freedom. I started studying French intensively after my semester abroad, picked up the piano again, and took up cooking in my spare time. I also enjoy spending time in nature to clear my head.`;
// All images from public/hobbies/
const imageFilenames = [
  'bb4cb569-c469-4ca4-a825-9960ad865329.jpg',
  'c480c571-9804-4706-8019-3b414f55aa46.jpg',
  'd0cc2657-bf9f-481f-aebd-12c3d46895e4.jpg',
  'E2299479-E138-4791-91EC-D390E065F391.jpg',
  'IMG_1934.jpeg',
  'IMG_2064.jpeg',
  'IMG_8737.jpeg',
  '2BAB8307-5AC9-4810-8071-D0E19066B235_1_105_c.jpeg',
  '5DF98E1B-A75B-4E55-94E7-4D33CE3F571E_4_5005_c.jpeg',
  '9F2D336A-CF66-4488-A4FA-689327DFCF3E_1_105_c.jpeg',
];

function ImageWithLoader({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className="relative flex justify-center items-center w-full max-w-xs"
      style={{ minHeight: '150px', aspectRatio: '4/3' }}
    >
      {/* Blur placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded" />
      )}
      <img
        src={src}
        alt={alt}
        className={`object-contain max-h-60 w-full h-full rounded transition-all duration-700 ${loaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-sm'}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{ aspectRatio: '4/3' }}
      />
    </div>
  );
}

export default function Hobbies() {
  const mid = Math.ceil(imageFilenames.length / 2);
  const leftImages = imageFilenames.slice(0, mid);
  const rightImages = imageFilenames.slice(mid);

  return (
    <div className="flex flex-col min-h-screen bg-white py-12 relative">
      <div className="w-full max-w-6xl mx-auto flex flex-row items-start justify-center gap-8">
        {/* Left column images */}
        <div className="flex flex-col gap-8 items-end flex-1">
          {leftImages.map((filename, idx) => (
            <ImageWithLoader
              key={filename}
              src={`/hobbies/${filename}`}
              alt={`Hobby ${idx + 1}`}
            />
          ))}
        </div>
        {/* Info Text moved up */}
        <div className="flex flex-col items-center justify-start px-8 mt-8" style={{ minWidth: '320px', maxWidth: '400px' }}>
          <div className="text-xs md:text-sm font-normal text-neutral-700 whitespace-pre-line text-center leading-relaxed">
            {infoText}
          </div>
        </div>
        {/* Right column images */}
        <div className="flex flex-col gap-8 items-start flex-1">
          {rightImages.map((filename, idx) => (
            <ImageWithLoader
              key={filename}
              src={`/hobbies/${filename}`}
              alt={`Hobby ${idx + 1 + mid}`}
            />
          ))}
        </div>
      </div>
      <footer className="absolute bottom-8 left-0 w-full flex justify-center text-xs text-gray-300 select-none">
        ©{new Date().getFullYear()} Edgar H.      Site by Coolify, Cloudflare
      </footer>
    </div>
  );
} 