import { useEffect, useRef, useState } from "react";

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="pointer"]';

const CosmicCursor = () => {
  const cursorRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    // Only skip phones/tablets — laptops with touchscreens still get the glass cursor
    const isTouchPrimary = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;

    if (isTouchPrimary) return;

    setEnabled(true);
    document.documentElement.classList.add("cosmic-cursor-active");
    document.body.classList.add("cosmic-cursor-active");

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onOver = (e) => {
      setHovering(Boolean(e.target.closest(INTERACTIVE)));
    };

    let frameId;
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.22;
      pos.current.y += (target.current.y - pos.current.y) * 0.22;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      frameId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    return () => {
      document.documentElement.classList.remove("cosmic-cursor-active");
      document.body.classList.remove("cosmic-cursor-active");
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  if (!enabled) return null;

  const stateClass = [
    visible ? "is-visible" : "",
    hovering ? "is-hover" : "",
    clicking ? "is-click" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={cursorRef}
      className={`cosmic-cursor-glass ${stateClass}`}
      aria-hidden="true"
    />
  );
};

export default CosmicCursor;
