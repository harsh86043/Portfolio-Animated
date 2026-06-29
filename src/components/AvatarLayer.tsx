import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Terminal, Shield, Zap, Sparkles, Compass } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface AvatarLayerProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function AvatarLayer({ scrollContainerRef }: AvatarLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Slide container refs
  const slideHeroRef = useRef<HTMLDivElement>(null);
  const slideAboutRef = useRef<HTMLDivElement>(null);
  const slideSkillsRef = useRef<HTMLDivElement>(null);
  const slideProjectsRef = useRef<HTMLDivElement>(null);
  const slideExperienceRef = useRef<HTMLDivElement>(null);
  const slideDriveRef = useRef<HTMLDivElement>(null);
  const slideContactRef = useRef<HTMLDivElement>(null);

  // Dynamic status bar text ref
  const statusIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const slides = [
      { ref: slideHeroRef, id: "#hero-section", color: "text-rose-500", status: "HERO // INTRO_SEQUENCE_ACTIVE" },
      { ref: slideAboutRef, id: "#about-section", color: "text-[#ff4d00]", status: "ABOUT // SYNC_PROFILE_NODE" },
      { ref: slideSkillsRef, id: "#skills-section", color: "text-cyan-400", status: "SKILLS // CORE_TECH_INDEX_OK" },
      { ref: slideProjectsRef, id: "#projects-section", color: "text-indigo-400", status: "WORKS // PRODUCTION_PIPELINES" },
      { ref: slideExperienceRef, id: "#experience-section", color: "text-purple-400", status: "HISTORY // CHRONOLOGY_LOADED" },
      { ref: slideDriveRef, id: "#drive-section", color: "text-emerald-400", status: "DRIVE // SECURE_WORKSPACE" },
      { ref: slideContactRef, id: "#contact-section", color: "text-amber-500", status: "CONNECT // TERMINAL_ACTIVE" }
    ];

    // Initialize all slides except Hero to opacity 0
    slides.forEach((slide, index) => {
      if (slide.ref.current) {
        gsap.set(slide.ref.current, {
          opacity: index === 0 ? 1 : 0,
          scale: index === 0 ? 1.02 : 0.95,
          z: 0
        });
      }
    });

    // Create GSAP transitions for each section
    slides.forEach((slide, index) => {
      if (!slide.ref.current) return;

      // When the corresponding section enters the screen, we transition the background
      ScrollTrigger.create({
        trigger: slide.id,
        start: "top 60%",
        end: "bottom 40%",
        onToggle: (self) => {
          if (self.isActive) {
            // Transition current slide in
            gsap.to(slide.ref.current, {
              opacity: 1,
              scale: 1.02,
              duration: 1.2,
              ease: "power2.out",
              overwrite: "auto"
            });

            // Update status text indicator
            if (statusIndicatorRef.current) {
              statusIndicatorRef.current.innerHTML = `<span>● ${slide.status}</span>`;
              statusIndicatorRef.current.className = `font-mono text-[9px] tracking-widest uppercase flex items-center gap-2 transition-all duration-300 ${slide.color} [text-shadow:0_0_10px_rgba(255,255,255,0.15)]`;
            }

            // Transition all OTHER slides out
            slides.forEach((other, oIndex) => {
              if (oIndex !== index && other.ref.current) {
                gsap.to(other.ref.current, {
                  opacity: 0,
                  scale: oIndex < index ? 1.08 : 0.95, // Subtle parallax scaling (zoom in if scrolled past, zoom out if ahead)
                  duration: 1.2,
                  ease: "power2.out",
                  overwrite: "auto"
                });
              }
            });
          }
        }
      });

      // Add a continuous smooth parallax mouse movement drift on desktop
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPos = (clientX / innerWidth - 0.5) * 20; // 20px max horizontal drift
        const yPos = (clientY / innerHeight - 0.5) * 15; // 15px max vertical drift

        slides.forEach((s) => {
          if (s.ref.current) {
            // Parallax drift the inner character layer
            const character = s.ref.current.querySelector(".character-layer");
            const bgLayer = s.ref.current.querySelector(".bg-parallax-layer");
            
            if (character) {
              gsap.to(character, {
                x: xPos,
                y: yPos,
                rotationY: xPos * 0.15,
                duration: 0.8,
                ease: "power1.out",
                overwrite: "auto"
              });
            }
            if (bgLayer) {
              gsap.to(bgLayer, {
                x: -xPos * 0.5,
                y: -yPos * 0.5,
                duration: 1.0,
                ease: "power1.out",
                overwrite: "auto"
              });
            }
          }
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [scrollContainerRef]);

  return (
    <div
      ref={containerRef}
      id="cinematic-background-system"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 select-none overflow-hidden bg-[#04020a]"
    >
      {/* 1. Global Cinematic Overlay Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(4,2,10,0.8)_95%)] z-40" />
      <div className="absolute inset-0 scanlines pointer-events-none z-40 opacity-[0.12]" />
      
      {/* Atmospheric dust particles layer */}
      <div className="absolute inset-0 bg-ambient-dust opacity-35 z-25 mix-blend-screen pointer-events-none" />

      {/* 2. BACKGROUND SLIDE 0: HERO (Twilight Sunrise Red/Orange) */}
      <div
        ref={slideHeroRef}
        className="absolute inset-0 w-full h-full transition-transform duration-1000 select-none"
      >
        <div className="bg-parallax-layer absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,#40120b_0%,transparent_60%),radial-gradient(circle_at_25%_75%,#1a0c30_0%,transparent_70%)] opacity-95">
          <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?q=80&w=1920')" }} />
        </div>
        {/* Character Layer - Positioned Right on Desktop, Centered and Subdued on Mobile */}
        <div className="character-layer absolute inset-0 flex items-center justify-end lg:pr-24 z-20">
          <div className="relative w-full max-w-[90vw] lg:max-w-[45vw] h-[80vh] flex items-center justify-center lg:justify-end">
            <div className="absolute inset-0 rounded-full bg-[#ff4d00]/3 blur-[120px] mix-blend-screen" />
            <div className="relative w-[340px] h-[480px] sm:w-[400px] sm:h-[550px] lg:w-[450px] lg:h-[630px] rounded-[40px] overflow-hidden border border-white/5 bg-white/[0.02] shadow-2xl backdrop-blur-md opacity-85 lg:opacity-90 transition-all">
              {/* Outer neon edge line */}
              <div className="absolute inset-0 border border-t-[#ff4d00]/40 border-r-[#ff4d00]/20 border-l-transparent border-b-transparent rounded-[40px]" />
              
              {/* Cinematic face graphic with stylized properties */}
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop"
                alt="Harsh Suryavanshi - Hero Pose"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-top filter saturate-[0.8] brightness-[0.7] contrast-[1.1] mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04020a] via-transparent to-transparent opacity-80" />
              {/* Sunset orange rim gradient */}
              <div className="absolute inset-0 bg-gradient-to-l from-[#ff4d00]/15 via-transparent to-transparent mix-blend-color-dodge" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. BACKGROUND SLIDE 1: ABOUT (Twilight Purple / Tech Workstation) */}
      <div
        ref={slideAboutRef}
        className="absolute inset-0 w-full h-full transition-transform duration-1000 select-none"
      >
        <div className="bg-parallax-layer absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,#220d3d_0%,transparent_60%),radial-gradient(circle_at_20%_60%,#090518_0%,transparent_75%)] opacity-95">
          <div className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-[0.08]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920')" }} />
        </div>
        {/* Character Layer - Right Aligned (Desktop) */}
        <div className="character-layer absolute inset-0 flex items-center justify-end lg:pr-24 z-20">
          <div className="relative w-full max-w-[90vw] lg:max-w-[45vw] h-[80vh] flex items-center justify-center lg:justify-end">
            <div className="absolute inset-0 rounded-full bg-purple-500/3 blur-[120px] mix-blend-screen" />
            <div className="relative w-[340px] h-[480px] sm:w-[400px] sm:h-[550px] lg:w-[430px] lg:h-[600px] rounded-[40px] overflow-hidden border border-white/5 bg-white/[0.01] shadow-2xl backdrop-blur-md opacity-85 lg:opacity-90">
              <div className="absolute inset-0 border border-t-purple-500/40 border-r-purple-500/20 border-l-transparent border-b-transparent rounded-[40px]" />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
                alt="Harsh Suryavanshi - About Pose"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-top filter saturate-[0.7] brightness-[0.65] contrast-[1.1] mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04020a] via-transparent to-transparent opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-l from-purple-500/10 via-transparent to-transparent mix-blend-color-dodge" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. BACKGROUND SLIDE 2: SKILLS (Holographic Cyan / Abstract Tech Grid) */}
      <div
        ref={slideSkillsRef}
        className="absolute inset-0 w-full h-full transition-transform duration-1000 select-none"
      >
        <div className="bg-parallax-layer absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,#0a2d3c_0%,transparent_60%),radial-gradient(circle_at_80%_70%,#04020a_0%,transparent_75%)] opacity-95">
          <div className="absolute inset-0 bg-cover bg-center mix-blend-color-dodge opacity-[0.06]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1920')" }} />
        </div>
        {/* Character Layer - Left Aligned (Desktop) */}
        <div className="character-layer absolute inset-0 flex items-center justify-start lg:pl-24 z-20">
          <div className="relative w-full max-w-[90vw] lg:max-w-[45vw] h-[80vh] flex items-center justify-center lg:justify-start">
            <div className="absolute inset-0 rounded-full bg-cyan-500/3 blur-[120px] mix-blend-screen" />
            <div className="relative w-[340px] h-[480px] sm:w-[400px] sm:h-[550px] lg:w-[430px] lg:h-[600px] rounded-[40px] overflow-hidden border border-white/5 bg-white/[0.01] shadow-2xl backdrop-blur-md opacity-85 lg:opacity-90">
              <div className="absolute inset-0 border border-t-cyan-500/40 border-l-cyan-500/20 border-r-transparent border-b-transparent rounded-[40px]" />
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop"
                alt="Harsh Suryavanshi - Skills Gesture Pose"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-top filter saturate-[0.75] brightness-[0.7] contrast-[1.1] mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04020a] via-transparent to-transparent opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-transparent to-transparent mix-blend-color-dodge" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. BACKGROUND SLIDE 3: PROJECTS (Cockpit Dashboard Grid / Indigo Blue) */}
      <div
        ref={slideProjectsRef}
        className="absolute inset-0 w-full h-full transition-transform duration-1000 select-none"
      >
        <div className="bg-parallax-layer absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,#101a40_0%,transparent_60%),radial-gradient(circle_at_20%_80%,#04020a_0%,transparent_75%)] opacity-95">
          <div className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-[0.05]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920')" }} />
        </div>
        {/* Character Layer - Right Aligned (Desktop) */}
        <div className="character-layer absolute inset-0 flex items-center justify-end lg:pr-24 z-20">
          <div className="relative w-full max-w-[90vw] lg:max-w-[45vw] h-[80vh] flex items-center justify-center lg:justify-end">
            <div className="absolute inset-0 rounded-full bg-indigo-500/3 blur-[120px] mix-blend-screen" />
            <div className="relative w-[340px] h-[480px] sm:w-[400px] sm:h-[550px] lg:w-[430px] lg:h-[600px] rounded-[40px] overflow-hidden border border-white/5 bg-white/[0.01] shadow-2xl backdrop-blur-md opacity-85 lg:opacity-90">
              <div className="absolute inset-0 border border-t-indigo-500/40 border-r-indigo-500/20 border-l-transparent border-b-transparent rounded-[40px]" />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop"
                alt="Harsh Suryavanshi - Projects Dashboard Pose"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-top filter saturate-[0.6] brightness-[0.65] contrast-[1.1] mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04020a] via-transparent to-transparent opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-l from-indigo-500/10 via-transparent to-transparent mix-blend-color-dodge" />
            </div>
          </div>
        </div>
      </div>

      {/* 6. BACKGROUND SLIDE 4: EXPERIENCE (Dark Corporate / Cobalt Purple) */}
      <div
        ref={slideExperienceRef}
        className="absolute inset-0 w-full h-full transition-transform duration-1000 select-none"
      >
        <div className="bg-parallax-layer absolute inset-0 bg-[radial-gradient(circle_at_25%_45%,#221040_0%,transparent_60%),radial-gradient(circle_at_80%_60%,#04020a_0%,transparent_75%)] opacity-95">
          <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-[0.12]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920')" }} />
        </div>
        {/* Character Layer - Left Aligned (Desktop) */}
        <div className="character-layer absolute inset-0 flex items-center justify-start lg:pl-24 z-20">
          <div className="relative w-full max-w-[90vw] lg:max-w-[45vw] h-[80vh] flex items-center justify-center lg:justify-start">
            <div className="absolute inset-0 rounded-full bg-purple-500/3 blur-[120px] mix-blend-screen" />
            <div className="relative w-[340px] h-[480px] sm:w-[400px] sm:h-[550px] lg:w-[430px] lg:h-[600px] rounded-[40px] overflow-hidden border border-white/5 bg-white/[0.01] shadow-2xl backdrop-blur-md opacity-85 lg:opacity-90">
              <div className="absolute inset-0 border border-t-purple-500/40 border-l-purple-500/20 border-r-transparent border-b-transparent rounded-[40px]" />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
                alt="Harsh Suryavanshi - Chronology Pose"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-top filter saturate-[0.6] brightness-[0.6] contrast-[1.1] mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04020a] via-transparent to-transparent opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent mix-blend-color-dodge" />
            </div>
          </div>
        </div>
      </div>

      {/* 7. BACKGROUND SLIDE 5: DRIVE WORKSPACE (Hacker Secure Green / Cobalt Nodes) */}
      <div
        ref={slideDriveRef}
        className="absolute inset-0 w-full h-full transition-transform duration-1000 select-none"
      >
        <div className="bg-parallax-layer absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#092f20_0%,transparent_60%),radial-gradient(circle_at_80%_80%,#04020a_0%,transparent_75%)] opacity-95">
          <div className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-[0.05]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1920')" }} />
        </div>
        {/* Character Layer - Centered & Highly Subdued/Blurred in Deep Background to prioritize full width Terminal */}
        <div className="character-layer absolute inset-0 flex items-center justify-center z-10 opacity-30">
          <div className="relative w-full max-w-[90vw] h-[85vh] flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/3 blur-[140px] mix-blend-screen" />
            <div className="relative w-[320px] h-[450px] sm:w-[380px] sm:h-[500px] lg:w-[420px] lg:h-[550px] rounded-[40px] overflow-hidden border border-white/5 bg-white/[0.01] shadow-2xl backdrop-blur-3xl">
              <div className="absolute inset-0 border border-emerald-500/20 rounded-[40px]" />
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop"
                alt="Harsh Suryavanshi - Workspace System Background"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-top filter saturate-[0.4] brightness-[0.4] blur-sm contrast-[1.0] mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04020a] via-transparent to-transparent opacity-95" />
            </div>
          </div>
        </div>
      </div>

      {/* 8. BACKGROUND SLIDE 6: CONTACT (Sunset Warm Amber / friendly Pose) */}
      <div
        ref={slideContactRef}
        className="absolute inset-0 w-full h-full transition-transform duration-1000 select-none"
      >
        <div className="bg-parallax-layer absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,#4d230d_0%,transparent_60%),radial-gradient(circle_at_25%_65%,#04020a_0%,transparent_75%)] opacity-95">
          <div className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-[0.06]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920')" }} />
        </div>
        {/* Character Layer - Right Aligned (Desktop) */}
        <div className="character-layer absolute inset-0 flex items-center justify-end lg:pr-24 z-20">
          <div className="relative w-full max-w-[90vw] lg:max-w-[45vw] h-[80vh] flex items-center justify-center lg:justify-end">
            <div className="absolute inset-0 rounded-full bg-amber-500/3 blur-[120px] mix-blend-screen" />
            <div className="relative w-[340px] h-[480px] sm:w-[400px] sm:h-[550px] lg:w-[430px] lg:h-[600px] rounded-[40px] overflow-hidden border border-white/5 bg-white/[0.01] shadow-2xl backdrop-blur-md opacity-85 lg:opacity-90">
              <div className="absolute inset-0 border border-t-amber-500/40 border-r-amber-500/20 border-l-transparent border-b-transparent rounded-[40px]" />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop"
                alt="Harsh Suryavanshi - Welcoming Pose"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-top filter saturate-[0.75] brightness-[0.7] contrast-[1.1] mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04020a] via-transparent to-transparent opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-l from-amber-500/10 via-transparent to-transparent mix-blend-color-dodge" />
            </div>
          </div>
        </div>
      </div>

      {/* 9. Permanent Cinematic Grid Lines & Marginal HUD Details */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/5 z-30" />
      <div className="absolute inset-y-0 left-12 w-px bg-white/5 z-30 hidden md:block" />
      <div className="absolute inset-y-0 right-12 w-px bg-white/5 z-30 hidden md:block" />

      {/* Floating HUD Side labels */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-10 font-mono text-[8px] tracking-[0.3em] text-white/15 uppercase origin-left -rotate-90 select-none">
        <div className="flex items-center gap-4">
          <div className="w-12 h-[1px] bg-white/10" />
          <span>SYS.RENDER_V6.0 // ACTIVE</span>
        </div>
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-10 font-mono text-[8px] tracking-[0.3em] text-white/15 uppercase origin-right rotate-90 select-none">
        <div className="flex items-center gap-4">
          <span>PORT 3000 // FRAME_STORYTELLING</span>
          <div className="w-12 h-[1px] bg-white/10" />
        </div>
      </div>

      {/* Real-Time Live HUD Status Readout bar at bottom left corner */}
      <div className="absolute bottom-6 left-6 md:left-16 z-30 flex items-center gap-2 select-none pointer-events-auto bg-black/40 px-3 py-1.5 border border-white/5 rounded backdrop-blur-md">
        <Cpu className="w-3.5 h-3.5 text-[#ff4d00] animate-pulse" />
        <div ref={statusIndicatorRef} className="font-mono text-[9px] tracking-widest text-[#ff4d00] uppercase font-bold flex items-center gap-2">
          <span>● HERO // INTRO_SEQUENCE_ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
