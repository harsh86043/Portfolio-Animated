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
        // Initial setup: Unified Intro visible at bottom-center, About card hidden
        gsap.set(introRef.current, { opacity: 1, y: 0, pointerEvents: "auto" });
        gsap.set(aboutRef.current, { opacity: 0, x: 100, pointerEvents: "none" });

        const tl = gsap.timeline({
          scrollTrigger: {
            id: "intro-about-sequence",
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.25,
            pin: viewportRef.current,
            anticipatePin: 1,
            invalidateOnRefresh: true
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

        // Phase A: Bottom intro content remains visible until 0.30, then fades out by 0.45 with y: 20
        tl.to(introRef.current, {
          opacity: 0,
          y: 20,
          ease: "power2.out",
          pointerEvents: "none",
          duration: 0.15
        }, 0.30);

        // Phase B: About card fades/slides in from 0.50 onward, once avatar is at the safe side position
        tl.to(aboutRef.current, {
          opacity: 1,
          x: 0,
          ease: "power2.out",
          pointerEvents: "auto",
          duration: 0.35
        }, 0.50);
      });

      // 2. MOBILE & TABLET ANIMATION FLOW (max-width: 1023px)
      mm.add("(max-width: 1023px)", () => {
        // Initial setup
        gsap.set(introRef.current, { opacity: 1, y: 0, pointerEvents: "auto" });
        gsap.set(aboutRef.current, { opacity: 0, x: 100, pointerEvents: "none" });

        const tl = gsap.timeline({
          scrollTrigger: {
            id: "intro-about-sequence",
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.25,
            pin: viewportRef.current,
            anticipatePin: 1,
            invalidateOnRefresh: true
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

        // Mobile Intro fades out (visible at 0.00 to 0.30, fades out by 0.45 with y: 20)
        tl.to(introRef.current, {
          opacity: 0,
          y: 20,
          ease: "power2.out",
          pointerEvents: "none",
          duration: 0.15
        }, 0.30);

        // About card fades/slides in (0.50 onward to 0.85)
        tl.to(aboutRef.current, {
          opacity: 1,
          x: 0,
          ease: "power2.out",
          pointerEvents: "auto",
          duration: 0.35
        }, 0.50);
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

        {/* Cinematic Atmospheric Overlay Gradients (z-10) */}
        {/* Cinematic Bottom Gradient Overlay for robust reading contrast under titles */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[48vh] z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.58) 38%, rgba(0, 0, 0, 0.18) 72%, transparent 100%)"
          }}
        />
        {/* Subtle Ambient Top and Side Vignettes */}
        <div className="absolute inset-x-0 top-0 h-[25%] bg-gradient-to-b from-[#04020a]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04020a]/30 via-transparent to-[#04020a]/35 z-10 pointer-events-none" />
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
            UNIFIED CINEMATIC INTRO: HERO CONTENT OVERLAY (z-30)
            ======================================================== */}
        <div
          ref={introRef}
          className="absolute left-1/2 bottom-[clamp(4rem,9vh,7rem)] lg:bottom-[clamp(3.5rem,8vh,7rem)] -translate-x-1/2 w-[min(94vw,680px)] lg:w-[min(92vw,1200px)] z-30 flex flex-col items-center text-center pointer-events-auto select-none"
        >
          <div className="flex flex-col items-center max-w-4xl">
            {/* 1. Small Eyebrow Text / Role Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#04020a]/65 backdrop-blur-md shadow-md mb-3">
              <span className="w-1.5 h-1.5 bg-[#ff4d00] rounded-full animate-pulse" />
              <span className="font-mono text-[9px] tracking-[0.3em] text-white/90 uppercase font-bold">
                PORTFOLIO OVERVIEW // SECURE NODE
              </span>
            </div>

            {/* 2. Large Name/Title (Cinematic) */}
            <h1 className="font-display font-black text-[clamp(2.15rem,10vw,3.8rem)] lg:text-[clamp(3rem,5.2vw,5.8rem)] leading-[0.95] lg:leading-[0.92] tracking-tight text-white uppercase [text-shadow:0_4px_16px_rgba(0,0,0,0.95)] mb-3">
              {PORTFOLIO_DATA.name.toUpperCase()}
            </h1>

            {/* 3. Short Tagline / Subtitle (Tech Stack in red/orange) */}
            <p className="font-mono text-[clamp(10px,2vw,13px)] text-[#ff4d00]/95 tracking-[0.2em] uppercase font-bold max-w-2xl [text-shadow:0_2px_8px_rgba(0,0,0,0.85)] mb-4">
              {PORTFOLIO_DATA.subtitle}
            </p>

            {/* 4. Minimal Tagline Description */}
            <p className="text-gray-200 text-[clamp(0.8rem,2.8vw,1rem)] lg:text-sm font-light max-w-[90vw] md:max-w-2xl leading-relaxed [text-shadow:0_2px_12px_rgba(0,0,0,0.95)] mb-6">
              {PORTFOLIO_DATA.tagline}
            </p>

            {/* 5. CTA buttons below text */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <button
                onClick={() => {
                  const trigger = ScrollTrigger.getById("intro-about-sequence");
                  if (trigger) {
                    const scrollPos = trigger.start + 1.0 * (trigger.end - trigger.start);
                    gsap.to(window, {
                      scrollTo: scrollPos,
                      duration: 1.2,
                      ease: "power2.inOut",
                      onUpdate: () => ScrollTrigger.update(),
                      onComplete: () => ScrollTrigger.update()
                    });
                  } else {
                    window.scrollTo({ top: window.innerHeight * 2, behavior: "smooth" });
                  }
                }}
                className="px-6 py-3 rounded-xl border border-[#ff4d00]/30 hover:border-[#ff4d00]/80 bg-[#ff4d00]/5 text-[#ff4d00] hover:text-white hover:bg-[#ff4d00]/15 font-mono text-[10px] tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer shadow-orange-glow active:scale-95"
              >
                EXPLORE BIOGRAPHY
              </button>
              <button
                onClick={() => {
                  alert("Resume download initiated! (In production this links to your PDF)");
                }}
                className="px-6 py-3 rounded-xl text-white/50 hover:text-white font-mono text-[10px] tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer hover:bg-white/5 active:scale-95"
              >
                GET RESUME
              </button>
            </div>

            {/* 6. Scroll cue */}
            <div className="flex flex-col items-center gap-1.5 opacity-45 hover:opacity-100 transition-opacity duration-300">
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
          className="absolute inset-x-0 bottom-6 lg:inset-y-0 lg:right-16 xl:right-24 lg:left-auto flex items-end lg:items-center justify-center lg:justify-end px-4 sm:px-6 md:px-8 z-30 w-full lg:w-[42vw] max-w-full md:max-w-2xl pointer-events-none"
        >
          <div className="w-full max-h-[72vh] overflow-y-auto bg-black/90 lg:bg-black/35 backdrop-blur-[14px] lg:backdrop-blur-[8px] border border-white/10 lg:border-white/8 p-5 sm:p-6 md:p-10 rounded-[24px] shadow-2xl pointer-events-auto flex flex-col gap-4 sm:gap-6 select-none">
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
