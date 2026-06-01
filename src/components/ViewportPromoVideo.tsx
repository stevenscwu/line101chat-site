"use client";

import { useEffect, useRef, useState } from "react";

type ViewportPromoVideoProps = {
  src: string;
  poster?: string;
  ariaLabel?: string;
};

export function ViewportPromoVideo({ src, poster, ariaLabel }: ViewportPromoVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      const animationFrame = requestAnimationFrame(() => setIsVisible(true));

      return () => cancelAnimationFrame(animationFrame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.2,
      },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-[390px] overflow-hidden rounded-[2rem] border border-white/15 bg-black shadow-[0_26px_80px_rgba(0,0,0,0.38)]"
    >
      {isVisible ? (
        <video
          className="aspect-[9/16] h-auto w-full bg-black object-cover"
          controls
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={ariaLabel}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <div className="aspect-[9/16] w-full bg-black" aria-hidden="true" />
      )}
    </div>
  );
}
