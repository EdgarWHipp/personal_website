import React, { useEffect, useState, useRef } from "react";

const infoText = `Currently seeking opportunities in tech while finishing my masters. Love working on creative projects. Give me more sunshine`;

const hobbyImages = [
  "/hobbies/bb4cb569-c469-4ca4-a825-9960ad865329.avif",
  "/hobbies/IMG_6215(1).jpg",
  "/hobbies/IMG_8418.jpg",
  "/hobbies/IMG_8661.jpg",
  "/hobbies/me.jpeg",
];

const imageLocations = [
  "SCQ",
  "三亚",
  "福州",
  "福州",
  "上海",
];

const CYCLE_INTERVAL = 3500;
const FADE_DURATION = 700;

// TV geometry — fat bezel, no stand
const SW = 256;   // screen width
const SH = 192;   // screen height (4:3)
const BZ = 34;    // bezel thickness (top + sides)
const CHN = 52;    // bottom chin height
const TW = SW + BZ * 2;        // total TV width  = 324
const TH = BZ + SH + CHN;      // total TV height = 278
const DEP = 52;                  // depth of the TV body

// Speaker dot grid helper
function SpeakerGrid({ cols = 4, rows = 5 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 5px)`, gap: "4px" }}>
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 4, height: 4, borderRadius: "50%",
            background: "rgba(0,0,0,0.55)",
            boxShadow: "inset 0 1px 1px rgba(0,0,0,0.5)",
          }}
        />
      ))}
    </div>
  );
}

// Round TV knob
function Knob({ label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <div style={{
        width: 18, height: 18, borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%, #4a4540, #1a1715)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.1), 0 0 0 2px #0d0c0b",
        position: "relative",
      }}>
        {/* Indicator line */}
        <div style={{
          position: "absolute", top: 2, left: "50%",
          width: 1.5, height: 6,
          background: "rgba(255,255,255,0.35)",
          transform: "translateX(-50%)",
          borderRadius: 1,
        }} />
      </div>
      <span style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 6, color: "rgba(255,255,255,0.25)",
        letterSpacing: "0.1em", userSelect: "none",
      }}>{label}</span>
    </div>
  );
}

export default function Info() {
  const [time, setTime] = useState("");
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [fading, setFading] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [trackingShift, setTrackingShift] = useState(false);
  const [recVisible, setRecVisible] = useState(true);

  const currentRef = useRef(0);
  const timerRef = useRef(null);
  const fadeRef = useRef(null);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setRecVisible(v => !v), 900);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let t;
    const schedule = () => {
      t = setTimeout(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 100 + Math.random() * 170);
        schedule();
      }, 2800 + Math.random() * 5000);
    };
    schedule();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let t;
    const schedule = () => {
      t = setTimeout(() => {
        setTrackingShift(true);
        setTimeout(() => setTrackingShift(false), 300 + Math.random() * 350);
        schedule();
      }, 4500 + Math.random() * 7000);
    };
    schedule();
    return () => clearTimeout(t);
  }, []);

  const advanceTo = (next) => {
    setPrev(currentRef.current);
    setFading(true);
    clearTimeout(fadeRef.current);
    fadeRef.current = setTimeout(() => {
      currentRef.current = next;
      setCurrent(next);
      setPrev(null);
      setFading(false);
    }, FADE_DURATION);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      advanceTo((currentRef.current + 1) % hobbyImages.length);
    }, CYCLE_INTERVAL);
    return () => { clearInterval(timerRef.current); clearTimeout(fadeRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDotClick = (i) => {
    if (i === currentRef.current || fading) return;
    clearInterval(timerRef.current);
    clearTimeout(fadeRef.current);
    advanceTo(i);
    timerRef.current = setInterval(() => {
      advanceTo((currentRef.current + 1) % hobbyImages.length);
    }, CYCLE_INTERVAL);
  };

  const now = new Date();
  const camDate = now
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase().replace(",", "");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        @keyframes scanln {
          from { background-position: 0 0; }
          to   { background-position: 0 4px; }
        }
        @keyframes vhsGlitch {
          0%   { clip-path: inset(28% 0 62% 0); transform: translateX(-7px); }
          30%  { clip-path: inset(52% 0 22% 0); transform: translateX(9px);  }
          60%  { clip-path: inset(12% 0 78% 0); transform: translateX(-5px); }
          100% { clip-path: inset(42% 0 44% 0); transform: translateX(6px);  }
        }
        @keyframes trackBar {
          0%   { transform: translateY(-110%); opacity: 0; }
          20%  { opacity: 0.55; }
          80%  { opacity: 0.4; }
          100% { transform: translateY(110%);  opacity: 0; }
        }
        @keyframes noiseShift {
          0%  { background-position: 0 0; }
          25% { background-position: -7% 13%; }
          50% { background-position: 9% -16%; }
          75% { background-position: -11% 7%; }
          100%{ background-position: 0 0; }
        }
        @keyframes locationFade {
          0%  { opacity: 0; transform: translateY(4px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; }
          100%{ opacity: 0; }
        }
        @keyframes nameVHS {
          0%   { opacity: 0; }
          6%   { opacity: 0.9; }
          9%   { opacity: 0.1; }
          14%  { opacity: 1; }
          17%  { opacity: 0; }
          22%  { opacity: 0.8; }
          25%  { opacity: 0.2; }
          30%  { opacity: 1; }
          100% { opacity: 1; }
        }
        @keyframes cardFlicker {
          0%   { opacity: 0; }
          10%  { opacity: 0.9; }
          16%  { opacity: 0.1; }
          24%  { opacity: 1; }
          29%  { opacity: 0.3; }
          36%  { opacity: 1; }
          100% { opacity: 1; }
        }
        .name-vhs {
          animation: nameVHS 1.6s ease both;
        }
        .card-line-1 { animation: cardFlicker 1.2s ease 0.1s both; }
        .card-line-2 { animation: cardFlicker 1.2s ease 0.6s both; }
        .card-line-3 { animation: cardFlicker 1.2s ease 1.1s both; }
        .card-line-4 { animation: cardFlicker 1.2s ease 1.6s both; }
        .vhs-img { filter: contrast(1.12) saturate(0.6) brightness(0.78) sepia(0.22); }
        .vhs-glitch {
          animation: vhsGlitch 0.1s steps(1) infinite;
          filter: contrast(1.4) saturate(0.4) hue-rotate(20deg);
          mix-blend-mode: hard-light;
        }
        .track-bar { animation: trackBar 0.42s linear forwards; }
        .mono { font-family: 'Share Tech Mono', 'Courier New', monospace; }
        .loc-tag { animation: locationFade ${CYCLE_INTERVAL}ms ease forwards; }
        .pom-link {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(163,163,163,0.7);
          text-decoration: none;
          transition: all 0.2s ease;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .pom-link:hover { transform: scale(1.08); color: #f97316; }
      `}</style>

      <div
        className="text-xs md:text-sm font-normal text-neutral-700 dark:text-white text-center leading-relaxed"
        style={{ paddingTop: "18vh" }}
      >
        {/* POMODORO nav link */}
        <a href="/pomodoro" className="pom-link">pomodoro</a>

        <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-5 px-4">
          {/* Edgar Hipp title */}


          {/* Bio */}
          <p
            className="text-xs md:text-sm font-normal text-neutral-700 dark:text-white text-center leading-relaxed"
            style={{ maxWidth: "28rem" }}
          >
            {infoText}
          </p>

          {/* CV link */}
          <a
            href="/Resume___one_page-14.pdf"
            download
            className="text-xs md:text-sm text-neutral-500 dark:text-white underline hover:text-orange-500 transition-colors duration-200"
          >
            Download my CV (PDF)
          </a>

          {/* ── CRT TV ── */}
          <div style={{ perspective: "950px", perspectiveOrigin: "50% 45%" }}>
            <div
              style={{
                position: "relative",
                width: `${TW}px`,
                height: `${TH}px`,
                transformStyle: "preserve-3d",
                /* Only rotate on Y — no X tilt, so top face never shows */
                transform: "rotateY(-13deg)",
                margin: "0 auto",
              }}
            >

              {/* ══ FRONT FACE ══ */}
              <div
                style={{
                  position: "absolute",
                  width: `${TW}px`,
                  height: `${TH}px`,
                  transform: `translateZ(${DEP / 2}px)`,
                  /* Dark charcoal plastic with subtle gradient */
                  background: "linear-gradient(160deg, #2e2b27 0%, #201e1b 55%, #181614 100%)",
                  borderRadius: "14px",
                  boxShadow:
                    "inset 0 2px 8px rgba(255,255,255,0.06), inset 0 -3px 10px rgba(0,0,0,0.5)",
                }}
              >
                {/* ── Raised inner bezel around screen ── */}
                <div
                  style={{
                    position: "absolute",
                    top: BZ - 6,
                    left: BZ - 6,
                    width: SW + 12,
                    height: SH + 12,
                    background: "#111010",
                    borderRadius: "6px",
                    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.5)",
                  }}
                />

                {/* ── Screen ── */}
                <div
                  style={{
                    position: "absolute",
                    top: BZ,
                    left: BZ,
                    width: `${SW}px`,
                    height: `${SH}px`,
                    overflow: "hidden",
                    background: "#030303",
                    borderRadius: "4px",
                    boxShadow: "inset 0 0 28px rgba(0,0,0,0.98)",
                  }}
                >
                  {/* Prev image */}
                  {prev !== null && (
                    <img
                      src={hobbyImages[prev]} alt="" aria-hidden="true"
                      className="vhs-img"
                      style={{
                        position: "absolute", inset: 0,
                        width: "100%", height: "100%",
                        objectFit: "cover", zIndex: 1,
                        opacity: 0,
                        transition: `opacity ${FADE_DURATION}ms ease`,
                      }}
                    />
                  )}

                  {/* Current image */}
                  <img
                    src={hobbyImages[current]}
                    alt={`Hobby ${current + 1}`}
                    className="vhs-img"
                    style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%",
                      objectFit: "cover", zIndex: 2,
                      opacity: fading ? 0 : 1,
                      transition: `opacity ${FADE_DURATION}ms ease`,
                    }}
                  />

                  {/* Chromatic aberration */}
                  <img
                    src={hobbyImages[current]} alt="" aria-hidden="true"
                    style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%",
                      objectFit: "cover", zIndex: 3,
                      opacity: 0.15, mixBlendMode: "screen",
                      filter: "saturate(0.3) contrast(1.1)",
                      transform: "translateX(3px)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Glitch */}
                  {glitch && (
                    <img
                      src={hobbyImages[current]} alt="" aria-hidden="true"
                      className="vhs-glitch"
                      style={{
                        position: "absolute", inset: 0,
                        width: "100%", height: "100%",
                        objectFit: "cover", zIndex: 8,
                        pointerEvents: "none",
                      }}
                    />
                  )}

                  {/* Tracking bar */}
                  {trackingShift && (
                    <div className="track-bar" style={{
                      position: "absolute", left: 0, right: 0, top: 0,
                      height: "22%", zIndex: 9, pointerEvents: "none",
                      background:
                        "linear-gradient(to bottom, rgba(255,255,255,0.09), rgba(220,220,200,0.04), transparent)",
                      filter: "blur(0.5px)",
                    }} />
                  )}

                  {/* Scanlines */}
                  <div style={{
                    position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
                    backgroundImage:
                      "repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 4px)",
                    backgroundSize: "100% 4px",
                    animation: "scanln 0.22s linear infinite",
                  }} />

                  {/* Noise */}
                  <div style={{
                    position: "absolute", inset: "-50%", zIndex: 11,
                    width: "200%", height: "200%",
                    opacity: 0.055, pointerEvents: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: "180px",
                    animation: "noiseShift 0.35s steps(1) infinite",
                  }} />

                  {/* Vignette */}
                  <div style={{
                    position: "absolute", inset: 0, zIndex: 12, pointerEvents: "none",
                    background:
                      "radial-gradient(ellipse at center, transparent 48%, rgba(0,0,0,0.65) 100%)",
                  }} />

                  {/* Screen glare */}
                  <div style={{
                    position: "absolute", inset: 0, zIndex: 13, pointerEvents: "none",
                    background:
                      "linear-gradient(130deg, rgba(255,255,255,0.05) 0%, transparent 45%)",
                  }} />

                  {/* OSD — REC */}
                  <div className="mono" style={{
                    position: "absolute", top: 6, right: 8, zIndex: 16,
                    fontSize: "8px", letterSpacing: "0.12em",
                    color: recVisible ? "#ff2020" : "transparent",
                    textShadow: recVisible ? "0 0 5px #ff2020" : "none",
                    userSelect: "none",
                    display: "flex", alignItems: "center", gap: "3px",
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: recVisible ? "#ff2020" : "transparent",
                      boxShadow: recVisible ? "0 0 5px #ff4040" : "none",
                      display: "inline-block",
                    }} />
                    REC
                  </div>

                  {/* OSD — PLAY */}
                  <div className="mono" style={{
                    position: "absolute", top: 6, left: 8, zIndex: 16,
                    fontSize: "8px", letterSpacing: "0.1em",
                    color: "rgba(255,255,200,0.75)", userSelect: "none",
                  }}>
                    ▶ PLAY
                  </div>

                  {/* OSD — timestamp + location */}
                  <div className="mono" style={{
                    position: "absolute", bottom: 28, left: 7, zIndex: 16,
                    fontSize: "8px", letterSpacing: "0.07em", lineHeight: 1.6,
                    color: "rgba(255,255,200,0.82)",
                    textShadow: "0 0 4px rgba(255,255,150,0.5)",
                    userSelect: "none",
                  }}>
                    <div>{camDate}</div>
                    <div>{time}</div>
                    {/* Location tag — keyed to current so animation restarts per slide */}
                    <div
                      key={current}
                      className="loc-tag"
                      style={{ marginTop: 2, color: "rgba(200,240,255,0.9)" }}
                    >
                      {imageLocations[current]}
                    </div>
                  </div>

                  {/* Dot indicators */}
                  <div style={{
                    position: "absolute", bottom: 7, left: 0, right: 0,
                    display: "flex", justifyContent: "center", gap: 5, zIndex: 16,
                  }}>
                    {hobbyImages.map((_, i) => (
                      <div
                        key={i}
                        onClick={() => handleDotClick(i)}
                        style={{
                          width: i === current ? 14 : 5, height: 4,
                          background:
                            i === current ? "rgba(255,255,200,0.9)" : "rgba(255,255,255,0.22)",
                          transition: "width 0.35s ease, background 0.35s ease",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </div>
                </div>
                {/* ── end screen ── */}

                {/* ── Chin / control panel ── */}
                <div style={{
                  position: "absolute",
                  top: BZ + SH + 10,
                  left: BZ,
                  width: SW,
                  height: CHN - 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  {/* Speaker grill */}
                  <div style={{ opacity: 0.6 }}>
                    <SpeakerGrid cols={5} rows={3} />
                  </div>

                  {/* Brand */}
                  <span className="mono" style={{
                    fontSize: "9px", letterSpacing: "0.25em",
                    color: "rgba(255,255,255,0.18)", userSelect: "none",
                  }}>
                    EH·8000
                  </span>

                  {/* Knobs */}
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Knob label="VOL" />
                    <Knob label="CH" />
                  </div>
                </div>

              </div>
              {/* ══ end FRONT FACE ══ */}

              {/* ══ RIGHT FACE only ══ */}
              <div style={{
                position: "absolute",
                top: 0,
                width: `${DEP}px`,
                height: `${TH}px`,
                background:
                  "linear-gradient(to right, #1c1a17 0%, #141210 70%, #0e0d0b 100%)",
                transform: `rotateY(90deg) translateZ(${TW / 2}px)`,
                borderRadius: "0 14px 14px 0",
              }} />



            </div>
          </div>
          {/* ── end TV ── */}

        </div>

        {/* Footer */}
        <footer
          className="absolute left-0 w-full flex justify-center select-none"
          style={{ bottom: "4.5rem" }}
        >
          <div className="w-full max-w-xl mx-auto flex flex-row justify-between items-end px-4 text-xs text-neutral-500">
            <div className="text-left leading-tight">
              <span className="card-line-1">Berlin, Germany</span><br />
              <span className="card-line-2">Edgar Hipp</span><br />
              <span className="card-line-3">Student, Software Engineer</span><br />
              <span className="card-line-4">edgarhipp@protonmail.com</span>
            </div>

          </div>
        </footer>

        <footer className="absolute bottom-8 left-0 w-full flex justify-center text-xs text-gray-300 select-none">
          ©{new Date().getFullYear()} Edgar H. Site by Coolify, Cloudflare
        </footer>
      </div>
    </>
  );
}
