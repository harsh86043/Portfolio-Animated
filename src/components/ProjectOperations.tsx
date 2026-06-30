import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  FolderGit2, 
  Terminal, 
  Activity, 
  Cpu, 
  Database, 
  Wrench, 
  Layers, 
  Code2, 
  CheckCircle2, 
  ChevronRight, 
  AlertTriangle, 
  ShieldCheck,
  TrendingUp,
  FileText
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  opCode: string;
  title: string;
  category: string;
  role: string;
  status: string;
  overview: string;
  problem: string;
  solution: string;
  techStack: string[];
  highlights: string[];
  impact: string;
  classification: string;
}

const PROJECTS_DATA: Project[] = [
  {
    id: "crm-neo",
    opCode: "OP_01",
    title: "CRM Neo / Enterprise CRM Modernization",
    category: "Enterprise CRM Platform",
    role: "Frontend / Full-Stack Developer",
    status: "Active Deployment",
    overview: "Successfully modernized critical, high-throughput enterprise CRM workflows for Hindustan Wellness Pvt. Ltd., enabling robust agent management, role-based workflows, and seamless backend services.",
    problem: "Legacy CRM workflows were heavily coupled with outdated server-side architectures, causing severe scalability limitations, lagging user interface response times, and difficult maintenance.",
    solution: "Designed and implemented modular, reusable component systems, aligned complex role-based routing systems, and optimized high-performance RESTful APIs to deliver an agile, responsive single-page application experience.",
    techStack: ["Angular", "ASP.NET Core", "SQL Server", "REST APIs", "Tailwind CSS"],
    highlights: [
      "Designed and deployed modular Angular component architectures to streamline future visual additions.",
      "Engineered clean role-based dashboards tailored for Agents, Team Leaders, and Managers.",
      "Re-architected client state synchronization flows to minimize database query overload.",
      "Developed comprehensive full-stack workflows bridging client forms directly to SQL Server databases."
    ],
    impact: "Significantly improved code-base maintainability, increased workflow visibility, and dropped interface load times by over 45% across active operations.",
    classification: "CLASS_I // COMMERCIAL"
  },
  {
    id: "verve-dialer",
    opCode: "OP_02",
    title: "Verve Dialer Integration",
    category: "CRM Dialer Integration",
    role: "Full-Stack Integration Developer",
    status: "Production Ready",
    overview: "Integrated a high-throughput third-party dialer communication platform into the core corporate CRM, automating agent call sessions, lead assignment workflows, and single-sign-on access control.",
    problem: "Corporate agents suffered from productivity loss due to manual switching between the separate calling interface and the core customer database records.",
    solution: "Developed secure integration wrappers utilizing call state web hooks, SSO federation tokens, and session handling routines directly accessible inside active CRM views.",
    techStack: ["ASP.NET Web API", "JavaScript", "SSO Federation", "RESTful Call APIs"],
    highlights: [
      "Engineered automated session synchronization to authenticate agents automatically across both platforms.",
      "Mapped CRM fields dynamically to dialer campaign variables to supply instant user context.",
      "Designed low-latency hook handlers to capture call dispositions and log status updates in real-time.",
      "Optimized event pooling cycles to ensure zero UI freezes during continuous calling operations."
    ],
    impact: "Boosted outbound calling efficiency by over 30% while reducing manual administrative logging time per call.",
    classification: "CLASS_II // INTEGRATION"
  },
  {
    id: "lis-workflow",
    opCode: "OP_03",
    title: "LIS / CRM Workflow Enhancements",
    category: "Healthcare Systems",
    role: "Application Developer",
    status: "Operational Support",
    overview: "Designed critical workflow enhancements within Laboratory Information Systems (LIS) and CRM applications, mapping complex medical diagnostics mappings and location-based configuration profiles.",
    problem: "Outdated hardcoded mapping structures for diagnostics department tests led to dispatch delays and misrouting of medical data sheets.",
    solution: "Constructed an automated test type and department mapping layout inside SQL Server schemas, complete with an interactive administration interface for configuration.",
    techStack: ["ASP.NET Core", "Angular", "SQL Server", "Data Modeling"],
    highlights: [
      "Refactored relational database models to support highly dynamic diagnostic test specifications.",
      "Implemented location-specific CRM and LIS configurations supporting multiple clinics.",
      "Built automated data-pipeline routing to assign tests to correct physical labs instantaneously.",
      "Resolved live diagnostic latency issues through carefully designed stored procedures."
    ],
    impact: "Virtually eliminated manual routing mismatches (98.5% reduction) and accelerated clinical turnaround times.",
    classification: "CLASS_I // HEALTHCARE"
  },
  {
    id: "legacy-crm-modernization",
    opCode: "OP_04",
    title: "Legacy CRM Analysis & Modernization",
    category: "Legacy Refactoring",
    role: "CRM Refactoring / Analyst",
    status: "Phase 1 Complete",
    overview: "Conducted deep technical audit, codebase decoupling, and page-by-page modernization planning for a massive enterprise WebForms monolith, migrating it to a modern Angular and .NET Core REST setup.",
    problem: "The legacy WebForms system possessed high technical debt, monolithic coupling, and complex unmapped workflows that posed business regression risks if modified blindly.",
    solution: "Systematically mapped historical class relationships, analyzed session state payloads, and established a modular, phased migration blueprint to guarantee data flow fidelity.",
    techStack: ["ASP.NET WebForms", "Angular", "ASP.NET Core", "System Auditing"],
    highlights: [
      "Unraveled highly complex database interactions buried deep in legacy Code-Behind architectures.",
      "Constructed a structured documentation matrix mapping old ASPX pages directly to modern component candidates.",
      "Established secure hybrid authentication bridges allowing legacy and modern apps to share session data.",
      "Refactored mission-critical business algorithms into testable standalone C# modules."
    ],
    impact: "Established a foolproof, zero-downtime path for enterprise modernization while securing historical business logic integrity.",
    classification: "CLASS_III // TECHNICAL_DEBT"
  },
  {
    id: "cinematic-portfolio",
    opCode: "OP_05",
    title: "Cinematic Portfolio Website",
    category: "Interactive Design",
    role: "Frontend Developer",
    status: "Live Deployment",
    overview: "Architected a high-fidelity, interactive, and performance-focused cinematic developer portfolio featuring custom scroll-controlled 3D canvas rendering and lightweight vector HUD layouts.",
    problem: "Standard web portfolios look generic, fail to capture the user's attention, and often suffer from heavy layout-thrashing animations on mobile devices.",
    solution: "Crafted a performant, fully responsive interface powered by GSAP scroll sync, optimized canvas rendering, and Tailwind CSS utility styling to ensure an eye-catching experience.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "GSAP ScrollTrigger", "HTML Canvas"],
    highlights: [
      "Engineered responsive image frame-sequence loading utilizing HTML Canvas and precise preloading.",
      "Created highly modular, clean UI architectures with zero layout thrashing or cumulative layout shifts.",
      "Designed dynamic SVG coordinate mapping to draw real-time interactive connector lines around custom grids.",
      "Fully optimized page responsiveness with lightweight animations respecting reduced motion preferences."
    ],
    impact: "Delivered a spectacular interactive storytelling flow maintaining 60 FPS performance across multiple device families.",
    classification: "CLASS_I // INTERACTIVE"
  }
];

export default function ProjectOperations() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);

  // Check reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          }
        }
      );

      // Main Split Panel Animation
      gsap.fromTo(
        splitRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  const activeProject = PROJECTS_DATA[selectedIdx];

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
  };

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section
      ref={sectionRef}
      id="project-operations"
      className="relative w-full min-h-screen bg-[#04020a] border-t border-white/5 py-[clamp(6rem,_10vh,_8rem)] px-[clamp(1.5rem,_4vw,_4rem)] overflow-hidden flex flex-col justify-between"
    >
      {/* Cyber ambient layout backgrounds */}
      <div className="absolute inset-0 cyber-grid opacity-[0.06] z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#ff4d00]/2 rounded-full blur-[140px] pointer-events-none z-0" />
      
      <div className="relative w-full max-w-7xl mx-auto flex-grow flex flex-col justify-center">
        
        {/* SECTION HEADER */}
        <div ref={headerRef} className="w-full flex flex-col items-center select-none text-center mb-16 z-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#ff4d00] uppercase font-black">
            <FolderGit2 className="w-4 h-4" />
            <span>SYS_MODULE_03 // PROJECTS_ARCHIVE</span>
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight leading-tight text-white mt-2 uppercase">
            PROJECT OPERATIONS
          </h2>
          <div className="w-20 h-[2px] bg-[#ff4d00]/60 mt-3 rounded" />
          <p className="text-xs text-white/50 font-mono tracking-wider mt-2 uppercase">
            Commercial Deployments & System Implementations
          </p>
        </div>

        {/* CORE WORKSPACE PANEL */}
        <div ref={splitRef} className="relative z-10 w-full">

          {/* ========================================================
              DESKTOP SPLIT VIEW LAYOUT (xl:grid)
              ======================================================== */}
          <div className="hidden xl:grid grid-cols-[380px_1fr] gap-8 items-start w-full min-h-[550px]">
            
            {/* LEFT COLUMN: Mission Selector List */}
            <div className="flex flex-col gap-3 max-h-[550px] overflow-y-auto pr-2 scrollbar-thin">
              <div className="font-mono text-[9px] tracking-widest text-white/35 uppercase border-b border-white/10 pb-2 mb-1 flex items-center justify-between">
                <span>SELECTABLE OPERATIONS</span>
                <span>[{PROJECTS_DATA.length}_FOUND]</span>
              </div>
              
              {PROJECTS_DATA.map((project, idx) => {
                const isActive = selectedIdx === idx;
                const isHovered = hoveredIdx === idx;
                return (
                  <button
                    key={project.id}
                    onClick={() => handleSelect(idx)}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    aria-selected={isActive}
                    role="tab"
                    id={`op-tab-${project.id}`}
                    aria-controls={`op-panel-${project.id}`}
                    className={`group relative text-left w-full p-4 border rounded-xl bg-black/45 backdrop-blur-md cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "border-[#ff4d00]/80 shadow-orange-glow-sm bg-[#ff4d00]/5"
                        : "border-white/10 hover:border-white/25 hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Active Corner indicators */}
                    {isActive && (
                      <>
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ff4d00]" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ff4d00]" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ff4d00]" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ff4d00]" />
                      </>
                    )}

                    {/* Meta Indicators */}
                    <div className="flex justify-between items-center mb-1.5 font-mono text-[8px] tracking-widest leading-none">
                      <span className={`font-bold transition-colors ${isActive ? "text-[#ff4d00]" : "text-white/40 group-hover:text-white/60"}`}>
                        {project.opCode} // {project.classification}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded-sm border transition-colors ${
                        isActive 
                          ? "border-[#ff4d00]/30 bg-[#ff4d00]/10 text-[#ff4d00]" 
                          : "border-white/5 bg-white/5 text-white/30"
                      }`}>
                        {project.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`font-display font-black text-sm uppercase tracking-wide leading-snug transition-colors ${
                      isActive ? "text-white" : "text-white/70 group-hover:text-white"
                    }`}>
                      {project.title.split(" / ")[0]}
                    </h3>

                    {/* Sub title / Role */}
                    <p className="font-mono text-[9px] text-white/40 mt-1 uppercase tracking-wider group-hover:text-white/55 transition-colors">
                      {project.category}
                    </p>

                    {/* Small visual accent lines on active */}
                    <div className={`h-0.5 bg-[#ff4d00] transition-all duration-300 mt-3 rounded-full ${
                      isActive ? "w-12" : "w-0"
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* RIGHT COLUMN: Active Project Detail Panel */}
            <div className="relative min-h-[550px] bg-black/60 border border-white/10 rounded-2xl p-8 backdrop-blur-md flex flex-col justify-between overflow-hidden">
              
              {/* Cyber panel styling details */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff4d00]/40 to-transparent" />
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/20" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={isReducedMotion ? {} : { opacity: 0, y: 15 }}
                  animate={isReducedMotion ? {} : { opacity: 1, y: 0 }}
                  exit={isReducedMotion ? {} : { opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  id={`op-panel-${activeProject.id}`}
                  role="tabpanel"
                  aria-labelledby={`op-tab-${activeProject.id}`}
                  className="w-full h-full flex flex-col justify-between flex-grow gap-6"
                >
                  
                  {/* Top Metadata Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 border border-[#ff4d00]/30 bg-[#ff4d00]/10 text-[#ff4d00] rounded-lg">
                        <Terminal className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[8px] tracking-[0.25em] text-[#ff4d00] uppercase font-bold">
                          ACTIVE_OPERATION_LOG // {activeProject.opCode}
                        </span>
                        <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
                          {activeProject.title}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 font-mono text-[9px] tracking-wider shrink-0">
                      <div className="flex items-center gap-1.5 bg-[#ff4d00]/10 border border-[#ff4d00]/20 px-2.5 py-1 rounded text-[#ff4d00] uppercase font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{activeProject.classification}</span>
                      </div>
                    </div>
                  </div>

                  {/* Core Description Content & Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
                    
                    {/* Role & Overview */}
                    <div className="lg:col-span-7 flex flex-col gap-4 text-left">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] text-[#ff4d00] tracking-widest uppercase font-black">
                          ROLE & RESPONSIBILITY
                        </span>
                        <p className="font-display font-bold text-sm text-white/90">
                          {activeProject.role}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-mono text-[9px] text-[#ff4d00] tracking-widest uppercase font-black">
                          MISSION OVERVIEW
                        </span>
                        <p className="text-xs text-white/70 leading-relaxed font-sans font-medium">
                          {activeProject.overview}
                        </p>
                      </div>

                      {/* Problem Statement Box */}
                      <div className="border-l-2 border-red-500/50 bg-red-500/[0.03] p-3 rounded-r-lg mt-1">
                        <div className="flex items-center gap-1.5 font-mono text-[8px] text-red-400 font-bold tracking-widest mb-1 uppercase">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>CHALLENGE / PROBLEM STATEMENT</span>
                        </div>
                        <p className="text-[11px] text-white/60 leading-relaxed font-sans">
                          {activeProject.problem}
                        </p>
                      </div>

                      {/* Solution Statement Box */}
                      <div className="border-l-2 border-[#ff4d00]/50 bg-[#ff4d00]/[0.03] p-3 rounded-r-lg">
                        <div className="flex items-center gap-1.5 font-mono text-[8px] text-[#ff4d00] font-bold tracking-widest mb-1 uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>ENGINEERED ARCHITECTURE / SOLUTION</span>
                        </div>
                        <p className="text-[11px] text-white/60 leading-relaxed font-sans">
                          {activeProject.solution}
                        </p>
                      </div>
                    </div>

                    {/* Tech Stack & Core Highlights */}
                    <div className="lg:col-span-5 flex flex-col gap-4 text-left">
                      
                      {/* Tech Stack Badges */}
                      <div className="flex flex-col gap-2">
                        <span className="font-mono text-[9px] text-[#ff4d00] tracking-widest uppercase font-black">
                          TECHNOLOGY PROFILE
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {activeProject.techStack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="font-mono text-[9px] tracking-wider px-2 py-0.5 rounded border border-white/10 bg-white/5 text-white/80 font-bold"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="flex flex-col gap-2">
                        <span className="font-mono text-[9px] text-[#ff4d00] tracking-widest uppercase font-black">
                          OPERATIONAL LOG HIGHLIGHTS
                        </span>
                        <ul className="flex flex-col gap-2">
                          {activeProject.highlights.map((highlight, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-2 text-[10px] text-white/60 leading-normal">
                              <ChevronRight className="w-3.5 h-3.5 text-[#ff4d00] shrink-0 mt-0.5" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>

                  {/* Impact Summary Line */}
                  <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 bg-[#ff4d00]/10 border border-[#ff4d00]/20 px-3 py-2 rounded-xl text-left w-full sm:w-auto">
                      <TrendingUp className="w-4 h-4 text-[#ff4d00] shrink-0" />
                      <div className="flex flex-col leading-none">
                        <span className="font-mono text-[8px] text-[#ff4d00] uppercase font-bold tracking-widest">
                          BUSINESS & OPERATIONAL IMPACT
                        </span>
                        <p className="text-[11px] text-white/85 font-medium mt-1">
                          {activeProject.impact}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[8px] text-white/30 tracking-widest select-none uppercase">
                      <FileText className="w-3.5 h-3.5" />
                      <span>SECURE RECORD LOCKED</span>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* ========================================================
              MOBILE & TABLET STACKED ACCORDION VIEW (xl:hidden)
              ======================================================== */}
          <div className="xl:hidden flex flex-col gap-4 w-full max-w-4xl mx-auto">
            {PROJECTS_DATA.map((project, index) => {
              const isExpanded = expandedId === project.id;
              return (
                <div
                  key={project.id}
                  className={`border rounded-2xl bg-[#04020a]/85 border-white/10 backdrop-blur-md overflow-hidden transition-all duration-300 ${
                    isExpanded ? "border-[#ff4d00]/40 shadow-orange-glow-sm" : ""
                  }`}
                >
                  {/* Collapsed Header Trigger */}
                  <button
                    onClick={() => handleToggleExpand(project.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg border transition-all ${
                        isExpanded 
                          ? "border-[#ff4d00]/30 bg-[#ff4d00]/10 text-[#ff4d00]" 
                          : "border-white/10 bg-white/5 text-white/50"
                      }`}>
                        <Terminal className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="font-mono text-[8px] text-[#ff4d00] tracking-widest uppercase font-bold">
                          {project.opCode} // {project.category}
                        </span>
                        <h4 className="font-display font-black text-sm text-white uppercase mt-0.5 tracking-wide">
                          {project.title.split(" / ")[0]}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`hidden sm:inline font-mono text-[8px] px-1.5 py-0.5 rounded border ${
                        isExpanded ? "border-[#ff4d00]/20 text-[#ff4d00]" : "border-white/5 text-white/30"
                      }`}>
                        {project.status}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-white/50 transition-transform duration-300 ${isExpanded ? "rotate-90 text-[#ff4d00]" : ""}`} />
                    </div>
                  </button>

                  {/* Expanded detail box */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={isReducedMotion ? {} : { height: 0, opacity: 0 }}
                        animate={isReducedMotion ? {} : { height: "auto", opacity: 1 }}
                        exit={isReducedMotion ? {} : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 border-t border-white/10 bg-black/40 flex flex-col gap-5 text-left">
                          
                          {/* Role & Overview */}
                          <div className="flex flex-col gap-1.5">
                            <span className="font-mono text-[8px] text-[#ff4d00] tracking-widest uppercase font-black">
                              ROLE & RESPONSIBILITY
                            </span>
                            <p className="text-xs text-white/90 font-bold font-sans">
                              {project.role}
                            </p>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <span className="font-mono text-[8px] text-[#ff4d00] tracking-widest uppercase font-black">
                              MISSION OVERVIEW
                            </span>
                            <p className="text-xs text-white/70 leading-relaxed font-sans">
                              {project.overview}
                            </p>
                          </div>

                          {/* Problem/Solution */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border-l border-red-500/40 bg-red-500/[0.02] p-3 rounded-r-xl">
                              <span className="font-mono text-[8px] text-red-400 tracking-widest uppercase font-bold block mb-1">
                                CHALLENGE
                              </span>
                              <p className="text-[10px] text-white/60 leading-relaxed font-sans">
                                {project.problem}
                              </p>
                            </div>
                            <div className="border-l border-[#ff4d00]/40 bg-[#ff4d00]/[0.02] p-3 rounded-r-xl">
                              <span className="font-mono text-[8px] text-[#ff4d00] tracking-widest uppercase font-bold block mb-1">
                                ENGINEERED SOLUTION
                              </span>
                              <p className="text-[10px] text-white/60 leading-relaxed font-sans">
                                {project.solution}
                              </p>
                            </div>
                          </div>

                          {/* Tech Profile */}
                          <div className="flex flex-col gap-2">
                            <span className="font-mono text-[8px] text-[#ff4d00] tracking-widest uppercase font-black">
                              TECHNOLOGY PROFILE
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {project.techStack.map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="font-mono text-[8px] tracking-wider px-2 py-0.5 rounded border border-white/5 bg-white/5 text-white/70"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Highlights */}
                          <div className="flex flex-col gap-2">
                            <span className="font-mono text-[8px] text-[#ff4d00] tracking-widest uppercase font-black">
                              HIGHLIGHTS
                            </span>
                            <ul className="flex flex-col gap-1.5">
                              {project.highlights.map((highlight, hIdx) => (
                                <li key={hIdx} className="flex items-start gap-1.5 text-[10px] text-white/60 leading-normal">
                                  <ChevronRight className="w-3.5 h-3.5 text-[#ff4d00] shrink-0 mt-0.5" />
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Impact */}
                          <div className="border-t border-white/5 pt-4">
                            <div className="flex items-start gap-2 bg-[#ff4d00]/10 border border-[#ff4d00]/20 p-2.5 rounded-lg">
                              <TrendingUp className="w-3.5 h-3.5 text-[#ff4d00] shrink-0 mt-0.5" />
                              <div className="flex flex-col leading-none">
                                <span className="font-mono text-[7px] text-[#ff4d00] uppercase font-bold tracking-widest">
                                  IMPACT METRIC
                                </span>
                                <p className="text-[10px] text-white/80 font-medium mt-1 leading-snug">
                                  {project.impact}
                                </p>
                              </div>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* FOOTER METRICS STATUS LINE */}
      <div className="relative w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between font-mono text-[9px] tracking-widest text-white/30 select-none z-10 pt-8 border-t border-white/5 mt-16">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#ff4d00] rounded-full animate-ping" />
          <span>OPERATIONAL DATABASE STREAM // RECONCILIATION VERIFIED</span>
        </div>
        <div className="mt-2 sm:mt-0">
          SECURE PROTOCOL HS_OP_V3.0
        </div>
      </div>
    </section>
  );
}
