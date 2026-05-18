import { useEffect, useRef } from "react";
import { STARFIELD_SKILLS } from "../constants";

/** Solid dark base — matches hero reference (no purple galaxy gradient) */
export const COSMIC_BG = "#0b0e14";

const STARFIELD_CONFIG = {
  starCount: 220,
  maxStarSize: 7,
  minStarSize: 1,
  hoverRadius: 110,
  connectionRadius: 140,
  linkDistance: 130,
  colors: {
    star: ["#ffffff", "#f5f5f4", "#e7e5e4", "#d6d3d1"],
    connection: "rgba(255, 255, 255, 0.45)",
  },
};

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
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
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
          0.4 +
          Math.sin(frameCount * star.twinkleSpeed + star.twinkleOffset) * 0.3;
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

          ctx.globalAlpha = lineFade * mouseFade * 0.55;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    if (activeStar) {
      stars.forEach((star) => {
        if (star === activeStar) return;
        const dist = Math.hypot(activeStar.x - star.x, activeStar.y - star.y);

        if (dist < linkDistance) {
          ctx.globalAlpha = (1 - dist / linkDistance) * 0.65;
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
    ctx.fillStyle = "rgba(11, 14, 20, 0.9)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
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

      if (star.size > 2.5) {
        ctx.globalAlpha = star.brightness * 0.2;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

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
    ctx.fillStyle = COSMIC_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    return initStarfield(canvasRef.current);
  }, []);

  return (
    <div
      className="cosmic-background pointer-events-none fixed inset-0 -z-10"
      style={{ backgroundColor: COSMIC_BG }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="starfield-canvas absolute inset-0 block h-full w-full"
      />
    </div>
  );
};

export default CosmicBackground;
