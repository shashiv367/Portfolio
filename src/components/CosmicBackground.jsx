import { useEffect, useRef } from "react";
import { STARFIELD_SKILLS } from "../constants";

const THREE_CDN =
  "https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js";
const VANTA_CDN =
  "https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.galaxy.min.js";

const STARFIELD_CONFIG = {
  starCount: 180,
  maxStarSize: 6,
  minStarSize: 1,
  hoverRadius: 110,
  connectionRadius: 140,
  linkDistance: 130,
  colors: {
    star: ["#f9fbfc", "#f2f2ee", "#dbdbd8"],
    connection: "rgba(255, 255, 255, 0.55)",
  },
};

const VANTA_GALAXY_OPTIONS = {
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200,
  minWidth: 200,
  scale: 1,
  scaleMobile: 1,
  color: 0x1e3a8a,
  backgroundColor: 0x0a0f1a,
  size: 1.2,
  spacing: 15,
};

const FALLBACK_BG =
  "radial-gradient(circle at 25% 25%, #1e3a8a 0%, transparent 50%), " +
  "radial-gradient(circle at 75% 75%, #7c3aed 0%, transparent 50%), " +
  "linear-gradient(135deg, #0a0f1a 0%, #111827 100%)";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function initStarfield(canvas) {
  const ctx = canvas.getContext("2d");
  const mouse = { x: -9999, y: -9999 };
  let frameCount = 0;
  let animationId = null;
  let activeStar = null;

  const stars = [];

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const createStars = () => {
    stars.length = 0;
    for (let i = 0; i < STARFIELD_CONFIG.starCount; i++) {
      const size =
        Math.random() *
          (STARFIELD_CONFIG.maxStarSize - STARFIELD_CONFIG.minStarSize) +
        STARFIELD_CONFIG.minStarSize;
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        originalSize: size,
        color:
          STARFIELD_CONFIG.colors.star[
            Math.floor(Math.random() * STARFIELD_CONFIG.colors.star.length)
          ],
        brightness: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        skillLabel: STARFIELD_SKILLS[i % STARFIELD_SKILLS.length],
      });
    }
  };

  const findNearestStar = () => {
    let nearest = null;
    let nearestDist = STARFIELD_CONFIG.hoverRadius;

    stars.forEach((star) => {
      const distance = Math.hypot(mouse.x - star.x, mouse.y - star.y);
      if (distance < nearestDist) {
        nearestDist = distance;
        nearest = star;
      }
    });

    return nearest;
  };

  const updateStars = () => {
    activeStar = findNearestStar();

    stars.forEach((star) => {
      star.x += star.vx;
      star.y += star.vy;

      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;

      if (star === activeStar) {
        const distance = Math.hypot(mouse.x - star.x, mouse.y - star.y);
        const hoverStrength = 1 - distance / STARFIELD_CONFIG.hoverRadius;
        star.size = star.originalSize + hoverStrength * 6;
        star.brightness = 0.95 + hoverStrength * 0.05;
      } else {
        star.size = star.originalSize;
        star.brightness =
          0.45 +
          Math.sin(frameCount * star.twinkleSpeed + star.twinkleOffset) * 0.25;
      }
    });
  };

  const drawConnections = () => {
    const { connectionRadius, linkDistance } = STARFIELD_CONFIG;
    const nearMouse = stars.filter(
      (s) => Math.hypot(mouse.x - s.x, mouse.y - s.y) < connectionRadius
    );

    if (nearMouse.length < 2 && !activeStar) return;

    ctx.strokeStyle = STARFIELD_CONFIG.colors.connection;
    ctx.lineWidth = 1;

    // Constellation mesh — link stars near the cursor
    for (let i = 0; i < nearMouse.length; i++) {
      for (let j = i + 1; j < nearMouse.length; j++) {
        const a = nearMouse[i];
        const b = nearMouse[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);

        if (dist < linkDistance) {
          const lineFade = 1 - dist / linkDistance;
          const mouseNear = Math.min(
            Math.hypot(mouse.x - a.x, mouse.y - a.y),
            Math.hypot(mouse.x - b.x, mouse.y - b.y)
          );
          const mouseFade = 1 - mouseNear / connectionRadius;

          ctx.globalAlpha = lineFade * mouseFade * 0.65;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Spokes from the hovered star
    if (activeStar) {
      stars.forEach((star) => {
        if (star === activeStar) return;
        const dist = Math.hypot(activeStar.x - star.x, activeStar.y - star.y);

        if (dist < linkDistance) {
          ctx.globalAlpha = (1 - dist / linkDistance) * 0.75;
          ctx.beginPath();
          ctx.moveTo(activeStar.x, activeStar.y);
          ctx.lineTo(star.x, star.y);
          ctx.stroke();
        }
      });
    }

    ctx.globalAlpha = 1;
  };

  const drawSkillLabel = (star) => {
    const label = star.skillLabel;
    const fontSize = 11;
    ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
    const textWidth = ctx.measureText(label).width;
    const padX = 8;
    const padY = 4;
    const boxW = textWidth + padX * 2;
    const boxH = fontSize + padY * 2;
    const x = star.x - boxW / 2;
    const y = star.y - star.size - boxH - 6;

    ctx.globalAlpha = 0.92;
    ctx.fillStyle = "rgba(10, 15, 26, 0.88)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(x, y, boxW, boxH, 6);
    } else {
      ctx.rect(x, y, boxW, boxH);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#f5f5f4";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, star.x, y + boxH / 2);
    ctx.globalAlpha = 1;
  };

  const drawStars = () => {
    stars.forEach((star) => {
      ctx.globalAlpha = star.brightness;
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      if (star === activeStar) {
        ctx.globalAlpha = star.brightness * 0.35;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
        drawSkillLabel(star);
      }
    });

    ctx.globalAlpha = 1;
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateStars();
    drawConnections();
    drawStars();
    frameCount += 1;
    animationId = requestAnimationFrame(animate);
  };

  const onPointerMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };

  const onPointerLeave = (e) => {
    if (e.relatedTarget === null) {
      mouse.x = -9999;
      mouse.y = -9999;
    }
  };

  const onResize = () => {
    resizeCanvas();
    createStars();
  };

  const onVisibilityChange = () => {
    if (document.hidden) {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    } else if (!animationId) {
      animationId = requestAnimationFrame(animate);
    }
  };

  resizeCanvas();
  createStars();
  animationId = requestAnimationFrame(animate);

  window.addEventListener("resize", onResize);
  document.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerleave", onPointerLeave);
  document.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
    if (animationId) cancelAnimationFrame(animationId);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerleave", onPointerLeave);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
}

const CosmicBackground = () => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const el = vantaRef.current;
    if (!el) return;

    let cancelled = false;

    const initVanta = async () => {
      try {
        if (!window.THREE) {
          await loadScript(THREE_CDN);
        }
        await loadScript(VANTA_CDN);
        if (cancelled || !vantaRef.current || !window.VANTA?.GALAXY) return;

        vantaEffect.current = window.VANTA.GALAXY({
          el: vantaRef.current,
          ...VANTA_GALAXY_OPTIONS,
        });
      } catch {
        if (!cancelled && vantaRef.current) {
          vantaRef.current.style.background = FALLBACK_BG;
        }
      }
    };

    initVanta();

    return () => {
      cancelled = true;
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    return initStarfield(canvasRef.current);
  }, []);

  return (
    <div
      className="cosmic-background pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    >
      <div ref={vantaRef} className="absolute inset-0" />
      <canvas
        ref={canvasRef}
        className="starfield-canvas absolute inset-0 block h-full w-full"
      />
    </div>
  );
};

export default CosmicBackground;
