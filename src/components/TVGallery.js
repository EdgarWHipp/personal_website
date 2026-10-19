import React, { useLayoutEffect, useRef, useState } from "react";

// Fit the whole composition into the space left by the text and navigation.
export default function TVGallery({ children }) {
  const frameRef = useRef(null);
  const clusterRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const cluster = clusterRef.current;
    let animationFrame;
    const fit = () => {
      // Leave room for the rotated cases, perspective, shadows and focus rings.
      const next = Math.max(
        0.01,
        Math.min(
          1,
          (frame.clientWidth - 28) / cluster.offsetWidth,
          (frame.clientHeight - 28) / cluster.offsetHeight,
        ),
      );
      setScale((previous) =>
        Math.abs(previous - next) < 0.001 ? previous : next,
      );
    };
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(fit);
    });
    observer.observe(frame);
    observer.observe(cluster);
    fit();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="tv-gallery" ref={frameRef}>
      <section
        className="tv-cluster"
        aria-label="A few photographs from here and there"
        ref={clusterRef}
        style={{ "--tv-scale": scale }}
      >
        {children}
      </section>
    </div>
  );
}
