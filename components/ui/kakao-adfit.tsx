"use client";

import { useEffect, useRef } from "react";

interface KakaoAdFitProps {
  unit: string;
  width: number;
  height: number;
  className?: string;
}

// 스크립트 로드 상태
let isScriptLoaded = false;

export function KakaoAdFit({ unit, width, height, className }: KakaoAdFitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // 스크립트 로드 (한 번만)
    if (!isScriptLoaded) {
      const existingScript = document.querySelector(
        'script[src*="t1.daumcdn.net/kas/static/ba.min.js"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
        script.async = true;
        document.head.appendChild(script);
      }
      isScriptLoaded = true;
    }

    // 컴포넌트 언마운트 시 광고 정리
    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <ins
        ref={adRef}
        className="kakao_ad_area"
        style={{ display: "none" }}
        data-ad-unit={unit}
        data-ad-width={width.toString()}
        data-ad-height={height.toString()}
      />
    </div>
  );
}

// TypeScript 타입 선언
declare global {
  interface Window {
    adfit?: {
      display: (unit: string) => void;
    };
  }
}
