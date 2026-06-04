import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// All slides: existing hobbies + new workshop images + blog texts
const slides = [
  {
    path: "/hobbies/bb4cb569-c469-4ca4-a825-9960ad865329.avif",
    caption: "A rainy hike, Santiago de Compostela",
    text: `I was thinking of starting a little blog in this section of the website. It's something I've never tried before, and I think it could boost my creativity. Throughout my academic journey, I've often struggled to find time to relax and keep an open mind. However, since starting my master's degree, I've experienced greater mental freedom. I started studying French intensively after my semester abroad, picked up the piano again, and took up cooking in my spare time. I also enjoy spending time in nature to clear my head.`,
  },
  {
    path: "/hobbies/IMG_6215(1).jpg",
    caption: "Suits and old cars, Vienna",
    text: `Je pense que j'aurais intérêt à écrire quelques articles de blog en français pour progresser dans la langue. J'adore la culture française et je sens que je dois retourner souvent à Paris. Pour le moment, je suis vraiment ravi de mes opportunités et j'ai la chance de pouvoir explorer de plus en plus, que ce soit à Shanghai ou à Paris. Au revoir ! On se voit bientôt.`,
  },
  {
    path: "/hobbies/IMG_8418.jpg",
    caption: "Fête de la Musique at the Seine, Paris",
    text: `My Erasmus semester in Paris has been a time of great reflection and personal growth. I've learned a lot about myself and the world around me. I've also made some amazing friends and experiences that I'll cherish forever.`,
  },
  {
    path: "/hobbies/IMG_8661.jpg",
    caption: "Viktoriapark, Berlin",
    text: `Berlin has become my home base. After my time at PwC, I joined a startup here and I'm loving the energy. The city moves fast, and so does the tech scene. It's the perfect place to finish my Master's while gaining real hands-on experience. On weekends, I still seek out quiet spots like this to recharge.`,
  },
  {
    path: "/hobbies/me.jpeg",
    caption: "Shanghai",
    text: `Sometimes I look back at my time in Shanghai and realize how much that experience shaped me. Now, with a new role in a Berlin startup and my Master's thesis wrapping up, I feel like I'm at another inflection point. I'm excited for what's ahead — building things, solving problems, and hopefully finding time to keep cooking and playing piano along the way.`,
  },
  {
    path: "/figures/ws1_workshop_overview.jpg",
    caption: "Workshop for my Master's thesis",
    text: `Holding this workshop for my Master's thesis was one of the highlights of my academic journey. I designed activities to explore human-computer interaction concepts with participants, and seeing everyone engage so actively exceeded my expectations. The overview shot captures the energy in the room — people collaborating, discussing, and creating together.`,
  },
  {
    path: "/figures/ws1_groupwork.jpg",
    caption: "Group work during the workshop",
    text: `The group work sessions were where the real magic happened. Participants dove into hands-on activities, and the discussions that emerged were incredibly insightful. This workshop not only provided rich data for my thesis but also reminded me why I chose HCI in the first place — technology is at its best when it brings people together to solve meaningful problems.`,
  },
];

export default function Hobbies() {
  const [current, setCurrent] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(Array(slides.length).fill(false));
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
    if (current < slides.length - 1) setCurrent((c) => c + 1);
  };

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
      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-8 px-4">
        {/* Fixed slider area */}
        <div
          className="flex flex-col items-center justify-center w-full"
          style={{ height: "520px", minHeight: "520px" }}
        >
          <div
            className="flex flex-row items-center justify-center gap-2 md:gap-4 w-full"
            style={{ height: "300px", minHeight: "300px" }}
          >
            {/* Left button */}
            <button
              onClick={goLeft}
              className="px-2 md:px-3 py-2 text-lg text-neutral-400 hover:text-neutral-700 focus:outline-none select-none border border-transparent hover:border-neutral-200 rounded transition"
              aria-label="Previous image"
              disabled={current === 0}
              style={{ height: "48px", opacity: current === 0 ? 0.3 : 1 }}
            >
              &#8592;
            </button>
            {/* Image */}
            <div
              className="flex flex-col items-center justify-center w-full"
              style={{
                maxWidth: "360px",
                height: "240px",
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
                <div
                  onClick={() => setViewerOpen(true)}
                  tabIndex={0}
                  style={{
                    aspectRatio: "4/3",
                    height: "240px",
                    width: "100%",
                    maxWidth: "360px",
                    cursor: "zoom-in",
                  }}
                >
                  <img
                    src={slides[current].path}
                    alt={slides[current].caption}
                    className={`object-contain w-full max-w-2xl transition-all duration-700 outline-none ${imgLoaded[current] ? "blur-0" : "blur-sm"}`}
                    loading="lazy"
                    onLoad={() => handleImgLoad(current)}
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                  />
                </div>
              </div>
              <div
                className="text-xs md:text-sm text-neutral-500 dark:text-white select-none text-center"
                style={{
                  fontFamily: "inherit",
                  height: "28px",
                  marginTop: "20px",
                }}
              >
                {slides[current].caption}
              </div>
            </div>
            {/* Right button */}
            <div
              className="relative flex items-center"
              style={{ height: "48px" }}
            >
              <button
                onClick={goRight}
                className="px-2 md:px-3 py-2 text-lg focus:outline-none select-none border border-transparent rounded transition text-neutral-400 hover:text-neutral-700 hover:border-neutral-200"
                aria-label="Next image"
                disabled={current === slides.length - 1}
                style={{ height: "48px", opacity: current === slides.length - 1 ? 0.3 : 1 }}
              >
                &#8594;
              </button>
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
              {slides[current].text}
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
            src={slides[current].path}
            alt={slides[current].caption}
            className="max-w-full max-h-[90vh] object-contain outline-none"
            style={{ background: "transparent" }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <footer className="absolute bottom-8 left-0 w-full flex justify-center text-xs text-gray-300 select-none">
        ©{new Date().getFullYear()} Edgar H. Site by Coolify, Cloudflare
      </footer>
    </div>
  );
}
