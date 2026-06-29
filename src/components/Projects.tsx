import React, { useRef } from "react";
import { PROJECTS } from "../data";
import { Code2, ArrowUpRight, ExternalLink, Activity } from "lucide-react";
import gsap from "gsap";

export default function Projects() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Individual card 3D tilt calculation on MouseMove
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Normalised coordinate mapping (-1 to 1)
    const xNormal = (x / width - 0.5) * 2;
    const yNormal = (y / height - 0.5) * 2;

    // Rotate the card on 3D plane
    gsap.to(card, {
      rotateX: -yNormal * 12, // tilt pitch
      rotateY: xNormal * 12,  // tilt yaw
      transformPerspective: 800,
      duration: 0.3,
      ease: "power2.out",
    });

    // Subtly shift background image inside card (parallax)
    const bgImage = card.querySelector(".project-card-bg");
    if (bgImage) {
      gsap.to(bgImage, {
        x: -xNormal * 15,
        y: -yNormal * 15,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = (index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    // Reset card transformations smoothly
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power2.out",
    });

    const bgImage = card.querySelector(".project-card-bg");
    if (bgImage) {
      gsap.to(bgImage, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  };

  return (
    <section
      id="projects-section"
      className="relative w-full min-h-screen flex items-center justify-center py-24 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute inset-0 cyber-grid opacity-[0.15] z-0" />
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-purple-900/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-red-950/10 rounded-full blur-[120px] pointer-events-none" />
 
      {/* Grid container */}
      <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Column: Project Cards Showcase */}
        <div className="lg:col-span-7 flex flex-col items-start gap-8 select-none">
          
          {/* Section Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#ff4d00] uppercase font-black">
              <Code2 className="w-4 h-4" />
              <span>NODES // RECENT_MISSIONS_HS</span>
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none text-white">
              FEATURED
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d00] via-purple-500 to-indigo-500">
                DEPLOYMENTS
              </span>
            </h2>
            <p className="text-xs md:text-sm text-white/50 tracking-wider font-mono uppercase mt-1">
              Select client engagements and laboratory prototypes
            </p>
          </div>
 
          {/* Cards Stack */}
          <div className="flex flex-col gap-6 w-full">
            {PROJECTS.map((project, index) => (
              <div
                key={project.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => handleMouseLeave(index)}
                className="group relative h-[250px] w-full bg-white/5 border border-white/10 hover:border-[#ff4d00]/40 rounded-2xl overflow-hidden clip-cyber-corner transition-all duration-300 shadow-sm cursor-pointer hover:shadow-orange-glow backdrop-blur-md"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Background Image Parallax Layer */}
                <div
                  className="project-card-bg absolute inset-0 bg-cover bg-center opacity-15 group-hover:opacity-35 scale-110 transition-opacity duration-500 pointer-events-none filter brightness-50 contrast-125"
                  style={{
                    backgroundImage: `url(${project.image})`,
                  }}
                />
 
                {/* Grid Overlay */}
                <div className="absolute inset-0 cyber-grid-dense opacity-30 z-0 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/85 to-transparent z-10 pointer-events-none" />
 
                {/* Card Content Layout */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-20 pointer-events-none">
                  
                  {/* Top: Header Info */}
                  <div className="flex items-start justify-between w-full">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[9px] tracking-widest text-[#ff4d00] uppercase font-bold">
                        {project.role}
                      </span>
                      <h3 className="font-display font-black text-xl md:text-2xl text-white tracking-wide">
                        {project.title}
                      </h3>
                    </div>
                    {/* Action Arrow (Interactive Hover) */}
                    <div className="p-2 bg-white/5 border border-white/10 rounded-full group-hover:bg-[#ff4d00] group-hover:border-[#ff4d00]/50 transition-all pointer-events-auto">
                      <ArrowUpRight className="w-4 h-4 text-white group-hover:rotate-45 transition-transform" />
                    </div>
                  </div>
 
                  {/* Middle: Short Description */}
                  <p className="text-xs md:text-sm text-white/70 max-w-md leading-relaxed font-sans font-medium">
                    {project.description}
                  </p>
 
                  {/* Bottom: Achievements & Tags */}
                  <div className="flex flex-col gap-3">
                    {/* Impact KPI bar */}
                    <div className="flex items-center gap-2 bg-[#ff4d00]/10 border border-[#ff4d00]/20 px-3 py-1.5 rounded-lg w-fit">
                      <Activity className="w-3.5 h-3.5 text-[#ff4d00] animate-pulse" />
                      <span className="font-mono text-[9px] text-[#ff4d00] uppercase font-bold tracking-wider">
                        IMPACT: {project.impact}
                      </span>
                    </div>
 
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag, ti) => (
                        <span
                          key={ti}
                          className="font-mono text-[9px] bg-white/5 border border-white/10 text-white/50 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
 
                </div>
 
                {/* Ambient Cyber highlight bar on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#ff4d00] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
 
        </div>
 
        {/* Right Column: HUD telemetry scope overlaying the background avatar */}
        <div className="lg:col-span-5 h-[350px] lg:h-[450px] flex items-center justify-center relative select-none">
          <div className="absolute inset-0 border border-white/5 bg-white/[0.02] rounded-[40px] clip-cyber-corner flex items-center justify-center backdrop-blur-[2px]">
            {/* Visual HUD coordinate grids */}
            <div className="absolute top-6 left-6 text-[9px] font-mono text-indigo-400 tracking-widest uppercase flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              <span>PROJECT_SCOPE // PORTAL_D</span>
            </div>
            <div className="absolute bottom-6 right-6 text-[9px] font-mono text-white/40 tracking-widest">
              TILT_OFFSET_LOCK
            </div>
 
            {/* Geometric bracket visuals */}
            <div className="w-44 h-44 border border-white/5 relative flex items-center justify-center">
              <div className="absolute top-0 inset-x-4 border-t border-indigo-500/30" />
              <div className="absolute bottom-0 inset-x-4 border-b border-indigo-500/30" />
              <div className="absolute left-0 inset-y-4 border-l border-indigo-500/30" />
              <div className="absolute right-0 inset-y-4 border-r border-indigo-500/30" />
              <span className="font-mono text-[8px] text-white/30 tracking-widest uppercase">FOCUS SECTOR</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
