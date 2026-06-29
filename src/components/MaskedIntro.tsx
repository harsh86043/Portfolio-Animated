import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function MaskedIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskGroupRef = useRef<SVGGElement>(null);
  const zoomBgRef = useRef<HTMLDivElement>(null);
  const textTitleRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Timeline to coordinate mask zooming and text fading
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=120%", // Pin for longer scroll distance
        scrub: 1.0,
        pin: true,
        anticipatePin: 1,
        onLeave: () => {
          // Complete transition
          gsap.to(overlayRef.current, { opacity: 0, duration: 0.5 });
        },
        onEnterBack: () => {
          gsap.to(overlayRef.current, { opacity: 1, duration: 0.5 });
        }
      }
    });

    // 1. Zoom the mask scale massively so we go "through" the mask opening
    tl.to(maskGroupRef.current, {
      scale: 30,
      transformOrigin: "center center",
      ease: "power2.inOut",
    }, 0);

    // 2. Scale the background image down to natural size (parallax depth)
    tl.to(zoomBgRef.current, {
      scale: 1.0,
      filter: "blur(0px)",
      ease: "power2.inOut",
    }, 0);

    // 3. Fade out introductory title text
    tl.to(textTitleRef.current, {
      opacity: 0,
      y: -50,
      scale: 0.9,
      ease: "power1.out",
    }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-cyber-dark overflow-hidden z-50 select-none"
    >
      {/* Background container that is revealed through the mask */}
      <div className="absolute inset-0 w-full h-full">
        {/* Dynamic radial gradient bubbles from design theme */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#3d140b_0%,transparent_50%),radial-gradient(circle_at_20%_80%,#1a103d_0%,transparent_50%)] opacity-85 z-10" />

        <div
          ref={zoomBgRef}
          className="absolute inset-0 w-full h-full scale-[1.65] filter blur-[4px] bg-cover bg-center transition-all duration-300"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop')",
          }}
        >
          {/* Sunset/Neon color grading overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40 mix-blend-multiply" />
        </div>
      </div>

      {/* Giant backdropped stroke name inspired by design template "VANE" */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none z-10">
        <div className="text-[130px] md:text-[220px] font-black leading-none uppercase tracking-tighter text-transparent border-white border-[0.5px] opacity-10 select-none font-display">
          HARSH
        </div>
      </div>

      {/* SVG Mask Layer */}
      {/* The black background shape masks everything except inside the defined path */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="none">
        <defs>
          <clipPath id="gta-logo-mask" clipPathUnits="userSpaceOnUse">
            {/* Highly engineered geometric gaming-style "HS" logo monogram */}
            {/* Center-scaled relative paths that work on responsive viewports */}
            <g id="gta-logo-mask-group" ref={maskGroupRef} style={{ transform: "scale(1)" }}>
              {/* Vertical left leg of H */}
              <rect x="-90" y="-120" width="45" height="240" rx="4" transform="translate(960, 540) rotate(-15)" />
              {/* Vertical right leg of H */}
              <rect x="45" y="-120" width="45" height="240" rx="4" transform="translate(960, 540) rotate(-15)" />
              {/* Intersecting bar of H */}
              <rect x="-90" y="-15" width="180" height="30" rx="2" transform="translate(960, 540) rotate(-15)" />
              {/* Inner geometric cuts and aesthetic details */}
              <circle cx="0" cy="0" r="10" transform="translate(960, 540)" />
              {/* Top and Bottom Chevron Accent Cuts */}
              <polygon points="0,-160 -40,-200 40,-200" transform="translate(960, 540) rotate(-15)" />
              <polygon points="0,160 -40,200 40,200" transform="translate(960, 540) rotate(-15)" />
            </g>
          </clipPath>
        </defs>
      </svg>

      {/* Masking overlay element itself */}
      <div
        ref={overlayRef}
        className="absolute inset-0 w-full h-full bg-cyber-dark pointer-events-none z-20 transition-opacity duration-500"
        style={{
          clipPath: "url(#gta-logo-mask)"
        }}
      />

      {/* Inverse Solid Outer Screen to draw the black border outside the mask */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-20 flex items-center justify-center">
        {/* We use standard modern CSS to mask out the SVG shape */}
        <div className="absolute inset-0 bg-cyber-dark opacity-100 z-10 [clip-path:polygon(0%_0%,_100%_0%,_100%_100%,_0%_100%)]">
          {/* Overlay mask using clip-path with a custom SVG shape inversion */}
          <div 
            className="absolute inset-0 bg-cyber-dark" 
            style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          />
        </div>
      </div>

      {/* Floating typography overlaid on the mask during zoom */}
      <div
        ref={textTitleRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center z-30 px-4 select-none"
      >
        <div className="flex items-center gap-2 mb-3 bg-white/5 border border-white/15 px-3.5 py-1.5 rounded-full backdrop-blur-sm animate-pulse-soft">
          <span className="w-2 h-2 bg-[#ff4d00] rounded-full" />
          <span className="font-mono text-[9px] tracking-widest text-white/90 uppercase font-bold">INTRODUCING THE PORTFOLIO</span>
        </div>

        <h1 className="font-display font-black text-6xl md:text-8xl tracking-tighter leading-none text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
          HARSH
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d00] via-purple-500 to-indigo-500">
            SURYAVANSHI
          </span>
        </h1>

        <p className="mt-4 font-mono text-[11px] md:text-xs tracking-[0.3em] uppercase text-white/60">
          Creative Technologist // 3D Web Architect
        </p>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 flex flex-col items-center gap-1.5 opacity-80 animate-bounce">
          <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-white/50">SCROLL TO REVEAL</span>
          <ChevronDown className="w-4 h-4 text-[#ff4d00]" />
        </div>
      </div>

      {/* Aesthetic Side Rails & Margin Labels */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-10 font-mono text-[8px] tracking-[0.3em] text-white/20 uppercase origin-left -rotate-90 select-none">
        <div className="flex items-center gap-4">
          <div className="w-16 h-px bg-white/10 relative">
            <div className="absolute top-0 left-0 w-6 h-px bg-[#ff4d00]"></div>
          </div>
          <span>The Portfolio v6.0</span>
        </div>
      </div>
      <div className="absolute right-10 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-10 font-mono text-[8px] tracking-[0.3em] text-white/20 uppercase origin-right rotate-90 select-none">
        <span>ROCKSTAR INSPIRED GRID MODEL</span>
      </div>
    </div>
  );
}
