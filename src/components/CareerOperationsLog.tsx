import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Briefcase, 
  Terminal, 
  Calendar, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  ChevronRight, 
  Cpu, 
  Database, 
  FileCode2, 
  Activity, 
  TrendingUp, 
  Clock 
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceLog {
  id: string;
  nodeCode: string;
  role: string;
  company: string;
  duration: string;
  location: string;
  status: string;
  focus: string;
  overview: string;
  responsibilities: string[];
  technologies: string[];
  impact: string;
  classification: string;
}

export default function CareerOperationsLog() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);

  // Resume and Project-aligned Experience Logs
  const experienceLogs: ExperienceLog[] = useMemo(() => [
    {
      id: "hw-crm-core",
      nodeCode: "SYS_LOG_01",
      role: "Full-Stack .NET Developer (CRM Core)",
      company: "Hindustan Wellness Pvt. Ltd.",
      duration: "Nov 2025 - Present",
      location: "Gurugram, Haryana, India",
      status: "Active Production Workflow",
      focus: "Enterprise CRM & Healthcare Workflows",
      overview: "Directing core full-stack enhancements for proprietary high-throughput healthcare CRM software, implementing role-based dashboards, and optimizing query pipelines to sustain active daily workflows.",
      responsibilities: [
        "Develop and maintain enterprise-grade CRM applications utilizing ASP.NET Core, Angular, SQL Server, and REST APIs.",
        "Refactor high-latency relational queries, implementing optimized stored procedures and pagination logic to eliminate processing lag.",
        "Engineer dynamic role-based reporting panels tailored specifically for Agents, Team Leaders, and Operations Managers.",
        "Address high-priority backend exceptions and resolve live production bottlenecks, securing 99.9% platform availability."
      ],
      technologies: ["ASP.NET Core", "Angular", "Microsoft SQL Server", "C#", "REST APIs", "Tailwind CSS"],
      impact: "Accelerated database-driven workflow loading speeds, improving query retrieval efficiency for critical diagnostics screens.",
      classification: "SECURE_DEPLOYMENT // ACTIVE"
    },
    {
      id: "hw-dialer-integration",
      nodeCode: "SYS_LOG_02",
      role: "Full-Stack Integration Developer",
      company: "Hindustan Wellness Pvt. Ltd.",
      duration: "Nov 2025 - Present",
      location: "Gurugram, Haryana, India",
      status: "Production Ready",
      focus: "Unified Communication & Session Management",
      overview: "Engineered deep native bridges to wire external high-capacity third-party Dialer interfaces straight into active CRM workspace pages to eliminate agent environment switching.",
      responsibilities: [
        "Architected unified communication pipelines utilizing event webhooks and active background session states.",
        "Designed and structured Single Sign-On (SSO) authentication wrappers to federate agent identity profiles securely.",
        "Mapped corporate customer profiles dynamically to target campaign buffers to supply instantaneous recipient context.",
        "Automated disposition tracking procedures to save agent log states directly into relational tables in real-time."
      ],
      technologies: ["ASP.NET Web API", "JavaScript", "SSO Federation", "API Integration", "Stored Procedures"],
      impact: "Enhanced active agent dialing throughput by 30% while reducing manual post-call logging overhead.",
      classification: "SYSTEM_INTEGRATION // INSTALLED"
    },
    {
      id: "hw-modernization-analyst",
      nodeCode: "SYS_LOG_03",
      role: "Technical Modernization Analyst",
      company: "Hindustan Wellness Pvt. Ltd.",
      duration: "Nov 2025 - Present",
      location: "Gurugram, Haryana, India",
      status: "Operational Phase 1",
      focus: "Monolith Migration & Architectural Decoupling",
      overview: "Constructed deep technical audits and strategic transition patterns to migrate heavily coupled legacy ASP.NET WebForms monolith architectures toward modern decoupled environments.",
      responsibilities: [
        "Conducted granular technical reviews of historical legacy code-behind structures to identify hidden dependencies.",
        "Formulated modular structural mapping matrices to guide component-by-component frontend planning in Angular.",
        "Engineered secure shared hybrid state managers, enabling migrated layouts to coexist peacefully with older frameworks.",
        "Decoupled tangled business algorithms into isolated, easily testable C# service layers."
      ],
      technologies: ["ASP.NET WebForms", "Angular", "ASP.NET Core", "Dependency Mapping", "C#"],
      impact: "Secured a risk-free, phased migration path for complex workflows, guaranteeing zero operational downtime during transition phases.",
      classification: "SYSTEM_REFACTOR // PROGRESSIVE"
    },
    {
      id: "ddvm-trainee",
      nodeCode: "SYS_LOG_04",
      role: "Full-Stack Developer Trainee",
      company: "Draupadi Devi Vindhyanchal Mahavidyalaya",
      duration: "March 2025 - August 2025",
      location: "Gorakhpur, Uttar Pradesh, India",
      status: "Archive Success",
      focus: "Academic Portal Engineering & Security Systems",
      overview: "Constructed internal full-stack administration and grading portals, laying down robust relational schemas, security rules, and clean UI components for institutional workflow operations.",
      responsibilities: [
        "Built and styled modular, responsive educational grading grids and user profile fields using Angular.",
        "Designed secure token-based user authorization filters utilizing JSON Web Tokens (JWT) for multi-tiered academic access.",
        "Crafted and documented C# web services, maintaining strict input validation parameters.",
        "Successfully prepared, tested, and published web builds directly onto SmarterASP.NET cloud hosting environments."
      ],
      technologies: ["ASP.NET Core", "Angular", "SQL Server", "JWT Security", "SmarterASP.NET Hosting"],
      impact: "Delivered a centralized academic tracking portal, significantly reducing physical grade processing times and data discrepancies.",
      classification: "TRAINEE_LOG // COMPLETED"
    }
  ], []);

  // Monitor reduced motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // GSAP scroll animations
  useEffect(() => {
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      // Header fading and rising
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 35 },
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

      // Section Content
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 45 },
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

      // Timeline Vertical Line drawing down
      if (timelineLineRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.2,
            transformOrigin: "top center",
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isReducedMotion]);

  const activeLog = experienceLogs[activeIdx];

  const handleSelectNode = (idx: number) => {
    setActiveIdx(idx);
  };

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section
      ref={sectionRef}
      id="career-operations"
      className="relative w-full min-h-screen bg-[#020106] border-t border-white/5 py-[clamp(6rem,_10vh,_8rem)] px-[clamp(1.5rem,_4vw,_4rem)] overflow-hidden flex flex-col justify-between"
    >
      {/* Background ambient details */}
      <div className="absolute inset-0 cyber-grid opacity-[0.05] z-0 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-indigo-950/[0.04] rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-[#ff4d00]/[0.02] rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="relative w-full max-w-7xl mx-auto flex-grow flex flex-col justify-center">
        
        {/* SECTION HEADER */}
        <div ref={headerRef} className="w-full flex flex-col items-center select-none text-center mb-16 z-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#ff4d00] uppercase font-black">
            <Briefcase className="w-4 h-4" />
            <span>SYS_MODULE_04 // EXP_LOGS</span>
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight leading-tight text-white mt-2 uppercase">
            CAREER OPERATIONS LOG
          </h2>
          <div className="w-20 h-[2px] bg-[#ff4d00]/60 mt-3 rounded" />
          <p className="text-xs text-white/50 font-mono tracking-wider mt-2 uppercase">
            Professional Experience // Enterprise Systems // Production Workflows
          </p>
        </div>

        {/* WORKSPACE PANEL */}
        <div ref={contentRef} className="relative z-10 w-full">

          {/* ========================================================
              DESKTOP TWO-COLUMN INTERACTIVE TIMELINE (xl:grid)
              ======================================================== */}
          <div className="hidden xl:grid grid-cols-[400px_1fr] gap-12 items-start w-full min-h-[580px]">
            
            {/* LEFT COLUMN: Vertical Timeline Line & Interactive Nodes */}
            <div className="relative pl-8 pr-2">
              
              {/* Subtle Glowing Timeline vertical guide */}
              <div 
                ref={timelineLineRef}
                className="absolute left-1.5 top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#ff4d00]/80 via-white/10 to-transparent origin-top shadow-orange-glow-sm"
              />

              <div className="font-mono text-[9px] tracking-widest text-white/35 uppercase border-b border-white/10 pb-2 mb-6 flex items-center justify-between">
                <span>SYSTEM RECORDS</span>
                <span>[{experienceLogs.length}_ACTIVE_NODES]</span>
              </div>

              {/* Node List */}
              <div className="flex flex-col gap-6 relative">
                {experienceLogs.map((log, idx) => {
                  const isActive = activeIdx === idx;
                  const isHovered = hoveredIdx === idx;
                  
                  return (
                    <button
                      key={log.id}
                      onClick={() => handleSelectNode(idx)}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      aria-selected={isActive}
                      role="tab"
                      id={`exp-tab-${log.id}`}
                      aria-controls={`exp-panel-${log.id}`}
                      className="group relative text-left w-full pl-6 cursor-pointer outline-none"
                    >
                      {/* Interactive glowing connector node circle */}
                      <div className="absolute -left-[30.5px] top-1.5 w-3 h-3 rounded-full border bg-[#020106] transition-all duration-300 flex items-center justify-center z-10">
                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          isActive 
                            ? "bg-[#ff4d00] scale-125 shadow-orange-glow-sm" 
                            : isHovered 
                              ? "bg-[#ff4d00]/70" 
                              : "bg-white/20"
                        }`} />
                      </div>

                      {/* Active Border Glow Highlight box */}
                      <div className={`absolute inset-0 rounded-xl transition-all duration-300 -z-10 border ${
                        isActive 
                          ? "bg-[#ff4d00]/5 border-[#ff4d00]/40 shadow-orange-glow-sm" 
                          : "border-transparent group-hover:border-white/5 group-hover:bg-white/[0.01]"
                      }`} />

                      {/* Content representation */}
                      <div className="p-3">
                        <div className="flex items-center justify-between font-mono text-[8px] tracking-widest mb-1.5">
                          <span className={`font-black transition-colors ${isActive ? "text-[#ff4d00]" : "text-white/40 group-hover:text-white/60"}`}>
                            {log.nodeCode} // {log.duration.split(" - ")[1]}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded border transition-colors ${
                            isActive 
                              ? "border-[#ff4d00]/30 bg-[#ff4d00]/10 text-[#ff4d00]" 
                              : "border-white/5 bg-white/5 text-white/30"
                          }`}>
                            {log.duration.split(" - ")[0]}
                          </span>
                        </div>

                        <h3 className={`font-display font-black text-sm uppercase tracking-wide leading-tight transition-colors ${
                          isActive ? "text-white" : "text-white/70 group-hover:text-white"
                        }`}>
                          {log.role.split(" (")[0]}
                        </h3>

                        <p className="font-mono text-[9px] text-white/40 mt-1 uppercase tracking-wider group-hover:text-white/55 transition-colors">
                          {log.company}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* RIGHT COLUMN: Selected Experience Detail Panel */}
            <div className="relative min-h-[580px] bg-black/60 border border-white/10 rounded-2xl p-8 backdrop-blur-md flex flex-col justify-between overflow-hidden">
              
              {/* Cyber aesthetic corners */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff4d00]/40 to-transparent" />
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/20" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLog.id}
                  initial={isReducedMotion ? {} : { opacity: 0, x: 15 }}
                  animate={isReducedMotion ? {} : { opacity: 1, x: 0 }}
                  exit={isReducedMotion ? {} : { opacity: 0, x: -15 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  id={`exp-panel-${activeLog.id}`}
                  role="tabpanel"
                  aria-labelledby={`exp-tab-${activeLog.id}`}
                  className="w-full h-full flex flex-col justify-between flex-grow gap-6 text-left"
                >
                  
                  {/* Metadata Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 border border-[#ff4d00]/30 bg-[#ff4d00]/10 text-[#ff4d00] rounded-lg">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[8px] tracking-[0.25em] text-[#ff4d00] uppercase font-bold">
                          DEPLOYMENT_NODE // {activeLog.nodeCode}
                        </span>
                        <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
                          {activeLog.role}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[9px] tracking-wider shrink-0">
                      <div className="flex items-center gap-1.5 bg-[#ff4d00]/10 border border-[#ff4d00]/20 px-2.5 py-1 rounded text-[#ff4d00] uppercase font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{activeLog.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Company & Core Focus Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-[7px] text-white/40 uppercase tracking-widest font-black">
                        ENTERPRISE NODE
                      </span>
                      <span className="font-display font-extrabold text-sm text-white tracking-wide uppercase mt-0.5">
                        {activeLog.company}
                      </span>
                    </div>

                    {activeLog.location && (
                      <div className="flex flex-col sm:items-end">
                        <span className="font-mono text-[7px] text-white/40 uppercase tracking-widest font-black">
                          NODE PHYSICAL COORDS
                        </span>
                        <span className="font-sans text-xs text-white/70 font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#ff4d00] shrink-0" />
                          {activeLog.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Main Grid Detail Columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
                    
                    {/* Left details - Overview & Responsibilities */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                      
                      <div className="flex flex-col gap-1.5">
                        <span className="font-mono text-[8px] text-[#ff4d00] tracking-widest uppercase font-black">
                          NODE OVERVIEW
                        </span>
                        <p className="text-xs text-white/70 leading-relaxed font-sans font-medium">
                          {activeLog.overview}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="font-mono text-[8px] text-[#ff4d00] tracking-widest uppercase font-black">
                          SYSTEM_CORE_RESPONSIBILITIES
                        </span>
                        <ul className="flex flex-col gap-2.5">
                          {activeLog.responsibilities.map((resp, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2.5 text-[11px] text-white/75 leading-relaxed font-sans font-medium">
                              <CheckCircle2 className="w-4 h-4 text-[#ff4d00] shrink-0 mt-0.5" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                    {/* Right details - Tech Profile & Status */}
                    <div className="lg:col-span-5 flex flex-col gap-5">
                      
                      {/* Tech stack profile */}
                      <div className="flex flex-col gap-2">
                        <span className="font-mono text-[8px] text-[#ff4d00] tracking-widest uppercase font-black">
                          STACK PROFILE USED
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {activeLog.technologies.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="font-mono text-[9px] tracking-wider px-2 py-1 rounded border border-white/10 bg-white/5 text-white/85 font-semibold"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Operational Focus area */}
                      <div className="flex flex-col gap-2 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-1.5 font-mono text-[8px] text-[#ff4d00] tracking-widest font-black uppercase">
                          <Layers className="w-3.5 h-3.5" />
                          <span>OPERATIONAL FOCUS BLOCK</span>
                        </div>
                        <p className="text-[11px] text-white/60 leading-normal font-sans">
                          {activeLog.focus}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Impact bottom panel */}
                  <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 bg-[#ff4d00]/10 border border-[#ff4d00]/20 px-3 py-2 rounded-xl text-left w-full sm:w-auto">
                      <TrendingUp className="w-4 h-4 text-[#ff4d00] shrink-0" />
                      <div className="flex flex-col leading-none">
                        <span className="font-mono text-[8px] text-[#ff4d00] uppercase font-bold tracking-widest">
                          SYSTEM PERFORMANCE METRIC & IMPACT
                        </span>
                        <p className="text-[11px] text-white/85 font-medium mt-1">
                          {activeLog.impact}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[8px] text-white/30 tracking-widest select-none uppercase">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>LOG_RECORD_CLOSED // ID: {activeLog.id.toUpperCase()}</span>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* ========================================================
              MOBILE & TABLET STACKED TIMELINE ACCORDION (xl:hidden)
              ======================================================== */}
          <div className="xl:hidden flex flex-col gap-4 w-full max-w-4xl mx-auto">
            {experienceLogs.map((log, index) => {
              const isExpanded = expandedId === log.id;
              return (
                <div
                  key={log.id}
                  className={`border rounded-2xl bg-[#020106]/85 border-white/10 backdrop-blur-md overflow-hidden transition-all duration-300 ${
                    isExpanded ? "border-[#ff4d00]/40 shadow-orange-glow-sm" : ""
                  }`}
                >
                  {/* Accordion Trigger */}
                  <button
                    onClick={() => handleToggleExpand(log.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer outline-none"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg border transition-all ${
                        isExpanded 
                          ? "border-[#ff4d00]/30 bg-[#ff4d00]/10 text-[#ff4d00]" 
                          : "border-white/10 bg-white/5 text-white/50"
                      }`}>
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="font-mono text-[8px] text-[#ff4d00] tracking-widest uppercase font-bold">
                          {log.nodeCode} // {log.company.split(" ")[0]}
                        </span>
                        <h4 className="font-display font-black text-sm text-white uppercase mt-0.5 tracking-wide">
                          {log.role.split(" (")[0]}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline font-mono text-[8px] px-1.5 py-0.5 rounded border border-white/10 text-white/40">
                        {log.duration.split(" - ")[0]}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-white/50 transition-transform duration-300 ${isExpanded ? "rotate-90 text-[#ff4d00]" : ""}`} />
                    </div>
                  </button>

                  {/* Expanded block */}
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
                          
                          {/* Duration, Location, Status */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-white/5 pb-4 font-mono text-[9px] text-white/50">
                            <div>
                              <span className="text-white/30 uppercase block">DURATION</span>
                              <span className="text-white font-medium block mt-0.5">{log.duration}</span>
                            </div>
                            <div>
                              <span className="text-white/30 uppercase block">LOCATION</span>
                              <span className="text-white font-medium block mt-0.5">{log.location}</span>
                            </div>
                            <div>
                              <span className="text-white/30 uppercase block">STATUS FLAG</span>
                              <span className="text-[#ff4d00] font-bold block mt-0.5">{log.status}</span>
                            </div>
                          </div>

                          {/* Overview */}
                          <div className="flex flex-col gap-1.5">
                            <span className="font-mono text-[8px] text-[#ff4d00] tracking-widest uppercase font-black">
                              LOG OVERVIEW
                            </span>
                            <p className="text-xs text-white/70 leading-relaxed font-sans">
                              {log.overview}
                            </p>
                          </div>

                          {/* Responsibilities */}
                          <div className="flex flex-col gap-2">
                            <span className="font-mono text-[8px] text-[#ff4d00] tracking-widest uppercase font-black">
                              LOG_CORE_RESPONSIBILITIES
                            </span>
                            <ul className="flex flex-col gap-2">
                              {log.responsibilities.map((resp, rIdx) => (
                                <li key={rIdx} className="flex items-start gap-2 text-[10px] text-white/70 leading-relaxed font-sans">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#ff4d00] shrink-0 mt-0.5" />
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Technologies */}
                          <div className="flex flex-col gap-2">
                            <span className="font-mono text-[8px] text-[#ff4d00] tracking-widest uppercase font-black">
                              TECHNOLOGY STACK PROFILE
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {log.technologies.map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="font-mono text-[8px] tracking-wider px-2 py-0.5 rounded border border-white/5 bg-white/5 text-white/75"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Focus */}
                          <div className="border-l border-white/10 bg-white/[0.01] p-3 rounded-r-xl">
                            <span className="font-mono text-[8px] text-white/40 tracking-widest uppercase font-bold block mb-1">
                              OPERATIONAL FOCUS
                            </span>
                            <p className="text-[10px] text-white/60 leading-normal font-sans">
                              {log.focus}
                            </p>
                          </div>

                          {/* Impact metric */}
                          <div className="border-t border-white/5 pt-3">
                            <div className="flex items-start gap-2 bg-[#ff4d00]/10 border border-[#ff4d00]/20 p-2.5 rounded-lg">
                              <TrendingUp className="w-3.5 h-3.5 text-[#ff4d00] shrink-0 mt-0.5" />
                              <div className="flex flex-col leading-none">
                                <span className="font-mono text-[7px] text-[#ff4d00] uppercase font-bold tracking-widest">
                                  SYSTEM PERFORMANCE METRIC
                                </span>
                                <p className="text-[10px] text-white/80 font-medium mt-1 leading-snug">
                                  {log.impact}
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

      {/* FOOTER COGNITIVE STATUS */}
      <div className="relative w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between font-mono text-[9px] tracking-widest text-white/30 select-none z-10 pt-8 border-t border-white/5 mt-16">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#ff4d00] rounded-full animate-ping" />
          <span>CAREER OPERATIONS FEED COMPILER ONLINE // AUTH OK</span>
        </div>
        <div className="mt-2 sm:mt-0">
          NODE LOG V3.12_STABLE
        </div>
      </div>
    </section>
  );
}
