import React from "react";
import { EXPERIENCE } from "../data";
import { Briefcase, Calendar, ChevronRight, Award } from "lucide-react";

export default function Experience() {
  return (
    <section
      id="experience-section"
      className="relative w-full min-h-screen flex items-center justify-center py-24 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Ambient background glow effects */}
      <div className="absolute inset-0 cyber-grid opacity-[0.15] z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-purple-950/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-red-950/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid container */}
      <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Column: HUD telemetry scope overlaying the background avatar */}
        <div className="order-2 lg:order-1 lg:col-span-5 h-[350px] lg:h-[450px] flex items-center justify-center relative select-none">
          <div className="absolute inset-0 border border-white/5 bg-white/[0.02] rounded-[40px] clip-cyber-corner flex items-center justify-center backdrop-blur-[2px]">
            {/* Ambient HUD labels */}
            <div className="absolute top-6 left-6 text-[9px] font-mono text-purple-400 tracking-widest uppercase flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
              <span>TIME_DECK_E // ACTIVE</span>
            </div>
            <div className="absolute bottom-6 right-6 text-[9px] font-mono text-white/40 tracking-widest">
              X_SEQ: ACTIVE
            </div>

            {/* Rotating wireframe rings */}
            <div className="w-40 h-40 border border-white/5 rounded-full flex items-center justify-center animate-[spin_50s_linear_infinite]">
              <div className="w-28 h-28 border border-white/5 rounded-lg rotate-45" />
            </div>

            {/* Target brackets */}
            <div className="absolute top-10 right-10 w-3 h-3 border-t-2 border-r-2 border-purple-500/30 rounded-tr" />
            <div className="absolute bottom-10 left-10 w-3 h-3 border-b-2 border-l-2 border-purple-500/30 rounded-bl" />
          </div>
        </div>

        {/* Right Column: Timeline details (Right side) */}
        <div className="order-1 lg:order-2 lg:col-span-7 flex flex-col items-start gap-8 select-none text-left">
          
          {/* Section Marker */}
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#ff4d00] uppercase font-black">
            <Briefcase className="w-4 h-4" />
            <span>TIMELINE // CAREER_RECORDS_HS</span>
          </div>

          {/* Section Heading */}
          <div className="flex flex-col gap-1">
            <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none text-white">
              PROFESSIONAL
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d00] via-purple-500 to-indigo-500">
                CHRONOLOGY
              </span>
            </h2>
            <p className="text-xs md:text-sm text-white/50 tracking-wider font-mono uppercase mt-1">
              Archived career logs and milestone checkpoints
            </p>
          </div>

          {/* Timeline Stack */}
          <div className="relative border-l border-white/10 ml-4 pl-8 space-y-12 w-full">
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="relative group select-none">
                
                {/* Timeline Dot with pulsing neon active indicator */}
                <div className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full border border-white/20 bg-cyber-dark flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${i === 0 ? "bg-[#ff4d00] animate-pulse" : "bg-white/30 group-hover:bg-[#ff4d00]"}`} />
                </div>

                {/* Main Card */}
                <div className="bg-white/5 border border-white/10 hover:border-[#ff4d00]/30 hover:bg-white/10 p-6 rounded-2xl clip-cyber-corner-sm transition-all duration-300 shadow-sm hover:shadow-orange-glow backdrop-blur-md">
                  
                  {/* Card Header (Role & Company) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div className="flex flex-col">
                      <h3 className="font-display font-bold text-lg md:text-xl text-white tracking-wide">
                        {exp.role}
                      </h3>
                      <span className="font-mono text-xs text-[#ff4d00] uppercase tracking-widest font-bold">
                        {exp.company}
                      </span>
                    </div>

                    {/* Date badge */}
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/70 font-mono text-[10px] w-fit">
                      <Calendar className="w-3.5 h-3.5 text-white/40" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Core Responsibilities */}
                  <div className="space-y-2 mb-4">
                    {exp.description.map((desc, di) => (
                      <p key={di} className="text-xs md:text-sm text-white/75 font-sans leading-relaxed font-medium">
                        {desc}
                      </p>
                    ))}
                  </div>

                  {/* Key Achievements/Metrics */}
                  <div className="border-t border-white/5 pt-4">
                    <h4 className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-purple-400" />
                      <span>KEY MILESTONES</span>
                    </h4>
                    <ul className="space-y-2 pl-1">
                      {exp.achievements.map((ach, ai) => (
                        <li key={ai} className="flex items-start gap-2 text-xs text-white/60 font-sans leading-relaxed">
                          <ChevronRight className="w-3.5 h-3.5 text-[#ff4d00] mt-0.5 shrink-0" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
