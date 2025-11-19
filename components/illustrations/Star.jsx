"use client";
import { useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";

import Star1 from "./images/star1.svg";
import Star2 from "./images/star2.svg";
import Star3 from "./images/star3.svg";
import Star4 from "./images/star4.svg";

const starShapes = [Star1, Star2, Star3, Star4];


export default function Star({ count = 30, depth = 1, z = 20 }) {
  const [stars, setStars] = useState([]);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      const generated = Array.from({ length: count }).map(() => ({
        Shape: starShapes[Math.floor(Math.random() * starShapes.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2,
        scale: 0.4 + Math.random() * 1.2,
        rotation: Math.random() * 360,
        hue: 45 + Math.random() * 25,
        brightness: 85 + Math.random() * 15,
      }));
      
      setStars(generated);
    });

    return () => cancelAnimationFrame(id);
  }, [count]);


  if (stars.length === 0) return null;

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: z }}
    >
      {stars.map((s, i) => {
        const Shape = s.Shape;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${s.x}vw`,
              top: `${s.y}vh`,
              transformOrigin: "center",
              filter: `hue-rotate(${s.hue}deg) brightness(${s.brightness}%)`,
              zIndex : z,
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [s.scale, s.scale * 1.1, s.scale],
              y: [0, 2 * depth, 0], //parallax vertical subtle
              rotate: [s.rotation, s.rotation + 15, s.rotation],
            }}
            transition={{
              duration: s.duration * (1 / depth),
              delay: s.delay,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            <Shape
              width={35 * depth}
              height={35 * depth}
              style={{
                transform: `rotate(${s.rotation}deg) scale(${s.scale})`,
                transformBox: "fill-box",
              }}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
