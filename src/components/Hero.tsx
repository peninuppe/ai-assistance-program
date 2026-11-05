import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, ChevronDown, Sparkles, Cpu, Layers } from 'lucide-react';

interface HeroProps {
  officialFormUrl: string;
}

export const Hero: React.FC<HeroProps> = ({ officialFormUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Neural network / AI topology animation adapted for light background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Neural nodes
    const nodeCount = 36;
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      layer: number;
      pulse: number;
    }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2.2 + 2,
        layer: Math.floor(Math.random() * 4),
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Clean subtle blue ambient background glow
      const radial = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        width * 0.65
      );
      radial.addColorStop(0, 'rgba(30, 64, 175, 0.08)');
      radial.addColorStop(0.6, 'rgba(37, 99, 235, 0.03)');
      radial.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // Draw connections in classic blue tones
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 135) {
            const alpha = (1 - dist / 135) * 0.45;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(30, 64, 175, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // Draw nodes in deep classic blue & cobalt
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.03;

        if (node.x < 10 || node.x > width - 10) node.vx *= -1;
        if (node.y < 10 || node.y > height - 10) node.vy *= -1;

        const currentRadius = node.radius + Math.sin(node.pulse) * 0.7;

        // Outer halo
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(37, 99, 235, 0.12)';
        ctx.fill();

        // Core node
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.layer === 0 ? '#1e40af' : '#2563eb';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleScrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector('#about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-blue-50/50 via-white to-white border-b border-slate-200">
      {/* Decorative ambient subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* Information Strip (Zero-pill discipline: unboxed clean typographic metadata) */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold tracking-wide uppercase text-blue-800">
              <span>Online Assessment</span>
              <span className="text-slate-400" aria-hidden="true">/</span>
              <span>Engineering Students</span>
              <span className="text-slate-400" aria-hidden="true">/</span>
              <span className="text-blue-900 font-extrabold">Registration Fee: ₹999</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.14] [text-wrap:balance]">
              AI ASSISTANT ASSESSMENT PROGRAM 2026
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl font-bold text-blue-800 [text-wrap:balance]">
              Discover Your Skills. Unlock Your Potential. Accelerate Your Career.
            </p>

            {/* Description */}
            <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
              Welcome to the Exposys Data Labs AI Assistant Assessment Program 2026! This program is
              designed for engineering students to assess their technical knowledge, explore
              Artificial Intelligence tools, identify their strengths, and receive personalized
              learning and career guidance.
            </p>

            {/* Value Kicker */}
            <div className="text-sm font-semibold text-slate-800 tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-700" />
              <span>Your Skills. Your Score. Your Next Opportunity.</span>
            </div>

            {/* Two Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              {/* Button 1: REGISTER NOW - opens Google Form */}
              <a
                href={officialFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-lg shadow-blue-700/25 hover:shadow-blue-700/40 hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap"
              >
                <span>Register Now — ₹999</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              {/* Button 2: EXPLORE THE PROGRAM */}
              <a
                href="#about"
                onClick={handleScrollToAbout}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-blue-800 border border-slate-300 rounded-xl shadow-xs transition-all whitespace-nowrap"
              >
                <span>Explore The Program</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </a>
            </div>

            {/* Trust Markers */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-600 border-t border-slate-200 w-full">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Organization:</span>
                <span className="text-slate-900 font-bold">Exposys Data Labs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Eligible:</span>
                <span className="text-slate-900 font-bold">All Engineering Branches</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Duration:</span>
                <span className="text-slate-900 font-bold">7 Days Project Period</span>
              </div>
            </div>
          </div>

          {/* Right Column: AI-themed Visual Artwork & Interactive Neural Canvas */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 overflow-hidden">
              {/* Top Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-600 font-mono">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-700" />
                  <span className="text-slate-900 font-bold">EDL AI Assessment Node 2026</span>
                </div>
                <div className="text-blue-700 text-[11px] font-mono font-medium">v2.6 // Active Stream</div>
              </div>

              {/* Canvas viewport */}
              <div className="relative h-72 sm:h-80 w-full my-2 rounded-xl bg-slate-50 border border-slate-200/80 overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-full block" />

                {/* Overlay visual card */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 text-xs flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Open-Source AI Models</div>
                      <div className="text-[11px] text-slate-500">Permitted during assessment</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-blue-700">7-Day</span>
                    <span className="block text-[10px] text-slate-500">Submission</span>
                  </div>
                </div>
              </div>

              {/* Feature pillars */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-extrabold text-slate-900 text-sm tabular-nums">100%</div>
                  <div className="text-[11px] text-slate-600 mt-0.5 font-medium">Online Process</div>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="font-extrabold text-blue-700 text-sm">Official</div>
                  <div className="text-[11px] text-blue-800 mt-0.5 font-medium">Certificate</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-extrabold text-slate-900 text-sm tabular-nums">₹999</div>
                  <div className="text-[11px] text-slate-600 mt-0.5 font-medium">Registration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
