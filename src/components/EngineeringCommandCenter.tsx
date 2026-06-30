import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, Cpu, Database, Layers, Wrench, ShieldAlert } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface SkillGroup {
  title: string;
  items: string[];
  description: string;
  icon: React.ComponentType<any>;
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Frontend Engineering",
    icon: Code2,
    items: ["Angular", "React", "TypeScript", "Tailwind CSS", "Responsive UI", "Component Architecture"],
    description: "Building responsive, scalable, component-driven interfaces for enterprise web applications."
  },
  {
    title: "Backend Engineering",
    icon: Cpu,
    items: ["ASP.NET Core", "C#", "REST APIs", "Authentication", "API Integration", "Clean Architecture"],
    description: "Designing secure, high-performance services, Clean Architecture patterns, and robust APIs."
  },
  {
    title: "Database Engineering",
    icon: Database,
    items: ["SQL Server", "Stored Procedures", "Query Optimization", "Indexing", "Data Modeling"],
    description: "Architecting high-throughput relational databases with optimized indexing and complex data modeling."
  },
  {
    title: "Enterprise Systems",
    icon: Layers,
    items: ["CRM Applications", "Legacy Modernization", "Role-Based Workflows", "Business Process Automation", "Scalable Web Platforms"],
    description: "Modernizing business critical applications and scaling workflows to support enterprise demands."
  },
  {
    title: "Tools & Deployment",
    icon: Wrench,
    items: ["Git", "Postman", "IIS", "Azure Basics", "Debugging", "Production Support"],
    description: "Managing version control, continuous integration, local hosting, and continuous production monitoring."
  }
];

export default function EngineeringCommandCenter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const desktopContainerRef = useRef<HTMLDivElement>(null);

  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const [lines, setLines] = useState<{ path: string }[]>([]);

  // Calculate connector line coordinates on resize
  useEffect(() => {
    const updateCoordinates = () => {
      if (!desktopContainerRef.current || !coreRef.current) return;
      const containerRect = desktopContainerRef.current.getBoundingClientRect();
      const coreRect = coreRef.current.getBoundingClientRect();

      // Core center coordinates relative to the desktop container
      const coreX = coreRect.left + coreRect.width / 2 - containerRect.left;
      const coreY = coreRect.top + coreRect.height / 2 - containerRect.top;

      const newLines = SKILL_GROUPS.map((_, idx) => {
        const cardEl = desktopContainerRef.current?.querySelector(`.desktop-card-${idx}`);
        if (!cardEl) return { path: "" };

        const cardRect = cardEl.getBoundingClientRect();
        let cardX = 0;
        let cardY = 0;

        // Choose edge anchor closest to the core to avoid crossing text/card body
        if (idx === 0) {
          // Frontend Engineering (Col 1, Row 1 - Left of Core): connect to Right-Center edge
          cardX = cardRect.right - containerRect.left;
          cardY = cardRect.top + cardRect.height / 2 - containerRect.top;
        } else if (idx === 1) {
          // Backend Engineering (Col 3, Row 1 - Right of Core): connect to Left-Center edge
          cardX = cardRect.left - containerRect.left;
          cardY = cardRect.top + cardRect.height / 2 - containerRect.top;
        } else if (idx === 2) {
          // Database Engineering (Col 1, Row 2 - Left of Core): connect to Right-Center edge
          cardX = cardRect.right - containerRect.left;
          cardY = cardRect.top + cardRect.height / 2 - containerRect.top;
        } else if (idx === 3) {
          // Enterprise Systems (Col 3, Row 2 - Right of Core): connect to Left-Center edge
          cardX = cardRect.left - containerRect.left;
          cardY = cardRect.top + cardRect.height / 2 - containerRect.top;
        } else if (idx === 4) {
          // Tools & Deployment (Col 2, Row 3 - Below Core): connect to Top-Center edge
          cardX = cardRect.left + cardRect.width / 2 - containerRect.left;
          cardY = cardRect.top - containerRect.top;
        }

        // Generate clean cubic Bezier paths (S-curves)
        let path = "";
        if (idx === 4) {
          // Vertical S-curve for Tools & Deployment card
          const midY = (coreY + cardY) / 2;
          path = `M ${coreX} ${coreY} C ${coreX} ${midY}, ${cardX} ${midY}, ${cardX} ${cardY}`;
        } else {
          // Horizontal S-curve for left/right cards
          const midX = (coreX + cardX) / 2;
          path = `M ${coreX} ${coreY} C ${midX} ${coreY}, ${midX} ${cardY}, ${cardX} ${cardY}`;
        }

        return { path };
      });

      setLines(newLines);
    };

    // Run after layout completes and rendering is stable
    const timer = setTimeout(updateCoordinates, 300);

    // Track real size/layout updates precisely via ResizeObserver
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && desktopContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(updateCoordinates);
      });
      resizeObserver.observe(desktopContainerRef.current);
    }

    window.addEventListener("resize", updateCoordinates);
    return () => {
      clearTimeout(timer);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", updateCoordinates);
    };
  }, []);

  // Entrance animations using GSAP ScrollTrigger
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Grid background fade in
      gsap.fromTo(
        gridRef.current,
        { opacity: 0 },
        {
          opacity: 0.12,
          duration: 1.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 2. Section header slide/fade in
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Match media for desktop (xl: 1200px+)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1200px)", () => {
        // 3. Core reactor scale in
        gsap.fromTo(
          coreRef.current,
          { opacity: 0, scale: 0.75 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "back.out(1.1)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // 4. Cards entrance from sides
        const leftCards = sectionRef.current?.querySelectorAll(".card-left");
        const rightCards = sectionRef.current?.querySelectorAll(".card-right");
        const bottomCard = sectionRef.current?.querySelector(".card-bottom");

        if (leftCards && leftCards.length > 0) {
          gsap.fromTo(
            Array.from(leftCards),
            { opacity: 0, x: -45, scale: 0.96 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 55%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }

        if (rightCards && rightCards.length > 0) {
          gsap.fromTo(
            Array.from(rightCards),
            { opacity: 0, x: 45, scale: 0.96 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 55%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }

        if (bottomCard) {
          gsap.fromTo(
            bottomCard,
            { opacity: 0, y: 45, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 55%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }

        // 5. Connector Lines drawing animation
        if (svgRef.current) {
          gsap.fromTo(
            svgRef.current,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.8,
              delay: 0.6,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 55%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });

      // Match media for mobile/tablet (under 1200px)
      mm.add("(max-width: 1199px)", () => {
        const stackedView = sectionRef.current?.querySelector(".xl\\:hidden");
        if (stackedView) {
          gsap.fromTo(
            stackedView,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills-section"
      className="relative w-full min-h-[100svh] bg-[#04020a] pt-[clamp(6rem,_10vh,_8rem)] pb-[clamp(4rem,_8vh,_7rem)] px-[clamp(1rem,_4vw,_4rem)] overflow-hidden flex flex-col justify-between"
    >
      {/* Custom Keyframes style tags */}
      <style>{`
        @keyframes commandCenterDash {
          to {
            stroke-dashoffset: -40;
          }
        }
        .animate-dash-fast {
          animation: commandCenterDash 1.2s linear infinite;
        }
        .animate-dash-slow {
          animation: commandCenterDash 4s linear infinite;
        }
        @keyframes coreRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-core-rotate-clockwise {
          animation: coreRotate 24s linear infinite;
        }
        .animate-core-rotate-counter {
          animation: coreRotate 16s linear infinite reverse;
        }
        .shadow-orange-glow-sm {
          box-shadow: 0 0 20px rgba(255, 77, 0, 0.25);
        }
      `}</style>

      {/* Cyber Grid Background (z-0) */}
      <div
        ref={gridRef}
        className="absolute inset-0 cyber-grid opacity-[0.12] z-0 pointer-events-none"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#ff4d00]/3 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* 1. Section Header Title */}
      <div
        ref={titleRef}
        className="relative w-full max-w-7xl mx-auto flex flex-col items-center select-none z-10 text-center mb-16"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#ff4d00] uppercase font-black">
          <ShieldAlert className="w-4 h-4" />
          <span>SYS_MODULE_02 // SYSTEM_MAP</span>
        </div>
        <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight leading-tight text-white mt-2">
          ENGINEERING COMMAND CENTER
        </h2>
        <div className="w-20 h-[2px] bg-[#ff4d00]/60 mt-3 rounded" />
        <p className="text-xs text-white/50 font-mono tracking-wider mt-2 uppercase">
          Interactive Technical Stack Topology
        </p>
      </div>

      {/* 2. Map Container Area */}
      <div className="relative w-full max-w-7xl mx-auto flex-grow flex items-center justify-center">
        
        {/* ========================================================
            DESKTOP EXCLUSIVE BALANCED GRID VIEW (xl:block)
            ======================================================== */}
        <div ref={desktopContainerRef} className="hidden xl:block w-full relative">
          
          {/* A. SVG Connector Lines (z-10) */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            style={{ minHeight: "100%" }}
          >
            {lines.map((line, idx) => {
              if (!line.path) return null;
              const isHovered = activeGroup === idx;
              return (
                <g key={idx}>
                  {/* Glowing line overlay */}
                  <path
                    d={line.path}
                    stroke={isHovered ? "rgba(255, 77, 0, 0.95)" : "rgba(255, 82, 20, 0.35)"}
                    strokeWidth={isHovered ? "2" : "1.25"}
                    strokeDasharray={isHovered ? "6, 6" : "8, 8"}
                    strokeDashoffset={isHovered ? "0" : "40"}
                    className={`transition-all duration-300 ease-out ${isHovered ? "animate-dash-fast opacity-100" : "animate-dash-slow opacity-60"}`}
                    fill="none"
                    style={{
                      filter: isHovered ? "drop-shadow(0 0 5px rgba(255, 77, 0, 0.8))" : "none",
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* B. Core + Cards CSS Grid Container */}
          <div className="grid grid-cols-[minmax(320px,_420px)_minmax(240px,_320px)_minmax(320px,_420px)] grid-rows-[auto_auto_auto] gap-x-[clamp(2.5rem,_5vw,_5rem)] gap-y-[clamp(1.5rem,_3vh,_2.5rem)] items-center justify-center w-full relative z-20">
            
            {/* Central Reactor Core (Placed in Column 2, Row 2) */}
            <div ref={coreRef} className="col-start-2 row-start-2 justify-self-center self-center z-30 pointer-events-none">
              <div className="relative w-[clamp(210px,16vw,260px)] h-[clamp(210px,16vw,260px)] flex items-center justify-center select-none">
                {/* Outer Glow Circle */}
                <div className={`absolute inset-0 rounded-full blur-[45px] opacity-25 transition-all duration-700 ${
                  activeGroup !== null ? 'bg-[#ff4d00]' : 'bg-purple-600'
                }`} />

                {/* Rotating ring outer */}
                <div className={`absolute w-full h-full rounded-full border border-dashed animate-core-rotate-clockwise ${
                  activeGroup !== null ? 'border-[#ff4d00]/55' : 'border-white/10'
                }`} />

                {/* Rotating ring inner (counter clockwise) */}
                <div className={`absolute w-[84%] h-[84%] rounded-full border border-dotted animate-core-rotate-counter ${
                  activeGroup !== null ? 'border-[#ff4d00]/35' : 'border-white/5'
                }`} />

                {/* Glass Inner core plate */}
                <div className={`absolute w-[70%] h-[70%] rounded-full bg-black border flex flex-col items-center justify-center text-center p-4 backdrop-blur-md transition-colors duration-500 ${
                  activeGroup !== null ? 'border-[#ff4d00]/50 shadow-orange-glow-sm' : 'border-white/10'
                }`}>
                  <div className="flex flex-col gap-1 justify-center items-center">
                    <span className="font-mono text-[7px] tracking-[0.3em] text-[#ff4d00] uppercase font-bold">
                      {activeGroup !== null ? `CORE_SYNC` : "REACTOR ACTIVE"}
                    </span>
                    <h3 className="font-display font-black text-[10px] md:text-xs text-white tracking-wide uppercase leading-tight mt-0.5 max-w-[130px] text-center">
                      {activeGroup !== null ? SKILL_GROUPS[activeGroup].title : "FULL-STACK SYSTEMS"}
                    </h3>
                    <div className="w-8 h-px bg-white/10 my-1" />
                    <p className="font-mono text-[8px] text-white/50 tracking-wider">
                      {activeGroup !== null ? "FEED_ACTIVE" : ".NET + ANGULAR"}
                    </p>
                    <p className="font-mono text-[6px] text-white/30 tracking-widest uppercase">
                      {activeGroup !== null ? "SECURE NODE" : "ENTERPRISE"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Render 5 Cards in Grid */}
            {SKILL_GROUPS.map((group, idx) => {
              const isActive = activeGroup === idx;
              
              let gridPlacement = "";
              let sideClass = "";
              if (idx === 0) {
                gridPlacement = "col-start-1 row-start-1";
                sideClass = "card-left";
              } else if (idx === 1) {
                gridPlacement = "col-start-3 row-start-1";
                sideClass = "card-right";
              } else if (idx === 2) {
                gridPlacement = "col-start-1 row-start-2";
                sideClass = "card-left";
              } else if (idx === 3) {
                gridPlacement = "col-start-3 row-start-2";
                sideClass = "card-right";
              } else if (idx === 4) {
                gridPlacement = "col-start-2 row-start-3 justify-self-center";
                sideClass = "card-bottom";
              }

              return (
                <SkillCard
                  key={idx}
                  title={group.title}
                  items={group.items}
                  description={group.description}
                  icon={group.icon}
                  index={idx}
                  isActive={isActive}
                  onHover={setActiveGroup}
                  className={`desktop-card-${idx} ${sideClass} ${gridPlacement}`}
                />
              );
            })}

          </div>

        </div>

        {/* ========================================================
            TABLET & MOBILE RESPONSIVE SIMPLIFIED VIEW (xl:hidden)
            ======================================================== */}
        <div className="xl:hidden w-full flex flex-col gap-8">
          
          {/* Core Reactor Banner */}
          <div className="relative w-full max-w-md mx-auto bg-black/45 border border-white/10 rounded-2xl p-6 text-center overflow-hidden backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d00]/5 to-purple-500/5 opacity-50" />
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-mono text-[8px] tracking-[0.3em] text-[#ff4d00] uppercase font-bold animate-pulse">
                SYSTEM STATUS: ONLINE
              </span>
              <h3 className="font-display font-black text-md md:text-lg text-white uppercase tracking-tight mt-1">
                FULL-STACK SYSTEMS CORE
              </h3>
              <p className="font-mono text-[9px] text-white/50 tracking-widest mt-1 uppercase">
                .NET CORE + ANGULAR + SQL SERVER
              </p>
            </div>
          </div>

          {/* Cards Grid: Stacked on Mobile, 2 Columns on Tablet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-5xl mx-auto">
            {SKILL_GROUPS.map((group, index) => {
              const Icon = group.icon;
              const isLast = index === 4;
              return (
                <div
                  key={index}
                  className={`relative border rounded-2xl bg-[#04020a]/80 backdrop-blur-md p-5 border-white/10 ${
                    isLast ? "md:col-span-2 md:max-w-xl md:justify-self-center w-full" : "w-full"
                  }`}
                >
                  {/* Card Corner indicators */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/20" />
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/20" />
                  <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-white/20" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-white/20" />

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-[#ff4d00]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="font-mono text-[8px] text-[#ff4d00] uppercase tracking-widest font-bold">
                        SYS_GROUP_0{index + 1}
                      </span>
                      <h4 className="font-display font-black text-xs md:text-sm text-white uppercase tracking-wide">
                        {group.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-gray-300 text-xs font-light leading-relaxed text-left mb-4">
                    {group.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="font-mono text-[8px] tracking-wider px-2 py-0.5 rounded border border-white/5 bg-white/5 text-white/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* 3. Footer system metrics status line (z-10) */}
      <div className="relative w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between font-mono text-[9px] tracking-widest text-white/30 select-none z-10 pt-8 border-t border-white/5 mt-16">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#ff4d00] rounded-full animate-ping" />
          <span>STABLE CONNECTIVITY // ORBITAL NODE LINKED</span>
        </div>
        <div className="mt-2 sm:mt-0">
          SECURE ENCRYPTED SKILLS STREAM // V6.0
        </div>
      </div>
    </section>
  );
}

// 3D Tilt Card Component for Desktop
interface TiltCardProps {
  key?: React.Key;
  title: string;
  items: string[];
  description: string;
  icon: React.ComponentType<any>;
  index: number;
  isActive: boolean;
  onHover: (id: number | null) => void;
  className: string;
}

function SkillCard({
  title,
  items,
  description,
  icon: Icon,
  index,
  isActive,
  onHover,
  className
}: TiltCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates from -1 to 1
    const normalizedX = (x / rect.width) * 2 - 1;
    const normalizedY = (y / rect.height) * 2 - 1;
    
    // Calculate rotation (max 8 degrees tilt)
    setRotateX(-normalizedY * 8);
    setRotateY(normalizedX * 8);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    onHover(null);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => onHover(index)}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isActive ? '15px' : '0px'})`,
        transition: rotateX === 0 && rotateY === 0 ? "transform 0.4s ease" : "none"
      }}
      className={`group relative bg-[#04020a]/95 border p-[clamp(1.25rem,_1.8vw,_1.75rem)] rounded-2xl cursor-pointer select-none backdrop-blur-md w-full min-h-[180px] max-w-[420px] flex flex-col justify-between transition-all duration-300 ${
        isActive
          ? "border-[#ff4d00]/70 shadow-orange-glow-sm bg-[#ff4d00]/5 text-white"
          : "border-white/10 hover:border-white/20 text-white/85"
      } ${className}`}
    >
      {/* Corner styling indicators like futuristic HUD */}
      <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 transition-colors duration-300 ${isActive ? 'border-[#ff4d00]' : 'border-white/20 group-hover:border-white/40'}`} />
      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 transition-colors duration-300 ${isActive ? 'border-[#ff4d00]' : 'border-white/20 group-hover:border-white/40'}`} />
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 transition-colors duration-300 ${isActive ? 'border-[#ff4d00]' : 'border-white/20 group-hover:border-white/40'}`} />
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 transition-colors duration-300 ${isActive ? 'border-[#ff4d00]' : 'border-white/20 group-hover:border-white/40'}`} />

      {/* Card Content */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3.5 items-center">
          <div className={`p-2.5 rounded-xl border transition-colors duration-300 shrink-0 ${isActive ? 'border-[#ff4d00]/40 bg-[#ff4d00]/10 text-white' : 'border-white/10 bg-white/5 text-white/60'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1 text-left leading-none">
            <span className="font-mono text-[8px] tracking-[0.2em] text-[#ff4d00] uppercase font-bold">
              SYS_GROUP_0{index + 1}
            </span>
            <h4 className="font-display font-black text-xs md:text-sm tracking-wide uppercase mt-1 text-white">
              {title}
            </h4>
          </div>
        </div>

        <p className="text-gray-300 text-[11px] font-light leading-relaxed text-left line-clamp-3">
          {description}
        </p>
      </div>

      {/* Skills Badges list */}
      <div className="flex flex-wrap gap-1 mt-3">
        {items.map((skill, sIdx) => (
          <span
            key={sIdx}
            className={`font-mono text-[8px] tracking-wider px-2 py-0.5 rounded border transition-colors shrink-0 ${
              isActive
                ? "border-[#ff4d00]/30 bg-[#ff4d00]/15 text-white"
                : "border-white/5 bg-white/5 text-white/50"
            }`}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
