import React, { useEffect, useRef } from 'react';
import { sounds } from '../utils/audio';

interface Props {
  onInteract: (dopamine: number) => void;
}

export const SoapAndSubwayCanvas: React.FC<Props> = ({ onInteract }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Soap cutting pieces state
    const soapGrid: { x: number; y: number; color: string; cut: boolean; fallVy: number; fallY: number }[] = [];
    const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 10; c++) {
        soapGrid.push({
          x: c * 22,
          y: r * 14,
          color: colors[(r + c) % colors.length],
          cut: false,
          fallVy: 0,
          fallY: 0,
        });
      }
    }

    let cutterX = 0;
    let cutterY = 0;

    const render = () => {
      time += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      // Half screen divider: Left is Soap Cutting, Right is Subway Runner
      const splitX = Math.floor(width / 2);

      // --- 1. SOAP CUTTING SIMULATOR (LEFT) ---
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, height);
      ctx.clip();

      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, splitX, height);

      // Title tag
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('🧼 АСМР РЕЗКА МЫЛА ДЛЯ СДВГ', 10, 18);

      const soapStartX = splitX / 2 - 110;
      const soapStartY = height / 2 - 50;

      // Auto cutter knife motion
      cutterX = soapStartX + ((Math.sin(time * 2) + 1) / 2) * 220;
      cutterY = soapStartY + ((Math.cos(time * 1.5) + 1) / 2) * 110;

      // Render soap blocks
      soapGrid.forEach((block) => {
        const bx = soapStartX + block.x;
        const by = soapStartY + block.y;

        // check if cutter touches
        if (!block.cut && Math.abs(cutterX - bx) < 16 && Math.abs(cutterY - by) < 12) {
          block.cut = true;
          block.fallVy = 1.5 + Math.random() * 2;
        }

        if (block.cut) {
          block.fallY += block.fallVy;
          block.fallVy += 0.15;
          if (block.fallY > 150) {
            // reset
            block.cut = false;
            block.fallY = 0;
            block.fallVy = 0;
          }
        }

        ctx.fillStyle = block.color;
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 1;

        const drawY = by + (block.cut ? block.fallY : 0);
        ctx.fillRect(bx, drawY, 20, 12);
        ctx.strokeRect(bx, drawY, 20, 12);

        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(bx + 2, drawY + 2, 16, 3);
      });

      // Draw shiny knife
      ctx.fillStyle = '#e4e4e7';
      ctx.beginPath();
      ctx.moveTo(cutterX - 8, cutterY - 25);
      ctx.lineTo(cutterX + 8, cutterY - 25);
      ctx.lineTo(cutterX + 2, cutterY + 15);
      ctx.lineTo(cutterX - 2, cutterY + 15);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Vertical separator
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, height);
      ctx.stroke();

      // --- 2. SUBWAY 3D RUNNER HYPNOSIS (RIGHT) ---
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
      const vanishY = 35;

      // Perspective grid tracks
      const lanes = [-90, -30, 30, 90];
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;

      lanes.forEach((lx) => {
        ctx.beginPath();
        ctx.moveTo(vanishX, vanishY);
        ctx.lineTo(vanishX + lx * 1.8, height);
        ctx.stroke();
      });

      // Animated speed lines moving towards camera
      const numLines = 6;
      for (let i = 0; i < numLines; i++) {
        const p = ((time * 1.5 + i / numLines) % 1);
        const curY = vanishY + Math.pow(p, 2) * (height - vanishY);
        const curW = p * 160;

        ctx.strokeStyle = `rgba(56, 189, 248, ${p * 0.7})`;
        ctx.lineWidth = 1 + p * 2;
        ctx.beginPath();
        ctx.moveTo(vanishX - curW, curY);
        ctx.lineTo(vanishX + curW, curY);
        ctx.stroke();
      }

      // Animated runner box (Skibidi Sigma Cube)
      const runnerLane = Math.sin(time * 3) * 45;
      const runnerX = vanishX + runnerLane;
      const runnerY = height - 32;

      // Runner shadow
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.ellipse(runnerX, runnerY + 12, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Runner character (neon cube with sunglasses)
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(runnerX - 12, runnerY - 14, 24, 24);
      ctx.strokeStyle = '#ffe4e6';
      ctx.lineWidth = 2;
      ctx.strokeRect(runnerX - 12, runnerY - 14, 24, 24);

      // Glasses
      ctx.fillStyle = '#09090b';
      ctx.fillRect(runnerX - 10, runnerY - 6, 9, 6);
      ctx.fillRect(runnerX + 1, runnerY - 6, 9, 6);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(runnerX - 8, runnerY - 5, 4, 2);
      ctx.fillRect(runnerX + 3, runnerY - 5, 4, 2);

      // Falling coins / golden memes
      const coinY = vanishY + (((time * 2.2) % 1) ** 2) * (height - vanishY);
      const coinX = vanishX + Math.sin(time * 2) * 35;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(coinX, coinY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleClick = () => {
    sounds.slap();
    onInteract(30);
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border-2 border-zinc-700/80 shadow-inner bg-zinc-950">
      <div className="absolute top-1 right-2 z-10 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600/90 text-white animate-pulse">
        СДВГ-Сплит: Кликни для дофамина!
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={130}
        onClick={handleClick}
        className="w-full h-[130px] block cursor-pointer active:scale-[0.99] transition-transform"
      />
    </div>
  );
};
