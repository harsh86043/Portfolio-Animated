import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FrameSequenceCanvas, { FrameSequenceCanvasRef } from "./FrameSequenceCanvas";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { ChevronDown, Award } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function IntroAboutSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<FrameSequenceCanvasRef>(null);
  
  const introRef = useRef<HTMLDivElement>(null);
  const minimalIntroRef = useRef<HTMLDivElement>(null);
  const desktopHeroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [preloadsDone, setPreloadsDone] = useState(0);
  const [showDebugSafeZone, setShowDebugSafeZone] = useState(false);
  const totalFrames = 97;

  useEffect(() => {
    // Media Query for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // If prefers-reduced-motion is true:
      // Show content normally without scroll-trigger pin, set opacity/scale directly
      gsap.set(introRef.current, { opacity: 1, y: 0 });
      gsap.set(desktopHeroRef.current, { opacity: 1, x: 0 });
      gsap.set(aboutRef.current, { opacity: 1, x: 0 });
      // Draw frame 97 immediately (static fallback)
      if (canvasRef.current) {
        canvasRef.current.drawFrame(97);
      }
      return;
    }

    // Set up GSAP ScrollTrigger timeline with matchMedia
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // 1. DESKTOP ANIMATION FLOW (min-width: 1024px)
      mm.add("(min-width: 1024px)", () => {
        // Initial setup
        gsap.set(minimalIntroRef.current, { opacity: 1, y: 0, pointerEvents: "none" });
        gsap.set(desktopHeroRef.current, { opacity: 0, x: 40, pointerEvents: "none" });
        gsap.set(aboutRef.current, { opacity: 0, x: 100, pointerEvents: "none" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            pin: viewportRef.current,
            anticipatePin: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              const currentFrame = Math.min(
                totalFrames,
                Math.max(1, Math.round(progress * (totalFrames - 1) + 1))
              );
              if (canvasRef.current) {
                canvasRef.current.drawFrame(currentFrame);
              }
            }
          }
        });

        const frameObj = { frame: 1 };

        // Play frame sequence across the scroll distance
        tl.to(frameObj, {
          frame: totalFrames,
          ease: "none",
          duration: 1,
          onUpdate: () => {
            if (canvasRef.current) {
              canvasRef.current.drawFrame(frameObj.frame);
            }
          }
        }, 0);

        // Phase A: Minimal Intro cue fades out (0% to 15% scroll progress)
        tl.to(minimalIntroRef.current, {
          opacity: 0,
          y: -20,
          ease: "power2.out",
          duration: 0.15
        }, 0);

        // Phase B: Full Desktop Hero card slides and fades in (15% to 35% scroll progress)
        tl.to(desktopHeroRef.current, {
          opacity: 1,
          x: 0,
          ease: "power2.out",
          pointerEvents: "auto",
          duration: 0.20
        }, 0.15);

        // Phase C: Desktop Hero card slides and fades out (55% to 70% scroll progress)
        tl.to(desktopHeroRef.current, {
          opacity: 0,
          x: -40,
          ease: "power2.in",
          pointerEvents: "none",
          duration: 0.15
        }, 0.55);

        // Phase D: About card slides and fades in (70% to 100% scroll progress)
        tl.to(aboutRef.current, {
          opacity: 1,
          x: 0,
          ease: "power2.out",
          pointerEvents: "auto",
          duration: 0.30
        }, 0.70);
      });

      // 2. MOBILE & TABLET ANIMATION FLOW (max-width: 1023px)
      mm.add("(max-width: 1023px)", () => {
        // Initial setup
        gsap.set(introRef.current, { opacity: 1, y: 0, pointerEvents: "auto" });
        gsap.set(aboutRef.current, { opacity: 0, x: 100, pointerEvents: "none" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            pin: viewportRef.current,
            anticipatePin: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              const currentFrame = Math.min(
                totalFrames,
                Math.max(1, Math.round(progress * (totalFrames - 1) + 1))
              );
              if (canvasRef.current) {
                canvasRef.current.drawFrame(currentFrame);
              }
            }
          }
        });

        const frameObj = { frame: 1 };

        // Play frame sequence across the scroll distance
        tl.to(frameObj, {
          frame: totalFrames,
          ease: "none",
          duration: 1,
          onUpdate: () => {
            if (canvasRef.current) {
              canvasRef.current.drawFrame(frameObj.frame);
            }
          }
        }, 0);

        // Mobile Intro fades out early (0% to 25% scroll progress)
        tl.to(introRef.current, {
          opacity: 0,
          y: -60,
          ease: "power2.out",
          pointerEvents: "none",
          duration: 0.25
        }, 0);

        // About card fades/slides in late (75% to 100% scroll progress)
        tl.to(aboutRef.current, {
          opacity: 1,
          x: 0,
          ease: "power2.out",
          pointerEvents: "auto",
          duration: 0.25
        }, 0.75);
      });

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [isPreloaded]);

  const handleFirstFrameLoaded = () => {
    setIsPreloaded(true);
  };

  const handleAllFramesLoaded = () => {
    setPreloadsDone(100);
  };

  return (
    <div
      ref={containerRef}
      id="intro-about-container"
      className="relative w-full bg-[#04020a]"
      style={{ height: "300vh" }}
    >
      <div
        ref={viewportRef}
        className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      >
        {/* Canvas Background Frame Sequence (z-0) */}
        <FrameSequenceCanvas
          ref={canvasRef}
          totalFrames={totalFrames}
          onFirstFrameLoaded={handleFirstFrameLoaded}
          onAllFramesLoaded={handleAllFramesLoaded}
        />

        {/* Debug Safe-Zone Helper Overlay (z-15) */}
        {showDebugSafeZone && (
          <div className="absolute inset-0 pointer-events-none z-15 hidden lg:block select-none">
            {/* Left-side Avatar Zone (Danger Zone) */}
            <div className="absolute inset-y-0 left-0 w-[55%] bg-red-500/10 border-r border-dashed border-red-500/30 flex flex-col justify-between p-8 animate-pulse-soft">
              <div className="font-mono text-[10px] text-red-400/90 font-bold bg-red-950/70 px-3 py-1.5 rounded self-start border border-red-500/30 backdrop-blur-sm">
                ▲ AVATAR ZONE (DANGER ZONE FOR CONTENT)
              </div>
              <div className="font-mono text-[9px] text-red-400/60 leading-relaxed max-w-xs bg-black/60 p-3 rounded border border-red-500/10 backdrop-blur-sm">
                Frame sequence character moves in this left 55% region. No persistent desktop text or cards should overlap this area.
              </div>
            </div>
            {/* Right-side Content Safe Zone */}
            <div className="absolute inset-y-0 right-0 w-[45%] bg-emerald-500/5 border-l border-dashed border-emerald-500/20 flex flex-col justify-between p-8">
              <div className="font-mono text-[10px] text-emerald-400/90 font-bold bg-emerald-950/70 px-3 py-1.5 rounded self-start border border-emerald-500/30 backdrop-blur-sm">
                ◆ DESKTOP CONTENT SAFE ZONE (RIGHT)
              </div>
              <div className="font-mono text-[9px] text-emerald-400/60 leading-relaxed max-w-xs self-end text-right bg-black/60 p-3 rounded border border-emerald-500/10 backdrop-blur-sm">
                Safe zone aligned to the right. Desktop Hero and About cards are positioned here and never overlap the avatar.
              </div>
            </div>
          </div>
        )}

        {/* Cinematic Atmospheric Overlay Gradients (z-10) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04020a] via-transparent to-[#04020a]/70 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/70 z-10 pointer-events-none" />
        <div className="absolute inset-0 scanlines opacity-[0.08] z-10 pointer-events-none" />

        {/* Grid Line Accents (z-10) */}
        <div className="absolute inset-x-0 top-0 h-px bg-white/5 z-10" />
        <div className="absolute inset-y-0 left-12 w-px bg-white/5 z-10 hidden md:block" />
        <div className="absolute inset-y-0 right-12 w-px bg-white/5 z-10 hidden md:block" />

        {/* Floating HUD Labels (z-10) */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col gap-10 font-mono text-[8px] tracking-[0.3em] text-white/10 uppercase origin-left -rotate-90 select-none">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-white/10" />
            <span>SYS.CINEMATIC_ENGINE // V1.0</span>
          </div>
        </div>

        {/* ========================================================
            A. DESKTOP EXCLUSIVE: MINIMALIST INTRO (z-30)
            ======================================================== */}
        <div
          ref={minimalIntroRef}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-3 text-center hidden lg:flex pointer-events-none"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-black/40 backdrop-blur-md">
            <span className="w-1.5 h-1.5 bg-[#ff4d00] rounded-full animate-ping" />
            <span className="font-mono text-[9px] tracking-[0.3em] text-white/70 uppercase font-bold">
              SECURE NODE ACTIVE // SCROLL TO COMMENCE
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-white/40 animate-bounce mt-1" />
        </div>

        {/* ========================================================
            B. DESKTOP EXCLUSIVE: FULL HERO SAFE-ZONE CARD (z-30)
            ======================================================== */}
        <div
          ref={desktopHeroRef}
          className="absolute top-1/2 right-[clamp(3rem,7vw,8rem)] -translate-y-1/2 w-[clamp(420px,38vw,620px)] max-w-[620px] z-30 flex-col items-start text-left pointer-events-none hidden lg:flex"
        >
          <div className="w-full bg-black/35 backdrop-blur-[8px] border border-white/8 p-[clamp(1.5rem,2vw,2.5rem)] rounded-[24px] shadow-2xl pointer-events-auto flex flex-col gap-6 select-none">
            {/* Status Badge */}
            <div className="inline-flex self-start items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 bg-[#ff4d00] rounded-full animate-pulse" />
              <span className="font-mono text-[9px] tracking-[0.2em] text-white/80 uppercase font-bold">
                AVAILABLE FOR ELITE ROLES // 2026
              </span>
            </div>

            {/* Header info */}
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-[#ff4d00] uppercase font-bold">
                {PORTFOLIO_DATA.title}
              </span>
              <h1 className="font-display font-black text-4xl xl:text-5xl tracking-tight text-white uppercase leading-none">
                HARSH
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d00] via-purple-500 to-indigo-500">
                  SURYAVANSHI
                </span>
              </h1>
              <p className="font-display font-bold text-sm xl:text-base text-white/50 tracking-wide mt-1">
                {PORTFOLIO_DATA.subtitle}
              </p>
            </div>

            <div className="w-12 h-px bg-white/20 my-1" />

            {/* Tagline */}
            <p className="text-gray-300 text-xs xl:text-sm font-light leading-relaxed">
              {PORTFOLIO_DATA.tagline}
            </p>

            {/* Interactive CTAs */}
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => {
                  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                }}
                className="px-5 py-2.5 rounded-xl border border-[#ff4d00]/30 hover:border-[#ff4d00]/60 bg-[#ff4d00]/5 text-[#ff4d00] hover:text-white hover:bg-[#ff4d00]/10 font-mono text-[9px] tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer shadow-orange-glow"
              >
                EXPLORE BIOGRAPHY
              </button>
              <button
                onClick={() => {
                  alert("Resume download initiated! (In production this links to your PDF)");
                }}
                className="px-5 py-2.5 rounded-xl text-white/40 hover:text-white font-mono text-[9px] tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer"
              >
                GET RESUME
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            C. MOBILE EXCLUSIVE: HERO CONTENT OVERLAY (z-30)
            ======================================================== */}
        <div
          ref={introRef}
          className="absolute inset-0 flex flex-col justify-end pb-24 md:pb-32 items-center text-center px-6 z-30 lg:hidden"
        >
          <div className="max-w-4xl flex flex-col items-center">
            {/* Top Badge */}
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 bg-[#ff4d00] rounded-full animate-pulse" />
              <span className="font-mono text-[9px] tracking-[0.3em] text-white/60 uppercase font-bold">
                PORTFOLIO OVERVIEW // SECURE NODE
              </span>
            </div>

            {/* Name Heading */}
            <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tight text-white uppercase select-none leading-none">
              {PORTFOLIO_DATA.name}
            </h1>

            {/* Subtitle */}
            <p className="font-mono text-xs md:text-sm text-[#ff4d00] tracking-[0.2em] uppercase font-bold mt-4 [text-shadow:0_0_12px_rgba(255,77,0,0.3)]">
              {PORTFOLIO_DATA.subtitle}
            </p>

            <div className="w-12 h-px bg-white/20 my-6" />

            {/* Tagline */}
            <p className="text-gray-300 text-sm max-w-xl font-light leading-relaxed select-none">
              {PORTFOLIO_DATA.tagline}
            </p>

            {/* Scroll Cue */}
            <div className="mt-10 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
              <span className="font-mono text-[8px] tracking-[0.3em] text-white/30 uppercase">
                SCROLL TO SEQUENCE
              </span>
              <ChevronDown className="w-4 h-4 text-white/40 animate-bounce" />
            </div>
          </div>
        </div>

        {/* ========================================================
            D. UNIVERSAL: ABOUT CONTENT CONTAINER (z-30)
            ======================================================== */}
        <div
          ref={aboutRef}
          className="absolute inset-y-0 right-0 lg:right-16 xl:right-24 flex items-center justify-center lg:justify-end px-4 md:px-8 z-30 w-full lg:w-[42vw] max-w-full md:max-w-2xl pointer-events-none"
        >
          <div className="w-full bg-black/80 lg:bg-black/35 backdrop-blur-[14px] lg:backdrop-blur-[8px] border border-white/10 lg:border-white/8 p-6 md:p-10 rounded-[24px] shadow-2xl pointer-events-auto flex flex-col gap-6 select-none">
            {/* Header */}
            <div className="flex flex-col gap-1.5 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-[#ff4d00] font-mono text-[9px] tracking-[0.3em] uppercase font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>SYNC_NODE // BIOGRAPHY</span>
              </div>
              <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight uppercase">
                {PORTFOLIO_DATA.aboutHeading}
              </h2>
            </div>

            {/* Biography text */}
            <p className="text-gray-300 text-xs md:text-sm font-light leading-relaxed">
              {PORTFOLIO_DATA.aboutText}
            </p>

            {/* Highlight Points */}
            <div className="flex flex-col gap-4">
              {PORTFOLIO_DATA.highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-start border-l-2 border-[#ff4d00]/30 hover:border-[#ff4d00]/80 pl-4 py-0.5 transition-colors duration-300"
                >
                  <div className="flex flex-col gap-0.5">
                    <h4 className="font-display font-bold text-xs text-white tracking-wide uppercase">
                      {item.title}
                    </h4>
                    <p className="text-gray-400 text-xs font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => {
                  alert("Resume download initiated! (In production this links to your PDF)");
                }}
                className="px-5 py-2.5 rounded-xl border border-[#ff4d00]/30 hover:border-[#ff4d00]/60 bg-[#ff4d00]/5 text-[#ff4d00] hover:text-white hover:bg-[#ff4d00]/10 font-mono text-[9px] tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer shadow-orange-glow"
              >
                VIEW RESUME
              </button>
              <button
                onClick={() => {
                  alert("Sync complete!");
                }}
                className="px-5 py-2.5 rounded-xl text-white/40 hover:text-white font-mono text-[9px] tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer"
              >
                CONTINUE
              </button>
            </div>
          </div>
        </div>

        {/* Live Loading Telemetry Readout & Debug Toggle (Aesthetic and Functional) */}
        <div className="absolute bottom-6 left-6 md:left-16 z-30 flex items-center gap-2 select-none pointer-events-auto bg-black/40 px-3 py-1.5 border border-white/5 rounded backdrop-blur-md">
          <span className="w-1.5 h-1.5 bg-[#ff4d00] rounded-full animate-ping" />
          <div className="font-mono text-[9px] tracking-widest text-white/50 uppercase flex items-center gap-1">
            <span>SYS.PRELOAD:</span>
            <span className="text-[#ff4d00] font-bold">
              {isPreloaded ? (preloadsDone === 100 ? "100% // COMPLETE" : "READY // STREAMING") : "INITIALIZING..."}
            </span>
          </div>

          {/* Debug Safe-Zone Toggle */}
          <button
            onClick={() => setShowDebugSafeZone(!showDebugSafeZone)}
            className="ml-3 px-2 py-0.5 rounded bg-white/5 border border-white/10 hover:border-purple-500/50 text-white/40 hover:text-purple-400 font-mono text-[8px] tracking-wider uppercase transition-colors duration-200 cursor-pointer"
          >
            [DEBUG_SAFE_ZONE: {showDebugSafeZone ? "ON" : "OFF"}]
          </button>
        </div>
      </div>
    </div>
  );
}
