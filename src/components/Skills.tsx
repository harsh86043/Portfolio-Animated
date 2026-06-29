import React from "react";
import { SKILL_CATEGORIES } from "../data";
import { Sparkles, Code2, Palette, Gauge, ArrowRight, Server, Layout, Database, Sliders } from "lucide-react";

export default function Skills() {
  // Map our icon name strings to actual Lucide component references
  const getIcon = (name: string) => {
    switch (name) {
      case "Code2":
        return Code2;
      case "Server":
        return Server;
      case "Layout":
        return Layout;
      case "Database":
        return Database;
      case "Sliders":
        return Sliders;
      case "Sparkles":
        return Sparkles;
      case "Palette":
        return Palette;
      case "Gauge":
        return Gauge;
      default:
        return Sparkles;
    }
  };

  return (
    <section
      id="skills-section"
      className="relative w-full min-h-screen flex items-center justify-center py-24 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 cyber-grid opacity-[0.15] z-0" />
      <div className="absolute bottom-1/3 left-1/3 w-[300px] h-[300px] bg-red-950/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-950/10 rounded-full blur-[120px] pointer-events-none" />
 
      {/* Main container */}
      <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left column: HUD target scope overlaying the background avatar */}
        <div className="order-2 lg:order-1 lg:col-span-5 h-[350px] lg:h-[450px] flex items-center justify-center relative select-none">
          <div className="absolute inset-0 border border-white/5 bg-white/[0.02] rounded-[40px] clip-cyber-corner flex items-center justify-center backdrop-blur-[2px]">
            {/* Ambient HUD decoration */}
            <div className="absolute top-6 left-6 text-[9px] font-mono text-cyan-400 tracking-widest uppercase flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" />
              <span>GESTURE_FIELD // CORE_SYNC</span>
            </div>
            <div className="absolute bottom-6 right-6 text-[9px] font-mono text-white/40 tracking-widest">
              X_FIELD: ACTIVE
            </div>
 
            {/* Simulated circular HUD target */}
            <div className="w-48 h-48 border border-white/5 rounded-full relative flex items-center justify-center">
              <div className="absolute inset-2 border border-dashed border-cyan-500/25 rounded-full animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-6 border border-purple-500/10 rounded-full flex items-center justify-center">
                <span className="font-mono text-[8px] text-white/30 tracking-widest uppercase font-bold">SYSTEM.OK</span>
              </div>
            </div>

            {/* Targeting brackets */}
            <div className="absolute top-10 right-10 w-3 h-3 border-t-2 border-r-2 border-cyan-500/30 rounded-tr" />
            <div className="absolute bottom-10 left-10 w-3 h-3 border-b-2 border-l-2 border-cyan-500/30 rounded-bl" />
          </div>
        </div>
 
        {/* Right column: Skill Grid (Right side) */}
        <div className="order-1 lg:order-2 lg:col-span-7 flex flex-col items-start gap-6 select-none text-left">
          
          {/* Section Marker */}
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#ff4d00] uppercase font-black">
            <Sparkles className="w-4 h-4" />
            <span>CORES // SKILLS_INVENTORY_HS</span>
          </div>
 
          {/* Heading */}
          <div className="flex flex-col gap-1">
            <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none text-white">
              TECHNICAL
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d00] via-purple-500 to-indigo-500">
                INFRASTRUCTURE
              </span>
            </h2>
            <p className="text-xs md:text-sm text-white/50 tracking-wider font-mono uppercase mt-2">
              High-fidelity implementation blueprints and tooling competencies
            </p>
          </div>
 
          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
            {SKILL_CATEGORIES.map((cat, i) => {
              const IconComp = getIcon(cat.icon);
              return (
                <div
                  key={i}
                  className="group relative bg-white/5 border border-white/10 hover:border-[#ff4d00]/30 hover:bg-white/10 p-5 rounded-xl clip-cyber-corner-sm transition-all duration-300 flex flex-col gap-4 shadow-sm hover:shadow-orange-glow backdrop-blur-md"
                >
                  {/* Skill Category Header */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 w-fit bg-white/5 rounded-lg border border-white/10 group-hover:border-[#ff4d00]/45 group-hover:bg-[#ff4d00]/5 transition-colors">
                      <IconComp className="w-4 h-4 text-[#ff4d00] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-display font-bold text-base text-white tracking-wide">
                      {cat.title}
                    </h3>
                  </div>
 
                  {/* Skill Badges List */}
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill, si) => (
                      <span
                        key={si}
                        className="font-mono text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white px-2.5 py-1 rounded transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
 
                  {/* Corner Accent Graphic */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity">
                    <ArrowRight className="w-3.5 h-3.5 text-[#ff4d00]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
