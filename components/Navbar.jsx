"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const [phase, setPhase] = useState(0);

  // 🌈 Deteksi fase langit (siang → sore → malam)
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      if (v < 0.3) setPhase(0);
      else if (v < 0.6) setPhase(1);
      else setPhase(2);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // 🎨 Warna teks transisi halus
  const textColor =
    phase === 0
      ? "#FFD65E" // siang
      : phase === 1
      ? "#FFF7DA" // sore lembut
      : "#FFFFFF"; // malam

  // 🧭 Scroll manual agar tidak nyangkut
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      const offset = 100; // tinggi navbar
      const position = section.offsetTop - offset;
      window.scrollTo({ top: position, behavior: "smooth" });
      setMenuOpen(false); // tutup menu di mobile
    }
  };

  return (
    <motion.nav
      className={`
        fixed top-0 left-0 w-full z-[500]
        bg-white/10 backdrop-blur-[1px]
        transition-all duration-700 ease-out
      `}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">
        {/* 🔰 Logo */}
        <button
          onClick={() => scrollToSection("home")}
          className="flex items-center gap-2 select-none"
        >
          <Image
            src="/logo.png"
            alt="BENA Logo"
            width={90}
            height={90}
            priority
            className="w-[90px] h-[90px] object-contain select-none filter-none shadow-none"
          />
        </button>

        {/* 🌤️ Menu Desktop */}
        <ul
          className="hidden md:flex gap-10 text-[22px] font-medium"
          style={{ color: textColor, transition: "color 0.8s ease-in-out" }}
        >
          <li><button onClick={() => scrollToSection("home")}>Home</button></li>
          <li><button onClick={() => scrollToSection("shop")}>Shop</button></li>
          <li><button onClick={() => scrollToSection("findus")}>Find Us</button></li>
          <li><button onClick={() => scrollToSection("contact")}>Contact</button></li>
        </ul>

        {/* 🍔 Burger Menu (Mobile) */}
        <div className="md:hidden relative w-10 h-10 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {menuOpen ? (
              <motion.button
                key="close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90, transitionEnd: { display: "none" } }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute w-10 h-10 flex items-center justify-center focus:outline-none"
                style={{ color: textColor }}
              >
                {/* ✕ Close Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            ) : (
              <motion.button
                key="burger"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90, transitionEnd: { display: "none" } }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute w-10 h-10 flex items-center justify-center focus:outline-none"
                style={{ color: textColor }}
              >
                {/* ☰ Burger Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m0 6H4" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 📱 Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white/10 mx-6 mt-3 py-4 rounded-xl backdrop-blur-sm"
          >
            <ul
              className="flex flex-col gap-4 text-center text-lg font-medium"
              style={{ color: textColor, transition: "color 0.8s ease-in-out" }}
            >
              <li><button onClick={() => scrollToSection("home")}>Home</button></li>
              <li><button onClick={() => scrollToSection("shop")}>Shop</button></li>
              <li><button onClick={() => scrollToSection("findus")}>Find Us</button></li>
              <li><button onClick={() => scrollToSection("contact")}>Contact</button></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
