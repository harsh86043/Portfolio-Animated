import React, { useState } from "react";
import { PERSONAL_INFO } from "../data";
import { Terminal, Send, Mail, MapPin, Phone, Github, Linkedin, CheckCircle, Wifi } from "lucide-react";
import gsap from "gsap";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");
  const [statusLogs, setStatusLogs] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormState("submitting");
    setStatusLogs(["INITIATING SECURE BROADCAST...", "ESTABLISHING UDP CORES...", "ENCRYPTING COMPONENT STRUCTS (AES-256)..."]);

    // Simulated staggered logs
    setTimeout(() => {
      setStatusLogs((prev) => [...prev, "ROUTING VIA DEV CLOUD RUN CONTAINER...", "HANDSHAKE GRANTED."]);
    }, 800);

    setTimeout(() => {
      setStatusLogs((prev) => [...prev, "PACKET DISPATCHED SUCCESSFULLY."]);
      setFormState("success");
      setFormData({ name: "", email: "", message: "" });
    }, 1800);
  };

  return (
    <section
      id="contact-section"
      className="relative w-full min-h-screen flex items-center justify-center py-24 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Background visual elements */}
      <div className="absolute inset-0 cyber-grid opacity-[0.15] z-0" />
      <div className="absolute top-1/4 left-10 w-[300px] h-[300px] bg-purple-900/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-red-950/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Grid wrapper */}
      <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Column: Contact terminal */}
        <div className="lg:col-span-7 flex flex-col items-start gap-8 select-none text-left w-full">
          
          {/* Section Marker */}
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#ff4d00] uppercase font-black">
            <Terminal className="w-4 h-4" />
            <span>CONNECT // PORT_OUTBOUND_HS</span>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-1">
            <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none text-white">
              DISPATCH A
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d00] to-purple-400">
                TRANSMISSION
              </span>
            </h2>
            <p className="text-xs md:text-sm text-white/50 tracking-wider font-mono uppercase mt-1">
              Establish peer-to-peer visual channels or contracts
            </p>
          </div>

          {/* Contact Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
            
            {/* Direct Node Info Nodes (md:col-span-5) */}
            <div className="md:col-span-5 flex flex-col gap-4">
              
              {/* Mail Node */}
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="group flex flex-col p-4 bg-white/5 border border-white/10 hover:border-[#ff4d00]/30 rounded-xl clip-cyber-corner-sm transition-all hover:shadow-orange-glow backdrop-blur-md"
              >
                <div className="flex items-center gap-2 text-white/50 group-hover:text-[#ff4d00] transition-colors font-mono text-[9px] uppercase tracking-wider font-bold">
                  <Mail className="w-3.5 h-3.5 text-[#ff4d00]" />
                  <span>SECURE_MAIL_NODE</span>
                </div>
                <span className="font-mono text-xs text-white/80 group-hover:text-white mt-1 break-all truncate">
                  {PERSONAL_INFO.email}
                </span>
              </a>

              {/* Phone Node */}
              <a
                href={`tel:${PERSONAL_INFO.phone}`}
                className="group flex flex-col p-4 bg-white/5 border border-white/10 hover:border-[#ff4d00]/30 rounded-xl clip-cyber-corner-sm transition-all hover:shadow-orange-glow backdrop-blur-md"
              >
                <div className="flex items-center gap-2 text-white/50 group-hover:text-[#ff4d00] transition-colors font-mono text-[9px] uppercase tracking-wider font-bold">
                  <Phone className="w-3.5 h-3.5 text-[#ff4d00]" />
                  <span>VOIP_PHONE_NODE</span>
                </div>
                <span className="font-mono text-xs text-white/80 group-hover:text-white mt-1">
                  {PERSONAL_INFO.phone}
                </span>
              </a>

              {/* Location Node */}
              <div className="group flex flex-col p-4 bg-white/5 border border-white/10 rounded-xl clip-cyber-corner-sm backdrop-blur-md">
                <div className="flex items-center gap-2 text-white/40 font-mono text-[9px] uppercase tracking-wider font-bold">
                  <MapPin className="w-3.5 h-3.5 text-[#ff4d00]" />
                  <span>GEO_COORDINATE_GRID</span>
                </div>
                <span className="font-mono text-xs text-white/70 mt-1">
                  {PERSONAL_INFO.location}
                </span>
              </div>

              {/* Social Channels Link Grid */}
              <div className="grid grid-cols-2 gap-3 mt-1">
                {/* Github */}
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-lg text-white/70 hover:text-white transition-all font-mono text-[10px] tracking-wider"
                >
                  <Github className="w-4 h-4 text-white/50 group-hover:text-white" />
                  <span>GITHUB</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-lg text-white/70 hover:text-white transition-all font-mono text-[10px] tracking-wider"
                >
                  <Linkedin className="w-4 h-4 text-white/50 group-hover:text-[#ff4d00]" />
                  <span>LINKEDIN</span>
                </a>
              </div>
            </div>

            {/* Interactive Form Terminal (md:col-span-7) */}
            <div className="md:col-span-7 bg-white/5 border border-white/10 p-5 rounded-xl clip-cyber-corner relative backdrop-blur-md">
              <div className="absolute top-0 right-4 flex items-center gap-1 bg-white/5 border-x border-b border-white/10 px-2 py-0.5 rounded-b font-mono text-[8px] text-[#ff4d00] font-bold uppercase">
                <Wifi className="w-2.5 h-2.5 animate-pulse text-[#ff4d00]" />
                <span>ONLINE_SEC_OUT</span>
              </div>

              {formState !== "success" ? (
                <form onSubmit={handleTerminalSubmit} className="space-y-4">
                  {/* Name field */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">
                      SENDER_IDENTIFIER // NAME
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. AGENT CARTER"
                      disabled={formState === "submitting"}
                      className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#ff4d00]/50 focus:ring-1 focus:ring-[#ff4d00]/20 outline-none rounded p-2.5 font-mono text-xs text-white transition-all"
                    />
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">
                      RETURN_ROUTING // EMAIL
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. carter@agent.sys"
                      disabled={formState === "submitting"}
                      className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#ff4d00]/50 focus:ring-1 focus:ring-[#ff4d00]/20 outline-none rounded p-2.5 font-mono text-xs text-white transition-all"
                    />
                  </div>

                  {/* Message field */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="font-mono text-[9px] text-white/40 tracking-widest uppercase font-bold">
                      DATA_PACKET_PAYLOAD // MESSAGE
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="ENTER DETAILED TRANSMISSION HERE..."
                      disabled={formState === "submitting"}
                      className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#ff4d00]/50 focus:ring-1 focus:ring-[#ff4d00]/20 outline-none rounded p-2.5 font-mono text-xs text-white resize-none transition-all"
                    />
                  </div>

                  {/* Console Action Logs */}
                  {statusLogs.length > 0 && (
                    <div className="bg-black/60 border border-white/5 rounded p-2.5 h-[65px] overflow-y-auto font-mono text-[8px] text-[#ff4d00] space-y-1">
                      {statusLogs.map((log, li) => (
                        <div key={li} className="flex items-center gap-1.5 leading-none">
                          <span className="text-white/30">&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dispatch Button */}
                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff4d00] to-purple-600 hover:brightness-110 active:scale-98 text-white font-mono text-xs uppercase tracking-widest py-3 clip-cyber-corner-sm cursor-pointer shadow-orange-glow transition-all"
                  >
                    <span>{formState === "submitting" ? "DISPATCHING..." : "DISPATCH BROADCAST"}</span>
                    <Send className={`w-3.5 h-3.5 ${formState === "submitting" ? "animate-ping" : ""}`} />
                  </button>
                </form>
              ) : (
                /* Success screen */
                <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                  <div className="p-3 bg-[#ff4d00]/10 border border-[#ff4d00]/30 rounded-full animate-bounce">
                    <CheckCircle className="w-8 h-8 text-[#ff4d00] shadow-orange-glow" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-mono text-sm text-white uppercase tracking-widest font-black">
                      TRANSMISSION LINK SECURED
                    </h3>
                    <p className="font-mono text-[10px] text-white/50 max-w-xs leading-relaxed">
                      Your encrypted packet has successfully broadcasted. Harsh's terminal receiver is alerting. Connection established.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFormState("idle");
                      setStatusLogs([]);
                    }}
                    className="mt-2 font-mono text-[9px] tracking-widest text-[#ff4d00] uppercase border border-[#ff4d00]/30 hover:bg-[#ff4d00]/5 px-4 py-2 rounded transition-colors cursor-pointer"
                  >
                    DISPATCH ANOTHER BLOCK
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: HUD telemetry scope overlaying the background avatar */}
        <div className="lg:col-span-5 h-[350px] lg:h-[450px] flex items-center justify-center relative select-none">
          <div className="absolute inset-0 border border-white/5 bg-white/[0.02] rounded-[40px] clip-cyber-corner flex items-center justify-center backdrop-blur-[2px]">
            {/* Ambient HUD layout */}
            <div className="absolute top-6 left-6 text-[9px] font-mono text-amber-500 tracking-widest uppercase flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              <span>COMM_DECK_F // STANDBY</span>
            </div>
            <div className="absolute bottom-6 right-6 text-[9px] font-mono text-white/40 tracking-widest">
              X_END: SEQUENCE_COMPLETE
            </div>

            {/* Geometric targeting scopes */}
            <div className="w-40 h-40 border border-white/5 relative flex items-center justify-center">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/20" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/20" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20" />
              <span className="font-mono text-[8px] text-white/30 tracking-[0.2em] uppercase font-bold">GRID LINKED</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
