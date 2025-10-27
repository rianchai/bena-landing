"use client";
import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import CloudShape from "./CloudShapes";

export default function Cloud({ opacity = 1, count = 7, durationScale = 2 }) {
  const [mounted, setMounted] = useState(false);
  const [clouds, setClouds] = useState([]);
  const [windFactor, setWindFactor] = useState(1);

  /* ---------- Random Generator ---------- */
  const seedRef = useRef(0x9e3779b9);
  const nextRand = useCallback(() => {
    seedRef.current = (1103515245 * seedRef.current + 12345) % 0x80000000;
    return seedRef.current / 0x80000000;
  }, []);
  const rand = useCallback((min, max) => min + nextRand() * (max - min), [nextRand]);
  const pick = useCallback((arr) => arr[Math.floor(nextRand() * arr.length)], [nextRand]);

  /* ---------- Cloud Factory ---------- */
  const createCloud = useCallback(({ inside = false, side = null } = {}) => {
    const layers = [
      { scaleMin: 0.3, scaleMax: 0.45, durMin: 160, durMax: 200, blurPx: 2, z: 0 },
      { scaleMin: 0.45, scaleMax: 0.7, durMin: 130, durMax: 170, blurPx: 1, z: 1 },
      { scaleMin: 0.65, scaleMax: 0.85, durMin: 100, durMax: 140, blurPx: 0, z: 2 },
    ];

    const layer = pick(layers);
    const direction = side ? (side === "left" ? 1 : -1) : nextRand() > 0.5 ? 1 : -1;
    const startX = inside ? `${rand(0, 100)}vw` : direction > 0 ? "-15vw" : "115vw";
    const endX = direction > 0 ? "115vw" : "-15vw";

    return {
      id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
      shape: pick(["A", "B", "C"]),
      z: layer.z,
      y: rand(5, 80),
      scale: rand(layer.scaleMin, layer.scaleMax),
      startX,
      endX,
      speed: rand(layer.durMin, layer.durMax),
      delay: inside ? rand(0, 3) : 0,
      blur: layer.blurPx,
      size: rand(160, 220) * (1 + layer.z * 0.15),
      direction,
    };
  }, [pick, rand, nextRand]);

  /* ---------- Initial Clouds ---------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const initial = Array.from({ length: count }, () => createCloud({ inside: true }));
    requestAnimationFrame(() => setClouds(initial));
  }, [count, createCloud]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* ---------- Scroll Wind (Timelapse-style) ---------- */
  useEffect(() => {
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let target = 1;
    let current = 1;
    let animationId;

    const smoothUpdate = () => {
      // ⚡ Lebih responsif, smoothing dikurangi
      current += (target - current) * 0.35;
      setWindFactor(current);
      animationId = requestAnimationFrame(smoothUpdate);
    };
    smoothUpdate();

    const onScroll = () => {
      const now = performance.now();
      const newY = window.scrollY;
      const dy = newY - lastY;
      const dt = (now - lastTime) / 1000;
      const velocity = Math.abs(dy / dt || 0);

      // 💨 Boost besar — semakin cepat scroll semakin besar faktor
      target = Math.min(1 + velocity / 2, 200); // bisa sampai 80x lebih cepat

      // decay lebih lambat biar terasa inertia
      clearTimeout(onScroll.timeout);
      onScroll.timeout = setTimeout(() => {
        target = 1;
      }, 350);

      lastY = newY;
      lastTime = now;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(onScroll.timeout);
    };
  }, []);

    /* ---------- Auto Maintain Cloud Count ---------- */
  useEffect(() => {
    const checkClouds = setInterval(() => {
      setClouds((prev) => {
        if (prev.length < count) {
          const extra = Array.from({ length: count - prev.length }, () =>
            createCloud({ inside: true })
          );
          return [...prev, ...extra];
        }
        return prev;
      });
    }, 3000); // cek setiap 3 detik

    return () => clearInterval(checkClouds);
  }, [count, createCloud]);

  /* ---------- Respawn Clouds ---------- */
  const handleCycleComplete = useCallback(
    (id, prevDir) => {
      const flip = nextRand() > 0.5 ? -1 : 1;
      const newDir = prevDir * flip;
      const side = newDir > 0 ? "left" : "right";
      setClouds((prev) =>
        prev.map((c) => (c.id === id ? createCloud({ inside: false, side }) : c))
      );
    },
    [createCloud, nextRand]
  );

  if (!mounted || clouds.length === 0) return null;
  

  /* ---------- Render Clouds ---------- */
  return createPortal(
    <>
      {clouds.sort((a, b) => a.z - b.z).map((cloud) => {
        const duration = (cloud.speed * durationScale) / windFactor;

        return (
          <motion.div
            key={cloud.id}
            className="fixed will-change-transform"
            style={{
              top: `${cloud.y}vh`,
              scale: cloud.scale,
              opacity,
              zIndex: 10 + cloud.z,
              pointerEvents: "none",
              filter: cloud.blur ? `blur(${cloud.blur}px)` : "none",
            }}
            initial={{ x: cloud.startX, opacity: 0.9 }}
            animate={{ x: cloud.endX, opacity }}
            transition={{ duration, ease: "linear", delay: cloud.delay }}
            onAnimationComplete={() => handleCycleComplete(cloud.id, cloud.direction)}
          >
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{
                duration: cloud.speed * 0.35,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            >
              <CloudShape type={cloud.shape} size={cloud.size} color="#FFFFFF" />
            </motion.div>
          </motion.div>
        );
      })}
    </>,
    document.body
  );
}
