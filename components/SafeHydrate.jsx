"use client";
import { useEffect, useState } from "react";

export default function SafeHydrate({ children }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHydrated(true), 0);
    return () => clearTimeout(t);
  }, []);


  if (!hydrated) {
    // suppressHydrationWarning mencegah React panik saat markup berbeda
    return <div suppressHydrationWarning={true}>{null}</div>;
  }

  return <div suppressHydrationWarning={true}>{children}</div>;
}
