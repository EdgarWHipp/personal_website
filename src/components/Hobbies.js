import React, { useState } from 'react';

const infoText = `I was thinking of starting a little blog in this section of the website. It's something I've never tried before, and I think it could boost my creativity. Throughout my academic journey, I've often struggled to find time to relax and keep an open mind. However, since starting my master's degree, I've experienced greater mental freedom. I started studying French intensively after my semester abroad, picked up the piano again, and took up cooking in my spare time. I also enjoy spending time in nature to clear my head.`;
// All images from public/hobbies/
const imageFilenames = [
  'bb4cb569-c469-4ca4-a825-9960ad865329.avif',
  'c480c571-9804-4706-8019-3b414f55aa46.avif',
  'd0cc2657-bf9f-481f-aebd-12c3d46895e4.avif',
  'IMG_1934.avif',
  'IMG_2064.avif',
  'IMG_8737.avif',
  '2BAB8307-5AC9-4810-8071-D0E19066B235_1_105_c.avif',
  '5DF98E1B-A75B-4E55-94E7-4D33CE3F571E_4_5005_c.avif', 
];

export default function Hobbies() {
  // Track loaded state for each image
  const [imgLoaded, setImgLoaded] = useState(Array(imageFilenames.length).fill(false));

  // All images loaded?
  const allLoaded = imgLoaded.every(Boolean);

  // Split images for left and right columns
  const mid = Math.ceil(imageFilenames.length / 2);
  const leftImages = imageFilenames.slice(0, mid);
  const rightImages = imageFilenames.slice(mid);

  const handleImgLoad = idx => {
    setImgLoaded(l => {
      const arr = [...l];
      arr[idx] = true;
      return arr;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white py-12 relative">
      <div className="w-full max-w-6xl mx-auto flex flex-row items-start justify-center gap-8">
        {/* Left column images */}
        <div className="flex flex-col gap-8 items-end flex-1">
          {leftImages.map((filename, idx) => (
            <img
              key={filename}
              src={`/hobbies/${filename}`}
              alt={`Hobby ${idx + 1}`}
              className={`object-contain max-h-60 w-full max-w-xs transition-all duration-700 ${allLoaded ? 'blur-0' : 'blur-sm'}`}
              loading="lazy"
              onLoad={() => handleImgLoad(idx)}
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
            <img
              key={filename}
              src={`/hobbies/${filename}`}
              alt={`Hobby ${idx + 1 + mid}`}
              className={`object-contain max-h-60 w-full max-w-xs transition-all duration-700 ${allLoaded ? 'blur-0' : 'blur-sm'}`}
              loading="lazy"
              onLoad={() => handleImgLoad(idx + mid)}
            />
          ))}
        </div>
      </div>
      <footer className="absolute bottom-8 left-0 w-full flex justify-center text-xs text-gray-300 select-none">
        ©{new Date().getFullYear()} Edgar H.
      </footer>
    </div>
  );
} 