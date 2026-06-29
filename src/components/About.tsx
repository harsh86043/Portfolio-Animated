import React from "react";
import { PERSONAL_INFO } from "../data";
import { User, Shield, Target, Compass } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Shield,
      title: "Clean Architecture",
      desc: "Structuring code modularly, with clear separation of states and strict TS type definitions."
    },
    {
      icon: Target,
      title: "Performance First",
      desc: "Delivering cinematic visual fidelity with solid WebGL and layout rendering optimizations (95+ Lighthouse)."
    },
    {
      icon: Compass,
      title: "Interactive Storytelling",
      desc: "Designing high-end interfaces that engage audiences using smooth scroll-bound motion."
    }
  ];

  return (
    <section
      id="about-section"
      className="relative w-full min-h-screen flex items-center justify-center py-24 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Background aesthetics */}
      <div className="absolute inset-0 cyber-grid opacity-[0.15] z-0" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-900/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-red-950/10 rounded-full blur-[100px] pointer-events-none" />
 
      <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left column: Text Content */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6 select-none text-left">
          
          {/* Section Marker */}
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#ff4d00] uppercase font-black">
            <User className="w-4 h-4" />
            <span>FILE // PROFILE_SUMMARY_HS</span>
          </div>
 
          {/* Heading */}
          <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight text-white">
            BRIDGING BRUTALIST
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d00] to-purple-400">
              VISUALS & PERFORMANCE
            </span>
          </h2>
 
          {/* Detailed Narrative */}
          <div className="space-y-4 max-w-xl">
            <p className="text-sm md:text-base text-white/80 leading-relaxed font-sans font-medium">
              {PERSONAL_INFO.about}
            </p>
            <p className="text-xs md:text-sm text-white/60 leading-relaxed font-sans">
              With a background rooted in creative computing and digital arts, I approach web design not as flat layouts, but as 3D canvas spaces where motion acts as the gravity that keeps elements grounded and meaningful.
            </p>
          </div>
 
          {/* Core Values Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="group relative bg-white/5 border border-white/10 hover:border-[#ff4d00]/30 hover:bg-white/10 p-5 rounded-xl clip-cyber-corner-sm transition-all duration-300 flex flex-col gap-2 backdrop-blur-md"
              >
                <div className="p-2 w-fit bg-white/5 rounded-lg border border-white/10 group-hover:border-[#ff4d00]/40 group-hover:bg-[#ff4d00]/5 transition-colors">
                  <v.icon className="w-4 h-4 text-[#ff4d00] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display font-bold text-sm text-white tracking-wide">
                  {v.title}
                </h3>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: HUD target scope overlaying the background avatar */}
        <div className="lg:col-span-5 h-[350px] lg:h-[450px] flex items-center justify-center relative select-none">
          <div className="absolute inset-0 border border-white/5 bg-white/[0.02] rounded-[40px] clip-cyber-corner flex items-center justify-center backdrop-blur-[2px]">
            {/* Ambient HUD labels */}
            <div className="absolute top-6 left-6 text-[9px] font-mono text-purple-400 tracking-widest uppercase flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
              <span>CORE_DOCK_B // SYS_SYNC</span>
            </div>
            <div className="absolute bottom-6 right-6 text-[9px] font-mono text-white/40 tracking-widest">
              X_ALIGN_Y_LOCKED
            </div>

            {/* Aesthetic coordinate readout */}
            <div className="absolute flex flex-col gap-1 text-[8px] font-mono text-white/40 left-6 top-14 border-l border-white/10 pl-2">
              <span>LAT: 37.7749° N</span>
              <span>LON: 122.4194° W</span>
              <span>COMPILER: TS_V5.8</span>
            </div>

            {/* Glowing nested rings */}
            <div className="w-36 h-36 border border-dashed border-purple-500/10 rounded-full flex items-center justify-center animate-spin-slow">
              <div className="w-24 h-24 border border-white/5 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 border border-dashed border-white/5 rounded-full" />
              </div>
            </div>

            {/* Interactive targeting brackets */}
            <div className="absolute top-10 left-10 w-3 h-3 border-t-2 border-l-2 border-[#ff4d00]/30 rounded-tl" />
            <div className="absolute bottom-10 right-10 w-3 h-3 border-b-2 border-r-2 border-[#ff4d00]/30 rounded-br" />
          </div>
        </div>
      </div>
    </section>
  );
}
