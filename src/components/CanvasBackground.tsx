import React, { useEffect, useRef } from 'react';

export const CanvasBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for carbon flux / atmospheric sensor representation
    const nodeCount = Math.min(38, Math.floor(width / 45));
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
    }> = [];

    const colors = ['#10B981', '#059669', '#34D399', '#064E3B'];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.2,
        alpha: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let time = 0;

    const render = () => {
      time += 0.006;
      ctx.clearRect(0, 0, width, height);

      // Deep ecological gradient backdrop
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, '#040d08');
      bgGradient.addColorStop(0.5, '#07170f');
      bgGradient.addColorStop(1, '#030a06');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient emerald radial glow
      const glow1 = ctx.createRadialGradient(
        width * 0.25,
        height * 0.35,
        50,
        width * 0.25,
        height * 0.35,
        width * 0.55
      );
      glow1.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
      glow1.addColorStop(0.7, 'rgba(5, 150, 105, 0.02)');
      glow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle topological contour wave lines (simulating carbon sink topography)
      ctx.lineWidth = 1;
      const waveCount = 5;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const baseHeight = height * (0.45 + w * 0.12);
        const waveOpacity = 0.03 + w * 0.015;
        ctx.strokeStyle = `rgba(52, 211, 153, ${waveOpacity})`;

        for (let x = 0; x <= width; x += 15) {
          const yOffset =
            Math.sin(x * 0.003 + time + w * 0.7) * 28 +
            Math.cos(x * 0.0015 - time * 0.5 + w) * 20;
          const y = baseHeight + yOffset;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw subtle remote sensing grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 0.8;
      const gridSize = 120;
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

      // Draw connective atmospheric nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        // Bounce boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = node.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Connect nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = 'rgba(16, 185, 129, ' + (0.12 - dist / 1100) + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
