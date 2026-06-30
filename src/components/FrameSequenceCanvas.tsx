import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";

export interface FrameSequenceCanvasRef {
  drawFrame: (index: number) => void;
  isLoaded: boolean;
}

interface FrameSequenceCanvasProps {
  onFirstFrameLoaded?: () => void;
  onAllFramesLoaded?: () => void;
  totalFrames?: number;
}

const FrameSequenceCanvas = forwardRef<FrameSequenceCanvasRef, FrameSequenceCanvasProps>((props, ref) => {
  const { onFirstFrameLoaded, onAllFramesLoaded, totalFrames = 97 } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [firstFrameLoadedState, setFirstFrameLoadedState] = useState(false);
  const hasWebpImagesRef = useRef<boolean>(true);

  // Smooth lerping refs
  const targetFrameRef = useRef<number>(1);
  const currentFrameRef = useRef<number>(1);
  const lastDrawnFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);

  // Helper to verify if an image is loaded
  const isFrameLoaded = (index: number): boolean => {
    const img = imagesRef.current[index - 1];
    return !!(img && img.complete && img.naturalWidth > 0);
  };

  // Safe fallback to nearest loaded frame
  const getNearestLoadedFrameIndex = (targetIndex: number): number => {
    if (isFrameLoaded(targetIndex)) {
      return targetIndex;
    }
    // Search outward to find closest loaded frame
    for (let offset = 1; offset < totalFrames; offset++) {
      const prev = targetIndex - offset;
      const next = targetIndex + offset;
      if (prev >= 1 && isFrameLoaded(prev)) return prev;
      if (next <= totalFrames && isFrameLoaded(next)) return next;
    }
    return 1;
  };

  // requestAnimationFrame render loop
  const startRenderLoop = () => {
    if (rafIdRef.current !== null) return;

    const loop = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.05) {
        currentFrameRef.current = target;
        rafIdRef.current = null;
        const rounded = Math.round(target);
        if (rounded !== lastDrawnFrameRef.current) {
          lastDrawnFrameRef.current = rounded;
          renderFrame(rounded);
        }
      } else {
        // Suggested lerp factor: 0.18 to 0.32
        const lerpFactor = 0.22;
        currentFrameRef.current = current + diff * lerpFactor;
        const rounded = Math.round(currentFrameRef.current);
        if (rounded !== lastDrawnFrameRef.current) {
          lastDrawnFrameRef.current = rounded;
          renderFrame(rounded);
        }
        rafIdRef.current = requestAnimationFrame(loop);
      }
    };

    rafIdRef.current = requestAnimationFrame(loop);
  };

  // Expose drawFrame to parent
  useImperativeHandle(ref, () => ({
    drawFrame: (index: number) => {
      const boundedIndex = Math.min(totalFrames, Math.max(1, index));
      targetFrameRef.current = boundedIndex;
      startRenderLoop();
    },
    isLoaded: firstFrameLoadedState
  }));

  const drawFallbackVector = (ctx: CanvasRenderingContext2D, index: number, width: number, height: number) => {
    // Clear canvas
    ctx.fillStyle = "#04020a";
    ctx.fillRect(0, 0, width, height);

    // Calculate progress t
    const t = (index - 1) / (totalFrames - 1);

    // Draw Cyber Grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    const gridSize = 60;
    
    // Vertical gridlines
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    // Horizontal gridlines
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Coordinates for character
    // Desktop: center to left (28% of width)
    // Mobile/Tablet: center to slightly left (40% of width)
    const centerX = width >= 1024 
      ? (width / 2) * (1 - t) + (width * 0.28) * t 
      : (width / 2) * (1 - t) + (width * 0.40) * t;
    
    const centerY = height * 0.48;
    const baseScale = width >= 768 ? 1.0 : 0.7;

    // Draw Ambient orange glowing core behind the avatar
    const gradient = ctx.createRadialGradient(centerX, centerY, 20 * baseScale, centerX, centerY, 240 * baseScale);
    gradient.addColorStop(0, "rgba(255, 77, 0, 0.12)");
    gradient.addColorStop(0.5, "rgba(168, 85, 247, 0.04)");
    gradient.addColorStop(1, "rgba(4, 2, 10, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 240 * baseScale, 0, Math.PI * 2);
    ctx.fill();

    // Draw Silhouette (Head, Hair, Spectacles, Beard)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(baseScale, baseScale);

    // 1. Shoulders
    ctx.beginPath();
    ctx.moveTo(-160, 240);
    ctx.quadraticCurveTo(-150, 140, -80, 120);
    ctx.lineTo(80, 120);
    ctx.quadraticCurveTo(150, 140, 160, 240);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // 2. Head & Neck
    ctx.beginPath();
    // Neck
    ctx.moveTo(-35, 120);
    ctx.lineTo(-35, 70);
    // Jaw & Head
    ctx.lineTo(-55, 45);
    ctx.quadraticCurveTo(-65, -30, 0, -65);
    ctx.quadraticCurveTo(65, -30, 55, 45);
    ctx.lineTo(35, 70);
    ctx.lineTo(35, 120);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 3. Quiff Hair (Neon Orange Glow)
    ctx.beginPath();
    ctx.moveTo(-60, -25);
    ctx.bezierCurveTo(-90, -90, -20, -115, 15, -100);
    ctx.bezierCurveTo(45, -90, 75, -60, 60, -35);
    ctx.bezierCurveTo(70, -30, 65, -15, 55, -15);
    ctx.quadraticCurveTo(0, -45, -60, -25);
    ctx.closePath();
    ctx.fillStyle = "rgba(255, 77, 0, 0.25)";
    ctx.fill();
    ctx.strokeStyle = "#ff4d00";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#ff4d00";
    ctx.shadowBlur = 15;
    ctx.stroke();
    // Reset shadow
    ctx.shadowBlur = 0;

    // 4. Beard Outline (Dark Stubble Styling)
    ctx.beginPath();
    ctx.moveTo(-55, 25);
    ctx.lineTo(-45, 50);
    ctx.lineTo(-20, 65);
    ctx.lineTo(0, 70);
    ctx.lineTo(20, 65);
    ctx.lineTo(45, 50);
    ctx.lineTo(55, 25);
    ctx.strokeStyle = "rgba(255, 77, 0, 0.45)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 5. Rectangular Spectacles (Glowing Cyan)
    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#06b6d4";
    ctx.shadowBlur = 10;
    
    // Bridge
    ctx.beginPath();
    ctx.moveTo(-12, 10);
    ctx.lineTo(12, 10);
    ctx.stroke();
    
    // Left Frame
    ctx.strokeRect(-45, -2, 33, 20);
    // Right Frame
    ctx.strokeRect(12, -2, 33, 20);
    
    // Arms
    ctx.beginPath();
    ctx.moveTo(-45, 5);
    ctx.lineTo(-58, 2);
    ctx.moveTo(45, 5);
    ctx.lineTo(58, 2);
    ctx.stroke();
    // Reset shadow
    ctx.shadowBlur = 0;

    // 6. Targeting scope around head (Dynamic visual asset feel)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 140, 0, Math.PI * 2);
    ctx.stroke();

    // Outer framing brackets
    const bracketSize = 25;
    const radius = 140;
    // Top-Left Bracket
    ctx.beginPath();
    ctx.moveTo(-radius - bracketSize, -bracketSize);
    ctx.lineTo(-radius, -bracketSize);
    ctx.lineTo(-radius, -radius - bracketSize);
    ctx.stroke();

    ctx.restore();

    // Draw Telemetry Text on Canvas
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = "bold 9px monospace";
    ctx.fillText(`SEQ_STAGE: ${(t * 100).toFixed(0)}%`, centerX - 50 * baseScale, centerY + 180 * baseScale);
    ctx.fillStyle = "#ff4d00";
    ctx.fillText("NODE // SYNTHETIC_AVATAR_FALLBACK", centerX - 100 * baseScale, centerY + 200 * baseScale);
  };

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    // Use our safe fallback helper to get the nearest loaded frame
    const loadedIndex = getNearestLoadedFrameIndex(index);

    const img = imagesRef.current[loadedIndex - 1];
    if (!hasWebpImagesRef.current || !img || !img.complete || img.naturalWidth === 0) {
      drawFallbackVector(ctx, index, canvasWidth, canvasHeight);
      return;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle Resize with DPR Clamp for mobile performance
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const isMobileDevice = window.innerWidth < 768;
      const cappedDpr = Math.min(dpr, isMobileDevice ? 1.25 : 1.5);
      
      canvas.width = window.innerWidth * cappedDpr;
      canvas.height = window.innerHeight * cappedDpr;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(cappedDpr, cappedDpr);
      }

      // Redraw current frame immediately after resize
      renderFrame(Math.round(currentFrameRef.current));
    };

    window.addEventListener("resize", resizeCanvas);
    
    // Initial resize setup with DPR Clamp
    const dpr = window.devicePixelRatio || 1;
    const isMobileDevice = window.innerWidth < 768;
    const cappedDpr = Math.min(dpr, isMobileDevice ? 1.25 : 1.5);
    canvas.width = window.innerWidth * cappedDpr;
    canvas.height = window.innerHeight * cappedDpr;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(cappedDpr, cappedDpr);
    }

    // Preload Logic
    const preloadImages = () => {
      const total = totalFrames;
      const images: HTMLImageElement[] = [];

      for (let i = 1; i <= total; i++) {
        const img = new Image();
        const frameStr = String(i).padStart(4, "0");
        img.src = `/frames/sequence-01/desktop/frame_${frameStr}.webp`;
        images.push(img);
      }
      imagesRef.current = images;

      // 1. Load First Frame immediately
      const firstImg = images[0];
      const loadFirstFrame = () => {
        setFirstFrameLoadedState(true);
        if (onFirstFrameLoaded) onFirstFrameLoaded();
        renderFrame(1);
      };

      if (firstImg.complete) {
        loadFirstFrame();
      } else {
        firstImg.onload = loadFirstFrame;
        firstImg.onerror = () => {
          // If the WebP frames fail to load, switch to Vector fallback drawing instantly
          hasWebpImagesRef.current = false;
          setFirstFrameLoadedState(true);
          if (onFirstFrameLoaded) onFirstFrameLoaded();
          renderFrame(1);
        };
      }

      // 2. Preload remaining images in background
      let loadedCount = 1;
      const handleLoad = () => {
        loadedCount++;
        if (loadedCount === total) {
          if (onAllFramesLoaded) onAllFramesLoaded();
        }
      };

      for (let i = 1; i < total; i++) {
        const img = images[i];
        if (img.complete) {
          handleLoad();
        } else {
          img.onload = handleLoad;
          img.onerror = handleLoad; // Safe fallback for missing frames
        }
      }
    };

    preloadImages();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [totalFrames, onFirstFrameLoaded, onAllFramesLoaded]);

  return (
    <canvas
      ref={canvasRef}
      id="frame-sequence-canvas"
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 bg-[#04020a]"
      style={{ display: "block" }}
    />
  );
});

FrameSequenceCanvas.displayName = "FrameSequenceCanvas";
export default FrameSequenceCanvas;
