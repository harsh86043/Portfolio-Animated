import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FrameSequenceCanvas, { FrameSequenceCanvasRef } from "./FrameSequenceCanvas";
import { PORTFOLIO_DATA } from "../data/portfolio";
import { HelpCircle, ChevronDown, Award } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function IntroAboutSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<FrameSequenceCanvasRef>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [preloadsDone, setPreloadsDone] = useState(0);
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

    // Set up GSAP ScrollTrigger timeline
    const ctx = gsap.context(() => {
      // 1. Initial State
      gsap.set(aboutRef.current, { opacity: 0, x: 100, pointerEvents: "none" });
      gsap.set(introRef.current, { opacity: 1, y: 0, pointerEvents: "auto" });

      // Create main scroll timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          pin: viewportRef.current,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Self-correction for canvas render sync on fast scroll
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

      // Frame Object to animate frame index across the timeline
      const frameObj = { frame: 1 };

      // Phase A: Scrub through images
      tl.to(frameObj, {
        frame: totalFrames,
        ease: "none",
        duration: 1, // Normalized timeline duration
        onUpdate: () => {
          if (canvasRef.current) {
            canvasRef.current.drawFrame(frameObj.frame);
          }
        }
      }, 0);

      // Phase B: Intro content fades out (0% to 25% scroll)
      tl.to(introRef.current, {
        opacity: 0,
        y: -60,
        ease: "power2.out",
        pointerEvents: "none",
        duration: 0.25
      }, 0);

      // Phase C: About content fades in (75% to 100% scroll)
      tl.to(aboutRef.current, {
        opacity: 1,
        x: 0,
        ease: "power2.out",
        pointerEvents: "auto",
        duration: 0.25
      }, 0.75);

    }, containerRef);

    return () => {
      ctx.revert(); // Clean up GSAP timelines & ScrollTriggers
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
      style={{ height: "300vh" }} // Pinned scrolling depth
    >
      {/* Viewport container to be pinned */}
      <div
        ref={viewportRef}
        className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      >
        {/* Canvas Background Frame Sequence */}
        <FrameSequenceCanvas
          ref={canvasRef}
          totalFrames={totalFrames}
          onFirstFrameLoaded={handleFirstFrameLoaded}
          onAllFramesLoaded={handleAllFramesLoaded}
        />

        {/* Cinematic Atmospheric Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04020a] via-transparent to-[#04020a]/70 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/70 z-10 pointer-events-none" />
        <div className="absolute inset-0 scanlines opacity-[0.08] z-10 pointer-events-none" />

        {/* Grid Line Accents */}
        <div className="absolute inset-x-0 top-0 h-px bg-white/5 z-10" />
        <div className="absolute inset-y-0 left-12 w-px bg-white/5 z-10 hidden md:block" />
        <div className="absolute inset-y-0 right-12 w-px bg-white/5 z-10 hidden md:block" />

        {/* Floating HUD Labels (Aesthetic Touch) */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col gap-10 font-mono text-[8px] tracking-[0.3em] text-white/10 uppercase origin-left -rotate-90 select-none">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-white/10" />
            <span>SYS.CINEMATIC_ENGINE // V1.0</span>
          </div>
        </div>

        {/* 1. INTRO CONTENT CONTAINER (z-20) */}
        <div
          ref={introRef}
          className="absolute inset-0 flex flex-col justify-end pb-24 md:pb-32 items-center text-center px-6 z-20"
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
            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white uppercase select-none leading-none">
              {PORTFOLIO_DATA.name}
            </h1>

            {/* Subtitle */}
            <p className="font-mono text-xs md:text-sm text-[#ff4d00] tracking-[0.2em] uppercase font-bold mt-4 [text-shadow:0_0_12px_rgba(255,77,0,0.3)]">
              {PORTFOLIO_DATA.subtitle}
            </p>

            <div className="w-12 h-px bg-white/20 my-6" />

            {/* Tagline */}
            <p className="text-gray-300 text-sm md:text-base max-w-xl font-light leading-relaxed select-none">
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

        {/* 2. ABOUT CONTENT CONTAINER (z-20) */}
        <div
          ref={aboutRef}
          className="absolute inset-y-0 right-0 lg:right-16 xl:right-24 flex items-center justify-center lg:justify-end px-4 md:px-8 z-20 w-full lg:w-[42vw] max-w-full md:max-w-2xl pointer-events-none"
        >
          <div className="w-full bg-black/80 md:bg-black/45 backdrop-blur-[14px] border border-white/10 md:border-white/12 p-6 md:p-10 rounded-[24px] shadow-2xl pointer-events-auto flex flex-col gap-6 select-none">
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
              <button className="px-5 py-2.5 rounded-xl border border-[#ff4d00]/30 hover:border-[#ff4d00]/60 bg-[#ff4d00]/5 text-[#ff4d00] hover:text-white hover:bg-[#ff4d00]/10 font-mono text-[9px] tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer shadow-orange-glow">
                VIEW RESUME
              </button>
              <button className="px-5 py-2.5 rounded-xl text-white/40 hover:text-white font-mono text-[9px] tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer">
                CONTINUE
              </button>
            </div>
          </div>
        </div>

        {/* Live Loading Telemetry Readout (Aesthetic and Functional) */}
        <div className="absolute bottom-6 left-6 md:left-16 z-30 flex items-center gap-2 select-none pointer-events-auto bg-black/40 px-3 py-1.5 border border-white/5 rounded backdrop-blur-md">
          <span className="w-1.5 h-1.5 bg-[#ff4d00] rounded-full animate-ping" />
          <div className="font-mono text-[9px] tracking-widest text-white/50 uppercase flex items-center gap-1">
            <span>SYS.PRELOAD:</span>
            <span className="text-[#ff4d00] font-bold">
              {isPreloaded ? (preloadsDone === 100 ? "100% // COMPLETE" : "READY // STREAMING") : "INITIALIZING..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
