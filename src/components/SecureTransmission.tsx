import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  Terminal, 
  Mail, 
  MapPin, 
  Linkedin, 
  Github, 
  FileText,
  Activity,
  Cpu
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PERSONAL_INFO } from "../data";

gsap.registerPlugin(ScrollTrigger);

const contactSequenceConfig = {
  frameCount: 73,
  startFrame: 0,
  endFrame: 72,
  basePath: "/frames/contact-cta/",
  filename: (index: number) => `contact-cta_${String(index).padStart(4, "0")}.webp`,
  holdAfterProgress: 0.78
};

export default function SecureTransmission() {
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
  const [allFramesLoaded, setAllFramesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [shouldStartPreload, setShouldStartPreload] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const hasWebpRef = useRef(true);
  const currentFrameRef = useRef(0);

  // Smooth lerping refs
  const targetFrameRef = useRef<number>(0);
  const currentFrameLerpRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);

  // Content Refs for direct DOM style manipulation during scroll triggers
  const smallLabelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  // Monitor reduced motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Trigger preloading 2000px before the Contact section enters the viewport
  useEffect(() => {
    if (isReducedMotion) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top-=2000px top",
      once: true,
      onEnter: () => {
        setShouldStartPreload(true);
      }
    });

    return () => {
      trigger.kill();
    };
  }, [isReducedMotion]);

  // Helper to verify if an image is loaded
  const isFrameLoaded = (index: number): boolean => {
    const img = imagesRef.current[index];
    return !!(img && img.src && img.complete && img.naturalWidth > 0);
  };

  // Safe fallback to nearest loaded frame
  const getNearestLoadedFrameIndex = (targetIndex: number): number => {
    if (isFrameLoaded(targetIndex)) {
      return targetIndex;
    }
    const total = contactSequenceConfig.frameCount;
    // Search outward to find closest loaded frame
    for (let offset = 1; offset < total; offset++) {
      const prev = targetIndex - offset;
      const next = targetIndex + offset;
      if (prev >= 0 && isFrameLoaded(prev)) return prev;
      if (next < total && isFrameLoaded(next)) return next;
    }
    return 0;
  };

  // requestAnimationFrame render loop
  const startRenderLoop = () => {
    if (rafIdRef.current !== null) return;

    const loop = () => {
      const target = targetFrameRef.current;
      const current = currentFrameLerpRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.05) {
        currentFrameLerpRef.current = target;
        rafIdRef.current = null;
        const rounded = Math.round(target);
        if (rounded !== lastDrawnFrameRef.current) {
          lastDrawnFrameRef.current = rounded;
          triggerDraw(rounded);
        }
      } else {
        const lerpFactor = 0.22;
        currentFrameLerpRef.current = current + diff * lerpFactor;
        const rounded = Math.round(currentFrameLerpRef.current);
        if (rounded !== lastDrawnFrameRef.current) {
          lastDrawnFrameRef.current = rounded;
          triggerDraw(rounded);
        }
        rafIdRef.current = requestAnimationFrame(loop);
      }
    };

    rafIdRef.current = requestAnimationFrame(loop);
  };

  // Preload logic for frame sequence (staged loading)
  useEffect(() => {
    const total = contactSequenceConfig.frameCount;
    const images: HTMLImageElement[] = [];

    // Initialize the cache array with empty Image elements
    for (let i = 0; i < total; i++) {
      images.push(new Image());
    }
    imagesRef.current = images;

    // Load first frame immediately
    const firstImg = images[0];
    firstImg.src = `${contactSequenceConfig.basePath}${contactSequenceConfig.filename(0)}`;
    const handleFirstFrameOk = () => {
      setFirstFrameLoaded(true);
      triggerDraw(0);
    };

    if (firstImg.complete) {
      handleFirstFrameOk();
    } else {
      firstImg.onload = handleFirstFrameOk;
      firstImg.onerror = () => {
        // If frames fail to load, instantly swap to fallback vector graphics
        hasWebpRef.current = false;
        setFirstFrameLoaded(true);
        triggerDraw(0);
      };
    }

    // Only preload other frames if shouldStartPreload is true
    if (!shouldStartPreload) return;

    let loaded = 1;
    const handleFrameOk = () => {
      loaded++;
      setLoadedCount(loaded);
      if (loaded === total) {
        setAllFramesLoaded(true);
      }
    };

    for (let i = 1; i < total; i++) {
      const img = images[i];
      img.src = `${contactSequenceConfig.basePath}${contactSequenceConfig.filename(i)}`;
      if (img.complete) {
        handleFrameOk();
      } else {
        img.onload = handleFrameOk;
        img.onerror = handleFrameOk; // Ensure we don't break on a missing frame
      }
    }
  }, [shouldStartPreload]);

  // Draw character or fallback vector
  const triggerDraw = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Scale canvas to match screen high DPI (DPR) with mobile performance clamping
    const dpr = window.devicePixelRatio || 1;
    const isMobileDevice = window.innerWidth < 768;
    const cappedDpr = isMobileDevice ? Math.min(dpr, 1.5) : Math.min(dpr, 2);
    const targetW = width * cappedDpr;
    const targetH = height * cappedDpr;

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      ctx.scale(cappedDpr, cappedDpr);
    }

    const isMobile = window.innerWidth < 768;
    const objX = isMobile ? 0.72 : 0.5; // push crop towards right to keep avatar visible
    const objY = 0.5;

    const currentFrameIndex = Math.min(contactSequenceConfig.endFrame, Math.max(0, index));
    currentFrameRef.current = currentFrameIndex;

    const loadedIndex = getNearestLoadedFrameIndex(currentFrameIndex);
    const img = imagesRef.current[loadedIndex];

    if (!hasWebpRef.current || !img || !img.complete || img.naturalWidth === 0) {
      drawFallbackVector(ctx, currentFrameIndex, width, height, isMobile);
    } else {
      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;
      const scale = Math.max(width / imgW, height / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;

      const x = (width - drawW) * objX;
      const y = (height - drawH) * objY;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, x, y, drawW, drawH);
    }
  };

  // High fidelity vector fallback illustration
  const drawFallbackVector = (
    ctx: CanvasRenderingContext2D,
    index: number,
    width: number,
    height: number,
    isMobile: boolean
  ) => {
    // Backdrop fill
    ctx.fillStyle = "#020106";
    ctx.fillRect(0, 0, width, height);

    // Timeline Progress percentage
    const t = index / 72;

    // Abstract Background Grid
    ctx.strokeStyle = "rgba(255, 77, 0, 0.02)";
    ctx.lineWidth = 1;
    const gridSize = 64;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Avatar center coordinates (Shifted right based on layout specifications)
    const centerX = isMobile ? width * 0.72 : width * 0.75;
    const centerY = height * 0.5;
    const baseScale = isMobile ? 0.65 : 0.95;

    // Soft surrounding amber glow
    const glowRadius = isMobile ? 120 : 180;
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 5 * baseScale,
      centerX, centerY, glowRadius * baseScale
    );
    gradient.addColorStop(0, "rgba(255, 77, 0, 0.16)");
    gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.04)");
    gradient.addColorStop(1, "rgba(2, 1, 6, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, glowRadius * baseScale, 0, Math.PI * 2);
    ctx.fill();

    // Begin character styling drawing
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(baseScale, baseScale);

    // Decorative target tracking reticle
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 150, 0, Math.PI * 2);
    ctx.stroke();

    // Reticle edge coordinates
    ctx.strokeStyle = "rgba(255, 77, 0, 0.25)";
    ctx.beginPath();
    ctx.arc(0, 0, 160, -0.3, 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 160, Math.PI - 0.3, Math.PI + 0.3);
    ctx.stroke();

    // Character body shoulders outline
    ctx.beginPath();
    ctx.moveTo(-150, 200);
    ctx.quadraticCurveTo(-140, 100, -70, 85);
    ctx.lineTo(70, 85);
    ctx.quadraticCurveTo(140, 100, 150, 200);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Head Outline and neck
    ctx.beginPath();
    ctx.moveTo(-28, 85);
    ctx.lineTo(-28, 45);
    ctx.lineTo(-48, 20);
    ctx.quadraticCurveTo(-58, -45, 0, -75);
    ctx.quadraticCurveTo(60, -45, 48, 20);
    ctx.lineTo(28, 45);
    ctx.lineTo(28, 85);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Hair swept-up quiff (Glowing orange edge)
    ctx.beginPath();
    ctx.moveTo(-52, -40);
    ctx.bezierCurveTo(-80, -100, -12, -125, 20, -112);
    ctx.bezierCurveTo(48, -100, 72, -72, 52, -50);
    ctx.quadraticCurveTo(0, -60, -52, -40);
    ctx.closePath();
    ctx.fillStyle = "rgba(255, 77, 0, 0.18)";
    ctx.fill();
    ctx.strokeStyle = "#ff4d00";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#ff4d00";
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Glowing cyan spectacles
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 8;
    // Bridge
    ctx.beginPath();
    ctx.moveTo(-9, -12);
    ctx.lineTo(9, -12);
    ctx.stroke();
    // Left lens frame
    ctx.strokeRect(-38, -22, 26, 17);
    // Right lens frame
    ctx.strokeRect(12, -22, 26, 17);
    ctx.shadowBlur = 0;

    // Beard Stubble Outline
    ctx.beginPath();
    ctx.moveTo(-48, -2);
    ctx.lineTo(-38, 22);
    ctx.lineTo(-16, 36);
    ctx.lineTo(0, 39);
    ctx.lineTo(16, 36);
    ctx.lineTo(38, 22);
    ctx.lineTo(48, -2);
    ctx.strokeStyle = "rgba(255, 77, 0, 0.45)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // High fidelity thumbs up orb gesture representing a friendly welcoming handshake
    ctx.beginPath();
    ctx.arc(80, 80, 16, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 77, 0, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "#ff4d00";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(80, 80, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#ff4d00";
    ctx.fill();

    ctx.restore();

    // Status telemetry
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.font = "bold 8px monospace";
    ctx.fillText(`SYS_RENDER_STREAM: F_${String(index).padStart(4, "0")} / 0072`, centerX - 85 * baseScale, centerY + 180 * baseScale);
  };

  // Re-draw on resizing and initial preloads
  useEffect(() => {
    const handleResize = () => {
      triggerDraw(currentFrameRef.current);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    triggerDraw(isReducedMotion ? 72 : 0);
  }, [firstFrameLoaded, isReducedMotion]);

  // Setup GSAP ScrollTrigger sequence
  useEffect(() => {
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      ScrollTrigger.create({
        id: "contact-sequence",
        trigger: sectionRef.current,
        start: "top top",
        end: isMobile ? "+=1100" : "+=1500",
        scrub: 0.25,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Calculate frame based on custom layout parameters
          const playableProgress = Math.min(progress / contactSequenceConfig.holdAfterProgress, 1);
          const frameIndex = Math.round(playableProgress * 72);
          
          targetFrameRef.current = frameIndex;
          startRenderLoop();

          // Calculate elements visibility threshold maps
          const opacityLabel = Math.max(0, Math.min(1, progress / 0.12));
          const yLabel = 15 * (1 - opacityLabel);

          const opacityHeading = Math.max(0, Math.min(1, (progress - 0.12) / (0.28 - 0.12)));
          const yHeading = 15 * (1 - opacityHeading);

          const opacityDesc = Math.max(0, Math.min(1, (progress - 0.28) / (0.45 - 0.28)));
          const yDesc = 15 * (1 - opacityDesc);

          const opacityActions = Math.max(0, Math.min(1, (progress - 0.45) / (0.62 - 0.45)));
          const yActions = 15 * (1 - opacityActions);

          const opacityMeta = Math.max(0, Math.min(1, (progress - 0.62) / (0.80 - 0.62)));
          const yMeta = 15 * (1 - opacityMeta);

          // Apply transformations directly bypass React render state checks (100% frame rate performance)
          if (smallLabelRef.current) {
            smallLabelRef.current.style.opacity = String(opacityLabel);
            smallLabelRef.current.style.transform = `translateY(${yLabel}px)`;
          }
          if (headingRef.current) {
            headingRef.current.style.opacity = String(opacityHeading);
            headingRef.current.style.transform = `translateY(${yHeading}px)`;
          }
          if (descriptionRef.current) {
            descriptionRef.current.style.opacity = String(opacityDesc);
            descriptionRef.current.style.transform = `translateY(${yDesc}px)`;
          }
          if (actionsRef.current) {
            actionsRef.current.style.opacity = String(opacityActions);
            actionsRef.current.style.transform = `translateY(${yActions}px)`;
          }
          if (metaRef.current) {
            metaRef.current.style.opacity = String(opacityMeta);
            metaRef.current.style.transform = `translateY(${yMeta}px)`;
          }
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [isReducedMotion, firstFrameLoaded]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full h-screen bg-[#020106] border-t border-white/5 overflow-hidden flex flex-col justify-center"
    >
      {/* 1. Cinematic Background Frame Sequence Canvas */}
      <canvas
        ref={canvasRef}
        id="contact-sequence-canvas"
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      {/* 2. Responsive Readability Gradient Overlays */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 block md:hidden"
        style={{
          background: "linear-gradient(0deg, rgba(2,1,6,0.98) 0%, rgba(2,1,6,0.85) 45%, rgba(2,1,6,0.3) 75%, transparent 100%)"
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none z-10 hidden md:block"
        style={{
          background: "linear-gradient(90deg, rgba(2,1,6,0.96) 0%, rgba(2,1,6,0.72) 28%, rgba(2,1,6,0.28) 52%, transparent 76%)"
        }}
      />

      {/* 3. Direct Contact Content Column positioned safely on the left */}
      <div 
        className="absolute left-[clamp(1.25rem,_3vw,_1.25rem)] md:left-[clamp(3rem,_7vw,_8rem)] right-[1.25rem] md:right-auto top-auto md:top-1/2 bottom-[clamp(2.5rem,_6vh,_4.5rem)] md:bottom-auto -translate-y-0 md:-translate-y-1/2 w-auto md:w-[min(42vw,_560px)] z-30 flex flex-col gap-6"
      >
        {/* Small Label */}
        <div 
          ref={smallLabelRef} 
          style={{ 
            opacity: isReducedMotion ? 1 : 0, 
            transform: isReducedMotion ? "none" : "translateY(15px)",
            transition: isReducedMotion ? "none" : "opacity 0.2s ease, transform 0.2s ease"
          }}
          className="flex items-center gap-2 font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-[#ff4d00] uppercase font-black"
        >
          <Terminal className="w-4 h-4 text-[#ff4d00]" />
          <span>SECURE TRANSMISSION // CONTACT NODE</span>
        </div>

        {/* Header Title */}
        <h2 
          ref={headingRef} 
          style={{ 
            opacity: isReducedMotion ? 1 : 0, 
            transform: isReducedMotion ? "none" : "translateY(15px)",
            transition: isReducedMotion ? "none" : "opacity 0.2s ease, transform 0.2s ease"
          }}
          className="font-display font-black text-2xl md:text-4xl lg:text-5xl tracking-tight leading-tight text-white uppercase select-none"
        >
          Let’s Build
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d00] to-purple-400">
            Enterprise-Grade
          </span>
          <br />
          Web Systems
        </h2>

        {/* Description */}
        <p 
          ref={descriptionRef} 
          style={{ 
            opacity: isReducedMotion ? 1 : 0, 
            transform: isReducedMotion ? "none" : "translateY(15px)",
            transition: isReducedMotion ? "none" : "opacity 0.2s ease, transform 0.2s ease"
          }}
          className="text-xs md:text-sm text-white/70 leading-relaxed font-sans font-medium"
        >
          Ready to collaborate on scalable CRM workflows, high-performance frontend interfaces, and production-ready web platforms.
        </p>

        {/* Primary CTA Action buttons */}
        <div 
          ref={actionsRef} 
          style={{ 
            opacity: isReducedMotion ? 1 : 0, 
            transform: isReducedMotion ? "none" : "translateY(15px)",
            transition: isReducedMotion ? "none" : "opacity 0.2s ease, transform 0.2s ease"
          }}
          className="flex flex-col sm:flex-row gap-4 w-full"
        >
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="flex-1 flex items-center justify-center gap-2 bg-[#ff4d00] hover:bg-[#ff4d00]/90 active:scale-95 text-white font-mono text-[10px] md:text-xs uppercase tracking-widest py-3.5 px-6 rounded-xl border border-transparent shadow-orange-glow transition-all font-black text-center cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>EMAIL ME</span>
          </a>
          <a
            href={PERSONAL_INFO.resumeUrl !== "#" ? PERSONAL_INFO.resumeUrl : "#"}
            onClick={(e) => {
              if (PERSONAL_INFO.resumeUrl === "#") {
                e.preventDefault();
                alert("Opening Resume Link: ASP.NET & Angular Operations. System ready.");
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-[#ff4d00]/30 hover:bg-white/10 active:scale-95 text-white/90 hover:text-white font-mono text-[10px] md:text-xs uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all font-black text-center cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#ff4d00]" />
            <span>DOWNLOAD RESUME</span>
          </a>
        </div>

        {/* Secondary Links & Technical metadata */}
        <div 
          ref={metaRef} 
          style={{ 
            opacity: isReducedMotion ? 1 : 0, 
            transform: isReducedMotion ? "none" : "translateY(15px)",
            transition: isReducedMotion ? "none" : "opacity 0.2s ease, transform 0.2s ease"
          }}
          className="w-full space-y-4 pt-4 border-t border-white/5"
        >
          {/* Secondary Links */}
          <div className="flex gap-3">
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/[0.02] border border-white/5 hover:border-[#ff4d00]/30 hover:bg-white/5 rounded-lg text-white/50 hover:text-[#ff4d00] transition-colors font-mono text-[9px] tracking-widest font-bold cursor-pointer"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LINKEDIN</span>
            </a>
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors font-mono text-[9px] tracking-widest font-bold cursor-pointer"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GITHUB</span>
            </a>
          </div>

          {/* Technical Metadata Panel */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-3 space-y-1.5 text-left font-mono text-[8px] md:text-[9px] tracking-wider text-white/45">
            <div className="flex items-center justify-between">
              <span className="uppercase text-white/30 font-bold">NODE LOCATION:</span>
              <span className="text-white/85 font-black flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#ff4d00]" />
                {PERSONAL_INFO.location}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="uppercase text-white/30 font-bold">CORE FOCUS STACK:</span>
              <span className="text-white/85 font-black">ANGULAR // .NET CORE // SQL SERVER</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="uppercase text-white/30 font-bold">OPERATIONAL STATUS:</span>
              <span className="text-[#ff4d00] font-black flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 bg-[#ff4d00] rounded-full animate-pulse" />
                ACTIVE FOR OPPORTUNITIES
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Telemetry Bottom status flag */}
      <div className="absolute bottom-4 right-4 z-20 font-mono text-[8px] text-white/20 tracking-widest pointer-events-none select-none uppercase">
        X_TRANSMIT_GRID: COMPLETE // STABLE
      </div>
    </section>
  );
}
