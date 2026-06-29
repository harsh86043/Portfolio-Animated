import React from "react";
import { PERSONAL_INFO } from "../data";
import { ArrowUpRight, Code, Download, ExternalLink } from "lucide-react";

interface HeroProps {
  onNavigateToSection: (sectionId: string) => void;
}

export default function Hero({ onNavigateToSection }: HeroProps) {
  const handleDownloadResume = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Resume download initiated! (In production this links to your PDF)");
  };

  return (
    <section
      id="hero-section"
      className="relative w-full min-h-screen flex items-center justify-center pt-24 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Background visual layering */}
      <div className="absolute inset-0 cyber-grid opacity-25 z-0" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none animate-pulse-soft" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-red-950/15 rounded-full blur-[100px] pointer-events-none" />
 
      {/* Hero content container */}
      <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left text column */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6 select-none">
          
          {/* Status Badge */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
            <span className="w-2 h-2 bg-[#ff4d00] rounded-full animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-white/80 uppercase font-bold">
              AVAILABLE FOR ELITE ROLES // 2026
            </span>
          </div>
 
          {/* Heading Name & Title */}
          <div className="flex flex-col">
            <h2 className="font-mono text-xs md:text-sm tracking-[0.4em] text-[#ff4d00] uppercase font-bold mb-1">
              {PERSONAL_INFO.title}
            </h2>
            <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-white">
              HARSH
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d00] via-purple-500 to-indigo-500">
                SURYAVANSHI
              </span>
            </h1>
            <p className="font-display font-bold text-lg md:text-2xl text-white/50 tracking-wide mt-2">
              {PERSONAL_INFO.subtitle}
            </p>
          </div>
 
          {/* Tagline */}
          <p className="max-w-xl text-sm md:text-base text-white/70 leading-relaxed font-sans">
            {PERSONAL_INFO.tagline}
          </p>
 
          {/* Interactive Cinematic CTA Buttons */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4">
            {/* View Projects CTA */}
            <button
              onClick={() => onNavigateToSection("projects-section")}
              className="group relative flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff4d00] to-[#992200] text-white font-mono text-xs uppercase tracking-widest px-8 py-4 clip-cyber-corner-sm hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-orange-glow"
            >
              <span>EXPLORE WORKS</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
 
            {/* Contact Me CTA */}
            <button
              onClick={() => onNavigateToSection("contact-section")}
              className="group flex items-center justify-center gap-2 bg-white/5 border border-white/15 text-white hover:bg-white/10 font-mono text-xs uppercase tracking-widest px-8 py-4 clip-cyber-corner-sm active:scale-98 transition-all cursor-pointer"
            >
              <span>CONNECT TERMINAL</span>
              <Code className="w-4 h-4 text-purple-400" />
            </button>

            {/* Resume Download */}
            <a
              href="#"
              onClick={handleDownloadResume}
              className="group flex items-center justify-center gap-2 bg-transparent border border-dashed border-white/20 text-white/80 hover:text-white hover:border-white/40 font-mono text-xs uppercase tracking-widest px-6 py-4 clip-cyber-corner-sm transition-all"
            >
              <span>GET RESUME</span>
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right HUD telemetry overlay - frames the background cinematic avatar beautifully */}
        <div className="lg:col-span-5 h-[350px] lg:h-[500px] flex items-center justify-center relative select-none">
          <div className="absolute inset-0 border border-white/5 bg-white/[0.02] rounded-[40px] clip-cyber-corner flex items-center justify-center backdrop-blur-[2px]">
            {/* Visual HUD grid lines */}
            <div className="absolute top-6 left-6 text-[9px] font-mono text-[#ff4d00] tracking-widest uppercase flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 bg-[#ff4d00] rounded-full animate-ping" />
              <span>EYE_TRACKING_SYS</span>
            </div>
            <div className="absolute bottom-6 right-6 text-[9px] font-mono text-white/40 tracking-widest">
              ZOOM_FACTOR: 1.05X
            </div>
            
            {/* Dynamic visual target crosshair brackets */}
            <div className="absolute top-10 right-10 w-4 h-4 border-t-2 border-r-2 border-white/20 rounded-tr" />
            <div className="absolute bottom-10 left-10 w-4 h-4 border-b-2 border-l-2 border-white/20 rounded-bl" />

            {/* Rotating targeting radar scope */}
            <div className="relative w-48 h-48 border border-white/5 rounded-full flex items-center justify-center">
              <div className="absolute inset-0 border border-dashed border-[#ff4d00]/15 rounded-full animate-[spin_35s_linear_infinite]" />
              <div className="absolute inset-4 border border-purple-500/10 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-[#ff4d00]/40 rounded-full" />
              </div>
              
              {/* Soft visual laser scanline */}
              <div className="absolute w-[1px] h-24 bg-gradient-to-t from-[#ff4d00] to-transparent origin-bottom animate-[spin_6s_linear_infinite]" />
            </div>

            {/* Live readout feed overlay */}
            <div className="absolute bottom-6 left-6 flex flex-col gap-1 font-mono text-[8px] text-white/30 border-l border-white/10 pl-2">
              <span>SCANNER_SWEEP_OK</span>
              <span>AZIMUTH: 312.45°</span>
              <span>FOCUS: PERSISTENT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient bottom scroll helper */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-15 flex flex-col items-center gap-2 select-none opacity-50">
        <span className="font-mono text-[8px] tracking-[0.3em] text-white/50 uppercase">SCROLL TO DRIFT</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
