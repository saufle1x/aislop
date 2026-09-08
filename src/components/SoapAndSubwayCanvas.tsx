import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sounds } from '../utils/audio';

interface Props {
  onInteract: (dopamine: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
}

interface CanvasFloatText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

export const SoapAndSubwayCanvas: React.FC<Props> = ({ onInteract }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [clickCount, setClickCount] = useState<number>(0);

  // References for live interaction state inside requestAnimationFrame
  const interactionRef = useRef({
    isPointerDown: false,
    mouseX: 0,
    mouseY: 0,
    runnerJumpVy: 0,
    runnerJumpY: 0,
    runnerRot: 0,
    particles: [] as Particle[],
    floatTexts: [] as CanvasFloatText[],
    sliceKnifeX: 120,
    sliceKnifeY: 60,
    targetKnifeX: 120,
    targetKnifeY: 60,
  });

  const triggerInteraction = useCallback((clientX?: number, clientY?: number, isClick = true) => {
    try {
      sounds.slap();
    } catch {
      // ignore
    }

    onInteract(35);
    setClickCount((c) => c + 1);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = clientX !== undefined ? (clientX - rect.left) * scaleX : canvas.width * 0.25;
    const y = clientY !== undefined ? (clientY - rect.top) * scaleY : canvas.height * 0.5;

    const state = interactionRef.current;
    state.targetKnifeX = x;
    state.targetKnifeY = y;

    const isSubwaySide = x > canvas.width / 2;

    if (isSubwaySide) {
      // Make runner jump and spin
      state.runnerJumpVy = -8;
      try {
        sounds.airhorn();
      } catch {
        // ignore
      }

      // Add subway particles
      for (let i = 0; i < 10; i++) {
        state.particles.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 6,
          vy: -Math.random() * 4 - 2,
          color: '#38bdf8',
          size: Math.random() * 4 + 2,
          alpha: 1,
          life: 0,
        });
      }

      state.floatTexts.push({
        id: Date.now() + Math.random(),
        x: Math.min(canvas.width - 90, Math.max(canvas.width / 2 + 10, x - 25)),
        y: Math.max(30, y),
        text: '+35 СУБВЕЙ!',
        color: '#38bdf8',
        alpha: 1,
        vy: -1.2,
      });
    } else {
      // Soap slice ASMR side
      try {
        sounds.slap();
      } catch {
        // ignore
      }

      for (let i = 0; i < 14; i++) {
        state.particles.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 5,
          vy: -Math.random() * 3 - 1,
          color: ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 6)],
          size: Math.random() * 5 + 2,
          alpha: 1,
          life: 0,
        });
      }

      state.floatTexts.push({
        id: Date.now() + Math.random(),
        x: Math.min(canvas.width / 2 - 80, Math.max(10, x - 25)),
        y: Math.max(30, y),
        text: '+35 АСМР!',
        color: '#f43f5e',
        alpha: 1,
        vy: -1.2,
      });
    }
  }, [onInteract]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Soap cutting pieces grid
    const soapGrid: { x: number; y: number; color: string; cut: boolean; fallVy: number; fallY: number }[] = [];
    const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 10; c++) {
        soapGrid.push({
          x: c * 24,
          y: r * 15,
          color: colors[(r + c) % colors.length],
          cut: false,
          fallVy: 0,
          fallY: 0,
        });
      }
    }

    const render = () => {
      time += 0.03;
      const width = canvas.width;
      const height = canvas.height;
      const state = interactionRef.current;

      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      const splitX = Math.floor(width / 2);

      // --- 1. SOAP CUTTING (LEFT HALF) ---
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, height);
      ctx.clip();

      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, splitX, height);

      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('🧼 АСМР РЕЗКА МЫЛА ДЛЯ СДВГ', 10, 18);

      const soapStartX = splitX / 2 - 120;
      const soapStartY = height / 2 - 45;

      // Smooth knife motion (follows target or auto-swings)
      if (state.isPointerDown && state.mouseX < splitX) {
        state.targetKnifeX = state.mouseX;
        state.targetKnifeY = state.mouseY;
      } else {
        state.targetKnifeX = soapStartX + ((Math.sin(time * 2.2) + 1) / 2) * 230;
        state.targetKnifeY = soapStartY + ((Math.cos(time * 1.6) + 1) / 2) * 100;
      }

      state.sliceKnifeX += (state.targetKnifeX - state.sliceKnifeX) * 0.25;
      state.sliceKnifeY += (state.targetKnifeY - state.sliceKnifeY) * 0.25;

      // Render soap blocks
      soapGrid.forEach((block) => {
        const bx = soapStartX + block.x;
        const by = soapStartY + block.y;

        // check if knife touches block or user dragging over it
        const distKnife = Math.hypot(state.sliceKnifeX - bx, state.sliceKnifeY - by);
        const distPointer = state.isPointerDown && state.mouseX < splitX 
          ? Math.hypot(state.mouseX - bx, state.mouseY - by) 
          : 999;

        if (!block.cut && (distKnife < 18 || distPointer < 24)) {
          block.cut = true;
          block.fallVy = 1.8 + Math.random() * 2.5;

          // add tiny crumb particle
          state.particles.push({
            x: bx + 10,
            y: by + 6,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 2 - 1,
            color: block.color,
            size: Math.random() * 3 + 1,
            alpha: 1,
            life: 0,
          });
        }

        if (block.cut) {
          block.fallY += block.fallVy;
          block.fallVy += 0.22;
          if (block.fallY > 160) {
            // Regrow soap continuously for endless satisfying cutting
            block.cut = false;
            block.fallY = 0;
            block.fallVy = 0;
          }
        }

        ctx.fillStyle = block.color;
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 1;

        const drawY = by + (block.cut ? block.fallY : 0);
        ctx.fillRect(bx, drawY, 22, 13);
        ctx.strokeRect(bx, drawY, 22, 13);

        // Highlight sheen
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillRect(bx + 2, drawY + 2, 18, 3);
      });

      // Draw shiny knife blade
      const kx = state.sliceKnifeX;
      const ky = state.sliceKnifeY;
      ctx.fillStyle = '#f4f4f5';
      ctx.beginPath();
      ctx.moveTo(kx - 10, ky - 30);
      ctx.lineTo(kx + 10, ky - 30);
      ctx.lineTo(kx + 3, ky + 16);
      ctx.lineTo(kx - 3, ky + 16);
      ctx.closePath();
      ctx.fill();

      // Knife handle
      ctx.fillStyle = '#71717a';
      ctx.fillRect(kx - 5, ky - 48, 10, 20);

      ctx.restore();

      // Center divider
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, height);
      ctx.stroke();

      // --- 2. SUBWAY RUNNER HYPNOSIS (RIGHT HALF) ---
      ctx.save();
      ctx.beginPath();
      ctx.rect(splitX, 0, width - splitX, height);
      ctx.clip();

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(splitX, 0, width - splitX, height);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('🏃 СУБВЕЙ РАННЕР ГИПНОЗ', splitX + 10, 18);

      const vanishX = splitX + (width - splitX) / 2;
      const vanishY = 32;

      // Track perspective
      const lanes = [-100, -35, 35, 100];
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      lanes.forEach((lx) => {
        ctx.beginPath();
        ctx.moveTo(vanishX, vanishY);
        ctx.lineTo(vanishX + lx * 1.8, height);
        ctx.stroke();
      });

      // Speed lines
      const numLines = 6;
      for (let i = 0; i < numLines; i++) {
        const p = ((time * 1.6 + i / numLines) % 1);
        const curY = vanishY + Math.pow(p, 2) * (height - vanishY);
        const curW = p * 170;

        ctx.strokeStyle = `rgba(56, 189, 248, ${p * 0.75})`;
        ctx.lineWidth = 1 + p * 2;
        ctx.beginPath();
        ctx.moveTo(vanishX - curW, curY);
        ctx.lineTo(vanishX + curW, curY);
        ctx.stroke();
      }

      // Physics for jumping runner on click
      state.runnerJumpY += state.runnerJumpVy;
      state.runnerJumpVy += 0.45; // gravity
      if (state.runnerJumpY > 0) {
        state.runnerJumpY = 0;
        state.runnerJumpVy = 0;
        state.runnerRot = 0;
      } else {
        state.runnerRot += 0.15; // flip in air
      }

      const runnerLane = Math.sin(time * 3) * 50;
      const runnerX = vanishX + runnerLane;
      const runnerBaseY = height - 30;
      const runnerY = runnerBaseY + state.runnerJumpY;

      // Shadow on ground
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      const shadowScale = Math.max(0.4, 1 - Math.abs(state.runnerJumpY) / 60);
      ctx.ellipse(runnerX, runnerBaseY + 12, 15 * shadowScale, 6 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Render Runner cube with rotation if jumped
      ctx.save();
      ctx.translate(runnerX, runnerY);
      if (state.runnerJumpY < 0) {
        ctx.rotate(state.runnerRot);
      }

      ctx.fillStyle = '#e11d48';
      ctx.fillRect(-12, -12, 24, 24);
      ctx.strokeStyle = '#ffe4e6';
      ctx.lineWidth = 2;
      ctx.strokeRect(-12, -12, 24, 24);

      // Glasses
      ctx.fillStyle = '#09090b';
      ctx.fillRect(-10, -5, 9, 6);
      ctx.fillRect(1, -5, 9, 6);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-8, -4, 4, 2);
      ctx.fillRect(3, -4, 4, 2);
      ctx.restore();

      // Coins falling towards runner
      for (let c = 0; c < 3; c++) {
        const coinP = ((time * 2.2 + c * 0.33) % 1);
        const coinY = vanishY + Math.pow(coinP, 2) * (height - vanishY);
        const coinX = vanishX + Math.sin(time * 2.5 + c) * 45;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(coinX, coinY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();

      // --- 3. COMMON OVERLAYS: PARTICLES & FLOATING TEXTS ---
      // Update & draw particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.alpha -= 0.03;
        p.life++;

        if (p.alpha <= 0 || p.y > height) {
          state.particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Update & draw floating text badges
      for (let i = state.floatTexts.length - 1; i >= 0; i--) {
        const ft = state.floatTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.025;

        if (ft.alpha <= 0) {
          state.floatTexts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.font = '900 13px sans-serif';
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  // Pointer event handlers for instant responsiveness on mouse and touch
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    interactionRef.current.isPointerDown = true;
    interactionRef.current.mouseX = (e.clientX - rect.left) * scaleX;
    interactionRef.current.mouseY = (e.clientY - rect.top) * scaleY;

    triggerInteraction(e.clientX, e.clientY, true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    interactionRef.current.mouseX = (e.clientX - rect.left) * scaleX;
    interactionRef.current.mouseY = (e.clientY - rect.top) * scaleY;

    // Slicing while dragging
    if (interactionRef.current.isPointerDown && Math.random() > 0.4) {
      triggerInteraction(e.clientX, e.clientY, false);
    }
  };

  const handlePointerUp = () => {
    interactionRef.current.isPointerDown = false;
  };

  return (
    <div
      ref={containerRef}
      id="soap-subway-container"
      className="relative w-full rounded-xl overflow-hidden border-2 border-zinc-700/80 shadow-inner bg-zinc-950 group select-none"
    >
      {/* Clickable Badge in Top Right */}
      <button
        id="btn-sdvg-split-badge"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          triggerInteraction(undefined, undefined, true);
        }}
        className="absolute top-2 right-2 z-20 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-rose-600 hover:bg-rose-500 active:scale-90 text-white shadow-lg shadow-rose-600/40 animate-pulse transition-all cursor-pointer flex items-center gap-1 border border-rose-400"
      >
        <span>⚡ СДВГ-СПЛИТ: КЛИКНИ!</span>
        {clickCount > 0 && <span className="bg-white/20 px-1 rounded text-[9px]">x{clickCount}</span>}
      </button>

      {/* Interactive Canvas with Pointer Events for Click & Drag */}
      <canvas
        id="soap-subway-canvas"
        ref={canvasRef}
        width={500}
        height={140}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-[140px] block cursor-crosshair active:brightness-110 transition-all touch-none"
      />
    </div>
  );
};
