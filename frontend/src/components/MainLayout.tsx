"use client";

import { useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import { useAppContext } from '@/context/AppContext';

declare global {
  interface Window {
    VANTA: {
      NET: (options: Record<string, unknown>) => { destroy: () => void };
    };
  }
}

function VantaBackground() {
  const vantaRef = useRef(null);
  
  useEffect(() => {
    let vantaEffect: { destroy: () => void } | null = null;
    const threeScript = document.createElement("script");
    threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
    document.body.appendChild(threeScript);

    threeScript.onload = () => {
      const vantaScript = document.createElement("script");
      vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
      document.body.appendChild(vantaScript);

      vantaScript.onload = () => {
        if (vantaRef.current && window.VANTA && window.VANTA.NET) {
          vantaEffect = window.VANTA.NET({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x4f9cf9,
            backgroundColor: 0x0a0e1a,
            points: 8.00,
            maxDistance: 25.00,
            spacing: 18.00
          });
        }
      };
    };

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return <div ref={vantaRef} className="fixed top-0 left-0 w-full h-full -z-20" />;
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { showAuthModal } = useAppContext();

  return (
    <div className="min-h-screen text-white font-sans relative">
      <VantaBackground />
      <div className="grid-background" />
      
      {/* Floating Orbs for Added Depth */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10 floating" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 floating" style={{animationDelay: '2s'}} />
      
      <Navbar />
      <main className="relative z-10">{children}</main>
      {showAuthModal && <AuthModal />}
    </div>
  );
}




// "use client";

// import { useRef, useEffect } from 'react';
// import Navbar from '@/components/Navbar';
// import AuthModal from '@/components/AuthModal';
// import { useAppContext } from '@/context/AppContext';

// // Declare global window types for VANTA
// declare global {
//   interface Window {
//     VANTA: {
//       HALO: (options: Record<string, unknown>) => { destroy: () => void };
//     };
//   }
// }

// function VantaBackground() {
//   const vantaRef = useRef(null);
  
//   useEffect(() => {
//     let vantaEffect: { destroy: () => void } | null = null;
//     const threeScript = document.createElement("script");
//     threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
//     document.body.appendChild(threeScript);

//     threeScript.onload = () => {
//       const vantaScript = document.createElement("script");
//       vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js";
//       document.body.appendChild(vantaScript);

//       vantaScript.onload = () => {
//         if (vantaRef.current && window.VANTA && window.VANTA.HALO) {
//           vantaEffect = window.VANTA.HALO({
//             el: vantaRef.current,
//             mouseControls: true,
//             touchControls: true,
//             gyroControls: false,
//             minHeight: 200.00,
//             minWidth: 200.00,
//             backgroundColor: 0x0d1117,
//             amplitudeFactor: 1.20,
//             xOffset: 0.26,
//             size: 1.5,
//           });
//         }
//       };
//     };

//     return () => {
//       if (vantaEffect) vantaEffect.destroy();
//     };
//   }, []);

//   return <div ref={vantaRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
// }

// export default function MainLayout({ children }: { children: React.ReactNode }) {
//   const { showAuthModal } = useAppContext();

//   return (
//     <div className="min-h-screen text-white font-sans relative">
//       <VantaBackground />
//       <Navbar />
//       <main>{children}</main>
//       {showAuthModal && <AuthModal />}
//     </div>
//   );
// }
