import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// All images from public/hobbies/
const imageFilenames = [
  "bb4cb569-c469-4ca4-a825-9960ad865329.avif",
  "c480c571-9804-4706-8019-3b414f55aa46.avif",
  "d0cc2657-bf9f-481f-aebd-12c3d46895e4.avif",
  "IMG_1934.avif",
  "IMG_2064.avif",
  "IMG_8737.avif",
  "2BAB8307-5AC9-4810-8071-D0E19066B235_1_105_c.avif",
  "5DF98E1B-A75B-4E55-94E7-4D33CE3F571E_4_5005_c.avif",
];

// Placeholder texts for each image
const imageTexts = [
  "A rainy hike, Santiago de Compestega",
  "Suits and old cars, Vienna",
  "Fête de la Musique at the Seine, Paris",
  "Viktoriapark, Berlin",
  "Meeting good friends, Paris",
  "Cider with my brother, London",
  "Explorer cat, Leipzig",
  "Skyline, Shanghai",
];

// Info text for each image
const infoTexts = [
  `I was thinking of starting a little blog in this section of the website. It's something I've never tried before, and I think it could boost my creativity. Throughout my academic journey, I've often struggled to find time to relax and keep an open mind. However, since starting my master's degree, I've experienced greater mental freedom. I started studying French intensively after my semester abroad, picked up the piano again, and took up cooking in my spare time. I also enjoy spending time in nature to clear my head.`,
  `Je pense que j'aurais intérêt à écrire quelques articles de blog en français pour progresser dans la langue. J'adore la culture française et je sens que je dois retourner souvent à Paris. Pour le moment, je suis vraiment ravi de mes opportunités et j'ai la chance de pouvoir explorer de plus en plus, que ce soit à Shanghai ou à Paris. Au revoir ! On se voit bientôt.`,
  `Playing the piano is my escape. Each note helps me unwind and brings a sense of calm after a busy day.`,
  `Experimenting in the kitchen is both fun and relaxing. Rainy days are perfect for trying out new recipes and enjoying comfort food.`,
  `My desk is where ideas come to life. The view outside keeps me inspired and focused on my goals.`,
  `Biking through the city is my way of exploring and staying active. Every ride brings a new discovery.`,
  `Studying abroad opened my eyes to new cultures and experiences. It was a time of growth and adventure.`,
  `The soft evening light in my apartment creates a peaceful atmosphere, perfect for reflection and relaxation.`,
];

export default function Hobbies() {
  const [current, setCurrent] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(
    Array(imageFilenames.length).fill(false),
  );
  const [showTooltip, setShowTooltip] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const navigate = useNavigate();

  // Close viewer on Escape
  useEffect(() => {
    if (!viewerOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setViewerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewerOpen]);

  const handleImgLoad = (idx) => {
    setImgLoaded((l) => {
      const arr = [...l];
      arr[idx] = true;
      return arr;
    });
  };

  const goLeft = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const goRight = () => {
    if (current < 1) {
      setCurrent((c) => c + 1);
    }
  };

  const rightBlocked = current >= 1;

  return (
    <div className="flex flex-col min-h-screen py-12 relative items-center justify-center main-dark-bg">
      {/* Back button top left */}
      <button
        onClick={() => navigate("/cv")}
        className="absolute left-8 top-8 text-xs md:text-sm px-6 py-2 border-b border-neutral-400 text-neutral-500 hover:text-neutral-800 hover:border-neutral-800 transition-colors bg-transparent focus:outline-none focus:ring-0 outline-none z-20"
        style={{ letterSpacing: "0.08em" }}
      >
        &#8592;
      </button>
      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-8">
        {/* Fixed slider area */}
        <div
          className="flex flex-col items-center justify-center w-full"
          style={{ height: "520px", minHeight: "520px" }}
        >
          <div
            className="flex flex-row items-center justify-center gap-4 w-full"
            style={{ height: "320px", minHeight: "320px" }}
          >
            {/* Left button */}
            <button
              onClick={goLeft}
              className="px-3 py-2 text-lg text-neutral-400 hover:text-neutral-700 focus:outline-none select-none border border-transparent hover:border-neutral-200 rounded transition"
              aria-label="Previous image"
              disabled={current === 0}
              style={{ height: "48px" }}
            >
              &#8592;
            </button>
            {/* Image */}
            <div
              className="flex flex-col items-center justify-center"
              style={{
                minWidth: "320px",
                maxWidth: "480px",
                height: "260px",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  height: "260px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={`/hobbies/${imageFilenames[current]}`}
                  alt={`Hobby ${current + 1}`}
                  className={`object-contain w-full max-w-2xl transition-all duration-700 outline-none ${imgLoaded[current] ? "blur-0" : "blur-sm"}`}
                  loading="lazy"
                  onLoad={() => handleImgLoad(current)}
                  style={{
                    aspectRatio: "4/3",
                    height: "260px",
                    width: "100%",
                    maxWidth: "480px",
                    cursor: "zoom-in",
                  }}
                  onClick={() => setViewerOpen(true)}
                  tabIndex={0}
                />
              </div>
              <div
                className="text-xs md:text-sm text-neutral-500 dark:text-white select-none text-center"
                style={{
                  fontFamily: "inherit",
                  height: "28px",
                  marginTop: "20px",
                }}
              >
                {imageTexts[current]}
              </div>
            </div>
            {/* Right button with tooltip */}
            <div
              className="relative flex items-center"
              style={{ height: "48px" }}
            >
              <button
                onClick={goRight}
                className={`px-3 py-2 text-lg focus:outline-none select-none border border-transparent rounded transition ${rightBlocked ? "opacity-50 cursor-not-allowed blur-[1.5px]" : "text-neutral-400 hover:text-neutral-700 hover:border-neutral-200"}`}
                aria-label="Next image"
                disabled={rightBlocked}
                onMouseEnter={() => rightBlocked && setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{ height: "48px" }}
              >
                &#8594;
              </button>
              {rightBlocked && showTooltip && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-neutral-800 text-white text-xs rounded shadow select-none whitespace-nowrap z-10">
                  Under maintenance
                </div>
              )}
            </div>
          </div>
          {/* Info Text in a fixed area for monotony */}
          <div
            className="flex flex-col items-center justify-start px-4"
            style={{ height: "64px", marginTop: "48px" }}
          >
            <div
              className="text-xs md:text-sm font-normal text-neutral-700 dark:text-white whitespace-pre-line text-center leading-relaxed flex items-center justify-center w-full"
              style={{ fontFamily: "inherit", height: "64px" }}
            >
              {infoTexts[current]}
            </div>
          </div>
        </div>
      </div>
      {/* Image viewer modal */}
      {viewerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-zoom-out"
          onClick={() => setViewerOpen(false)}
        >
          <img
            src={`/hobbies/${imageFilenames[current]}`}
            alt={`Hobby ${current + 1}`}
            className="max-w-full max-h-[90vh] object-contain outline-none"
            style={{ background: "transparent" }}
            onClick={(e) => e.stopPropagation()}
            tabIndex={0}
          />
        </div>
      )}
      <footer className="absolute bottom-8 left-0 w-full flex justify-center text-xs text-gray-300 select-none">
        ©{new Date().getFullYear()} Edgar H. Site by Coolify, Cloudflare
      </footer>
    </div>
  );
}
