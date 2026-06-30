import React, { useRef, useState, useEffect } from "react";
import MaskedIntro from "./components/MaskedIntro";
import IntroAboutSequence from "./components/IntroAboutSequence";
import EngineeringCommandCenter from "./components/EngineeringCommandCenter";
import ProjectOperations from "./components/ProjectOperations";
import CareerOperationsLog from "./components/CareerOperationsLog";
import SecureTransmission from "./components/SecureTransmission";
import { PERSONAL_INFO } from "./data";
import { Shield, ArrowUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface NavTarget {
  id: string;
  type: "normal" | "scrollTriggerProgress";
  triggerId?: string;
  progress?: number;
  fallbackId?: string;
}

const navTargets: Record<string, NavTarget> = {
  "hero-section": {
    id: "hero-section",
    type: "scrollTriggerProgress",
    triggerId: "intro-about-sequence",
    progress: 0.0,
    fallbackId: "intro-about-container"
  },
  "about-section": {
    id: "about-section",
    type: "scrollTriggerProgress",
    triggerId: "intro-about-sequence",
    progress: 1.0,
    fallbackId: "intro-about-container"
  },
  "skills-section": {
    id: "skills-section",
    type: "normal",
    fallbackId: "skills-section"
  },
  "project-operations": {
    id: "project-operations",
    type: "normal",
    fallbackId: "project-operations"
  },
  "career-operations": {
    id: "career-operations",
    type: "normal",
    fallbackId: "career-operations"
  },
  "contact": {
    id: "contact",
    type: "scrollTriggerProgress",
    triggerId: "contact-sequence",
    progress: 0.85,
    fallbackId: "contact"
  }
};

export default function App() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("hero-section");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Smooth scroll jump helper utilizing ScrollTrigger progress when available
  const scrollToScrollTriggerProgress = (
    triggerId: string,
    progress: number,
    fallbackElementId: string,
    attempt = 1
  ) => {
    const trigger = ScrollTrigger.getById(triggerId);
    if (trigger) {
      const start = trigger.start;
      const end = trigger.end;
      const scrollPos = start + progress * (end - start);
      
      gsap.to(window, {
        scrollTo: scrollPos,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => {
          // Force immediate rendering update of frame-sequence
          ScrollTrigger.update();
        },
        onComplete: () => {
          ScrollTrigger.update();
        }
      });
      return;
    }

    // Attempt to refresh ScrollTriggers if not initialized yet
    if (attempt <= 2) {
      ScrollTrigger.refresh();
      requestAnimationFrame(() => {
        scrollToScrollTriggerProgress(triggerId, progress, fallbackElementId, attempt + 1);
      });
      return;
    }

    // Fallback if ScrollTrigger is completely unavailable
    const el = document.getElementById(fallbackElementId);
    if (el) {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top;
      let finalScrollPos = scrollTop;
      if (fallbackElementId === "intro-about-container") {
        finalScrollPos = scrollTop + el.offsetHeight * progress;
      } else if (fallbackElementId === "contact") {
        finalScrollPos = scrollTop + el.offsetHeight * progress;
      }
      gsap.to(window, {
        scrollTo: finalScrollPos,
        duration: 1.2,
        ease: "power2.inOut"
      });
    }
  };

  const navigateToSection = (sectionId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    const target = navTargets[sectionId];
    if (!target) return;

    if (target.type === "scrollTriggerProgress") {
      scrollToScrollTriggerProgress(
        target.triggerId!,
        target.progress!,
        target.fallbackId!
      );
    } else {
      const el = document.getElementById(target.fallbackId!);
      if (el) {
        gsap.to(window, {
          scrollTo: { y: el, autoKill: false },
          duration: 1.2,
          ease: "power2.inOut",
          onUpdate: () => {
            ScrollTrigger.update();
          },
          onComplete: () => {
            ScrollTrigger.update();
          }
        });
      }
    }
  };

  // Track scroll position to update active nav link and show scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // 1. Check if Contact sequence ScrollTrigger is active, or if element is in viewport
      const contactTrigger = ScrollTrigger.getById("contact-sequence");
      const contactEl = document.getElementById("contact");
      let isContactActive = false;

      if (contactTrigger && contactTrigger.isActive) {
        isContactActive = true;
      } else if (contactEl) {
        const rect = contactEl.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.55 && rect.bottom > 0) {
          isContactActive = true;
        }
      }

      if (isContactActive) {
        setActiveSection("contact");
        setShowScrollTop(scrollPosition > 300);
        return;
      }

      // 2. Check if Career Operations section is visible
      const careerEl = document.getElementById("career-operations");
      if (careerEl) {
        const rect = careerEl.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.55 && rect.bottom > 0) {
          setActiveSection("career-operations");
          setShowScrollTop(scrollPosition > 300);
          return;
        }
      }

      // 3. Check if Project Operations section is visible
      const opsEl = document.getElementById("project-operations");
      if (opsEl) {
        const rect = opsEl.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.55 && rect.bottom > 0) {
          setActiveSection("project-operations");
          setShowScrollTop(scrollPosition > 300);
          return;
        }
      }
      
      // 4. Check if Skills section is visible
      const skillsEl = document.getElementById("skills-section");
      if (skillsEl) {
        const rect = skillsEl.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.55 && rect.bottom > 0) {
          setActiveSection("skills-section");
          setShowScrollTop(scrollPosition > 300);
          return;
        }
      }

      // 5. Check progress of the IntroAboutSequence ScrollTrigger
      const introAboutTrigger = ScrollTrigger.getById("intro-about-sequence");
      if (introAboutTrigger) {
        const progress = introAboutTrigger.progress;
        if (progress >= 0.45) {
          setActiveSection("about-section");
        } else {
          setActiveSection("hero-section");
        }
      } else {
        const introAboutEl = document.getElementById("intro-about-container");
        if (introAboutEl) {
          const rect = introAboutEl.getBoundingClientRect();
          const totalHeight = introAboutEl.offsetHeight;
          const scrollRange = totalHeight - window.innerHeight;
          const progress = -rect.top / scrollRange;
          
          if (progress >= 0.45) {
            setActiveSection("about-section");
          } else {
            setActiveSection("hero-section");
          }
        }
      }

      if (scrollPosition > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={scrollContainerRef} className="relative w-full bg-cyber-dark text-gray-100 selection:bg-[#ff4d00] selection:text-white">
      
      {/* 1. Opening Cinematic Logo Mask Reveal */}
      <MaskedIntro />
  
      {/* Main Page Layout Wrapper */}
      <main className="relative w-full overflow-hidden">
        
        {/* Cinematic ambient scanline layer covering the main sections */}
        <div className="absolute inset-0 scanlines pointer-events-none z-30 opacity-[0.1]" />
  
        {/* 2. Top Minimalist Tactical Navigation Header */}
        <header className="fixed top-0 inset-x-0 h-20 bg-white/5 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-6 md:px-12 lg:px-16 select-none">
          {/* Logo Name */}
          <button
            onClick={() => navigateToSection("hero-section")}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#ff4d00] to-[#992200] flex items-center justify-center font-display font-black text-white text-sm shadow-orange-glow">
              HS
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="font-display font-black text-xs text-white group-hover:text-[#ff4d00] transition-colors tracking-wide">
                {PERSONAL_INFO.name.toUpperCase()}
              </span>
              <span className="font-mono text-[8px] text-white/40 tracking-[0.2em] uppercase mt-0.5">
                CREATIVE_TECH_V6
              </span>
            </div>
          </button>
  
          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase font-bold">
            {[
              { id: "hero-section", label: "HERO" },
              { id: "about-section", label: "ABOUT" },
              { id: "skills-section", label: "COMMAND CENTER" },
              { id: "project-operations", label: "PROJECT OPERATIONS" },
              { id: "career-operations", label: "CAREER LOG" },
              { id: "contact", label: "CONTACT" },
            ].map((node) => (
              <button
                key={node.id}
                onClick={() => navigateToSection(node.id)}
                className={`relative px-4 py-2 cursor-pointer rounded-lg border transition-all duration-300 ${
                  activeSection === node.id
                    ? "border-[#ff4d00]/30 text-[#ff4d00] bg-[#ff4d00]/5 [text-shadow:0_0_10px_rgba(255,77,0,0.3)]"
                    : "border-transparent text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{node.label}</span>
                {activeSection === node.id && (
                  <span className="absolute bottom-0 inset-x-4 h-[1px] bg-[#ff4d00]" />
                )}
              </button>
            ))}
          </nav>
  
          {/* Small Status Tag (Top Right) */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/60 font-mono text-[9px] tracking-widest uppercase">
            <Shield className="w-3 h-3 text-purple-400" />
            <span className="font-bold">SECURE PORTAL</span>
          </div>
        </header>
 
        {/* 3. Portfolio Core Content Pinned Sequence */}
        <IntroAboutSequence />
 
        {/* 3.5. Engineering Command Center Section */}
        <EngineeringCommandCenter />
 
        {/* 3.6. Project Operations Section */}
        <ProjectOperations />

        {/* 3.7. Career Operations Log Section */}
        <CareerOperationsLog />

        {/* 3.8. Secure Transmission Section */}
        <SecureTransmission />

        {/* 4. Cinematic Footer */}
        <footer className="relative w-full bg-[#050505] border-t border-white/5 py-12 px-6 md:px-12 select-none z-10 text-center font-mono text-[10px] text-white/40 tracking-wider">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#ff4d00] rounded-full animate-ping" />
              <span>TERMINAL SESSION ACTIVE // PORT 3000 // SYSTEM COMPILER COMPLETE</span>
            </div>
            <div>
              &copy; {new Date().getFullYear()} {PERSONAL_INFO.name.toUpperCase()}. ALL INTELLECTUAL ASSETS RESERVED.
            </div>
          </div>
        </footer>
  
        {/* 5. Tactical Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={() => navigateToSection("hero-section")}
            className="fixed bottom-6 right-6 z-50 p-3 bg-[#050505]/85 border border-white/10 hover:border-[#ff4d00]/40 rounded-full text-white/70 hover:text-white cursor-pointer shadow-md transition-all active:scale-95 shadow-orange-glow backdrop-blur-md"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
  
      </main>
    </div>
  );
}
