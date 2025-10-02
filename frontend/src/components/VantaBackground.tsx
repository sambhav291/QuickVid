"use client";

import { useRef, useEffect } from 'react';

// Declare VANTA types for TypeScript to avoid errors
declare global {
  interface Window {
    VANTA: {
      HALO: (options: Record<string, unknown>) => { destroy: () => void };
    };
    THREE: unknown;
  }
}

const VantaBackground = () => {
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect: { destroy: () => void } | null = null;

    // Dynamically load scripts to avoid server-side rendering issues
    const threeScript = document.createElement('script');
    threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
    document.body.appendChild(threeScript);

    threeScript.onload = () => {
      const vantaScript = document.createElement('script');
      vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js';
      document.body.appendChild(vantaScript);

      vantaScript.onload = () => {
        if (vantaRef.current && window.VANTA) {
          vantaEffect = window.VANTA.HALO({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            backgroundColor: 0x0d1117, // Dark background color
            amplitudeFactor: 1.20,
            xOffset: 0.26,
            size: 1.5,
          });
        }
      };
    };

    // Cleanup function to destroy the effect when the component unmounts
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  return <div ref={vantaRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default VantaBackground;