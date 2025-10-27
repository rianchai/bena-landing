"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useTransform, useScroll, useMotionValueEvent} from "framer-motion";
import Image from "next/image";
import Navbar from "./Navbar";
import Cloud from "./illustrations/Cloud";
import Star from "./illustrations/Star";
import Sun from "./illustrations/Sun";


/* ---------- utils ---------- */
function mixColor(color1, color2, ratio) {
  const hexToRgb = (hex) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const rgbToHex = (r, g, b) =>
    `#${[r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("")}`;
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const mixed = c1.map((c, i) => c + (c2[i] - c) * ratio);
  return rgbToHex(...mixed);
}

const cubic = (a, b, c, d, t) => {
  const mt = 1 - t;
  return mt * mt * mt * a + 3 * mt * mt * t * b + 3 * mt * t * t * c + t * t * t * d;
};

/* ---------- component ---------- */
export default function DayNightGradient() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll();

  /* 🌪 Wind Inertia Logic */
  const [wind, setWind] = useState(1);
  const lastProgress = useRef(0);
  const velocity = useRef(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const delta = v - lastProgress.current;
      velocity.current = delta * 200; // sensitivity multiplier
      const newWind = Math.min(2.5, 1 + Math.abs(velocity.current) * 10);
      setWind((prev) => prev * 0.8 + newWind * 0.2); // smoothing
      lastProgress.current = v;
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  /* 🌈 Sky gradient transition */
  const [scrollRatio, setScrollRatio] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setScrollRatio(v));
    return () => unsub();
  }, [scrollYProgress]);

  const colors = ["#9BE8FF", "#00B8FF", "#FFE75B", "#FFBC4C", "#4A7BFF"];
  const total = colors.length - 1;
  const pos = scrollRatio * total;
  const index = Math.floor(pos);
  const blend = pos - index;
  const colorStart = colors[index];
  const colorEnd = colors[Math.min(index + 1, total)];
  const blendedColor = mixColor(colorStart, colorEnd, blend);
  const nightShade = mixColor(blendedColor, "#001244", 0.3);
  const textColor = scrollRatio > 0.75 ? "text-white" : "text-black";

  /* ☀️ Sun motion path */
  const t = useTransform(scrollYProgress, (v) => Math.max(0, Math.min(1, v)));
  // ☀️ Jalur: kanan atas → kiri bawah (lebih jelas turun)
  const P0 = { x: 88, y: 30 };   // mulai jauh di kanan atas
  const P1 = { x: 60, y: -20 };   // mulai turun ke tengah
  const P2 = { x: 25, y: 70 };   // makin kiri dan bawah
  const P3 = { x: 8,  y: 100 };   // hampir horizon kiri-bawah
  const eased = (v) => Math.pow(v, 1.1); // pelan di akhir
  const sunX = useTransform(t, (v) => `${cubic(P0.x, P1.x, P2.x, P3.x, v)}vw`);
  const sunY = useTransform(t, (v) => `${cubic(P0.y, P1.y, P2.y, P3.y,Math.pow(v, 1.1))}vh`);
  // penuh di awal, pelan hilang mendekati malam
  const sunOpacity = useTransform(t, [0.7, 1], [1, 0]);
  const starOpacity = useTransform(t, [0.6, 1], [0, 1]);
  const cloudOpacity = useTransform(t, [0, 0.8, 1], [1, 0.8, 0.5]);

  useMotionValueEvent(sunX, "change", (latest) => {
    console.log("Sun X:", latest);
  });
  useMotionValueEvent(sunY, "change", (latest) => {
    console.log("Sun Y:", latest);
  });

  return (
    <>
      {/* 🌤️ Wrapper besar tanpa transform */}
      <div className="relative w-full min-h-[300vh] overflow-hidden">
      
        {/* ☁️ Background clouds */}
        <div className="fixed inset-0 z-[5] pointer-events-none">
          <Cloud count={8} opacity={cloudOpacity} scrollYProgress={scrollYProgress} wind={wind} />
        </div>

        {/* 🌅 Main Scene */}
        <section
          ref={sectionRef}
          style={{
            background: `linear-gradient(to bottom, ${blendedColor}, ${nightShade})`,
            transition: "background 0.4s ease-out",
          }}
          className={`relative min-h-[400vh] md:min-h-[350vh] overflow-hidden ${textColor}`} 
        >
          <Navbar />

          {/* ⭐ Parallax Stars */}
          <motion.div
            className="fixed inset-0 pointer-events-none"
            style={{ opacity: starOpacity }}
          >
            <Star count={30} depth={0.3} z={15} /> {/* jauh */}
            <Star count={25} depth={0.6} z={20} /> {/* sedang */}
            <Star count={15} depth={1.0} z={25} /> {/* dekat */}
          </motion.div>


          {/* ☀️ Sun (z-30) */}
          <motion.div
            style={{
              x: sunX,
              y: sunY,
              opacity: sunOpacity,
              scale: useTransform(t, [0.7, 1], [1, 0.8]),
              position: "fixed",
              top: 0,
              left: 0,
            }}
            className="z-[30] pointer-events-none"
          >
            <Sun size={200} spin spinSpeed={18} progress={1} />
          </motion.div>

          {/* 🌤️ Clouds (z-40) */}
          <motion.div
            className="absolute inset-0 z-[40] pointer-events-none"
            style={{
              x: useTransform(t, [0, 0.9, 1], ["60vw", "5vw", "-15vw"]),
              y: "34vh",
              opacity: cloudOpacity,
            }}
          >
            <Cloud count={5} wind={wind} />
          </motion.div>
          
          {/* ================== PAGE SECTIONS ================== */}

          {/* ================== HOME ================== */}
          <section 
            id="home" 
            className="relative z-50 min-h-[100vh] flex flex-col justify-center items-center text-center px-6 scroll-mt-[100px]"
          >
            <h1 className="flex items-center justify-center gap-3 text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 tracking-tight text-[#5B5B5B]">
              Welcome to 
              <Image
                src="/logo.png"
                alt="BENA logo"
                width={120}
                height={50}
                className="inline-block align-middle h-auto w-auto drop-shadow-sm"
                priority
              />
            </h1>

            <p className="max-w-3xl text-[1.1rem] md:text-xl text-[#6A6A6A] font-light leading-relaxed tracking-wide space-y-6">
              <span className="block text-[#767676]">
                In every giggle, every crumb, and every curious glance — 
                there’s a story waiting to be told.
              </span>

              <span className="block font-medium bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
                BENA celebrates these moments through thoughtful designs, 
                made safe for little hands and kind to the world they’ll grow in.
              </span>

              <span className="block text-[#767676]">
                Crafted with care, colored with joy — 
                for the little explorers who make every day a new adventure. 
              </span>
            </p>
          </section>

          {/* ================== SHOP ================== */}
          <section
            id="shop"
            className="relative z-50 min-h-[100vh] flex flex-col justify-center items-center text-center px-6 scroll-mt-[100px]"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 text-[#5B5B5B] tracking-tight">
              Shop
            </h2>

            <p className="max-w-2xl text-[1.1rem] md:text-xl text-[#6A6A6A] font-light leading-relaxed tracking-wide space-y-4">
              <span className="block">
                Discover our playful & premium essentials —{" "}
                <span className="text-[#FFD65E] font-medium">
                  designed for joyful little moments at home and on the go.
                </span>
              </span>

              <span className="block text-[#767676]">
                Lunchboxes, bottles, and toddler bags crafted with care, 
                made safe for little hands and bright imaginations.
              </span>
            </p>

            <a
              href="https://shopee.co.id/benababystore"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-3 px-8 py-3 bg-[#FF6600] hover:bg-[#FF7B1C] text-white font-medium rounded-full transition-all duration-300 ease-out shadow-sm hover:shadow-lg hover:-translate-y-[2px] hover:scale-[1.05]"
            >
              <Image
                src="/utils/Shopee_logo.svg"
                alt="Shopee logo"
                width={24}
                height={24}
                className="inline-block align-middle"
                priority
              />
              Shopee
            </a>
          </section>

          {/* ================== FIND US ================== */}
          <section
            id="findus"
            className="relative z-50 min-h-[100vh] flex flex-col justify-center items-center text-center px-6 scroll-mt-[100px]"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 text-[#5B5B5B] tracking-tight">
              Find Us
            </h2>

            <p className="max-w-2xl text-[1.1rem] md:text-xl text-[#6A6A6A] font-light leading-relaxed tracking-wide space-y-4">
              <span className="block">
                Come join our little world of colors, stories, and laughter.
              </span>

              <span className="block text-[#767676]">
                Follow <span className="font-medium text-[#FFE75B]">BENA</span> on{" "}
                <a
                  href="https://instagram.com/itsbena.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E1306C] font-medium hover:underline"
                >
                  Instagram
                </a>{" "}
                and{" "}
                <a
                  href="https://www.tiktok.com/@itsbena.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#000000] font-medium hover:underline"
                >
                  TikTok
                </a>{" "}
                for daily bits of joy, parenting moments, and playful updates.
              </span>
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <a
                href="https://instagram.com/itsbena.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FD5949] to-[#D6249F] text-white rounded-full font-medium transition-all duration-300 ease-out shadow-sm hover:shadow-lg hover:-translate-y-[2px] hover:scale-[1.05]"
              >
                <Image
                  src="/utils/instagram.svg"
                  alt="Instagram logo"
                  width={22}
                  height={22}
                  className="inline-block align-middle"
                  priority
                />
                Instagram
              </a>

              <a
                href="https://www.tiktok.com/@itsbena.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#010101] hover:bg-[#1A1A1A] text-white rounded-full font-medium transition-all duration-300 ease-out shadow-sm hover:shadow-lg hover:-translate-y-[2px] hover:scale-[1.05]"
              >
                <Image
                  src="/utils/tiktok.svg"
                  alt="TikTok logo"
                  width={22}
                  height={22}
                  className="inline-block align-middle"
                  priority
                />
                TikTok
              </a>
            </div>
          </section>

          {/* ================== CONTACT ================== */}
          <section
            id="contact"
            className="relative z-50 min-h-[100vh] flex flex-col justify-center items-center text-center px-6 scroll-mt-[100px]"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 text-white tracking-tight">
              Contact
            </h2>

            <p className="max-w-2xl text-[1.1rem] md:text-xl text-white/80 font-light leading-relaxed tracking-wide space-y-4">
              <span className="block">
                Let’s create something meaningful together   
                Whether it’s a collaboration, partnership, or simply a friendly hello —
              </span>

              <span className="block text-white/70">
                Reach us anytime on{" "}
                <a
                  href="https://api.whatsapp.com/send/?phone=6285121187870"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] font-medium hover:underline"
                >
                  WhatsApp
                </a>{" "}
                and let’s chat! 
              </span>
            </p>

            <a
              href="https://api.whatsapp.com/send/?phone=6285121187870"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 flex items-center gap-2 px-8 py-3 bg-[#25D366] hover:bg-[#2FE472] text-white rounded-full font-medium transition-all duration-300 ease-out shadow-sm hover:shadow-lg hover:-translate-y-[2px] hover:scale-[1.05]"
            >
              <Image
                src="/utils/whatsapp.svg"
                alt="WhatsApp logo"
                width={24}
                height={24}
                className="inline-block align-middle"
                priority
              />
              Chat on WhatsApp
            </a>
          </section>


        </section>
      </div>
    </>
  );
}
