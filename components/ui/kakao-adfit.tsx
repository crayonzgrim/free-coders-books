"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

interface KakaoAdFitProps {
  unit: string;
  width: number;
  height: number;
  className?: string;
}

// Track script load state globally
let isScriptLoaded = false;

export function KakaoAdFit({ unit, width, height, className }: KakaoAdFitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLModElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize ad after script loads
  useEffect(() => {
    if (!isReady) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (window.adfit && adRef.current) {
        try {
          window.adfit.display(unit);
        } catch {
          // Silent fail - ad display error
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (adRef.current) {
        adRef.current.innerHTML = "";
      }
    };
  }, [isReady, unit]);

  const handleScriptLoad = () => {
    isScriptLoaded = true;
    setIsReady(true);
  };

  return (
    <>
      {/* Next.js Script with lazyOnload for better performance */}
      {!isScriptLoaded && (
        <Script
          src="//t1.daumcdn.net/kas/static/ba.min.js"
          strategy="lazyOnload"
          onLoad={handleScriptLoad}
          onError={() => {
            // Script failed to load - silent fail
          }}
        />
      )}

      {/* Reserve space for ad to prevent CLS */}
      <div
        ref={containerRef}
        className={className}
        style={{
          minWidth: width,
          minHeight: height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ins
          ref={adRef}
          className="kakao_ad_area"
          style={{ display: "none" }}
          data-ad-unit={unit}
          data-ad-width={width.toString()}
          data-ad-height={height.toString()}
        />
      </div>
    </>
  );
}

// TypeScript type declaration
declare global {
  interface Window {
    adfit?: {
      display: (unit: string) => void;
    };
  }
}
