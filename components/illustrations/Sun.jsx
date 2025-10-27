"use client";
import { motion } from "framer-motion";
import MySun from "./images/sun.svg"; // ⬅️ Import SVG kamu

export default function Sun({
  size = 200,
  spin = true,
  spinSpeed = 18,
  progress = 1, // nanti bisa untuk transisi day/night
  y = 0, // opsional untuk posisi vertical
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: progress }}
      transition={{ duration: 0.8 }}
      style={{
        width: size,
        height: size,
        y,
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <motion.div
        style={{ originX: "50%", originY: "50%" }}
        animate={{
          rotate: spin ? 360 : 0,
          scale: [1, 1.05, 1], // 💓 efek detak
        }}
        transition={{
          rotate: spin ? { repeat: Infinity, duration: spinSpeed, ease: "linear" } : {},
          scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }, // ritme detak halus
        }}
      >
        <MySun width="100%" height="100%" />
      </motion.div>
    </motion.div>
  );
}
