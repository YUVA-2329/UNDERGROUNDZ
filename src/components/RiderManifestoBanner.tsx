"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Radio, Volume2, ChevronRight, Pause, Play } from "lucide-react";

export const RIDER_MANIFESTO_LINES = [
  "WHERE THE ROAD ENDS, WE BEGIN.",
  "WHAT BINDS US CANNOT BE SEEN.",
  "THERE'S MORE BEYOND THE ROAD.",
  "TWO WHEELS. ONE HELL OF A STORY.",
  "WHERE ENGINES SPEAK, WORDS DISAPPEAR.",
];

interface RiderManifestoBannerProps {
  variant?: "hero" | "banner" | "compact";
  className?: string;
}

export const RiderManifestoBanner: React.FC<RiderManifestoBannerProps> = ({
  variant = "banner",
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Cycle every 5 seconds (5000ms) with slow, ethereal fade-in and fade-out
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % RIDER_MANIFESTO_LINES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex]);

  const currentLine = RIDER_MANIFESTO_LINES[currentIndex];

  if (variant === "hero") {
    return (
      <div
        className={`w-full relative select-none ${className}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Telemetry Tag */}
        <div className="flex items-center gap-2.5 mb-2.5 font-mono-tech text-xs tracking-[0.25em] uppercase text-[#a8adb3]">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/10 border border-white/20 text-white rounded-none">
            <Radio className="w-3 h-3 text-[#00ff88] animate-pulse" />
            <span>TRANSMISSION [{String(currentIndex + 1).padStart(2, "0")}/05]</span>
          </span>
          <span className="text-white/60 hidden sm:inline">• 5.0S VELOCITY CYCLE</span>
        </div>

        {/* Dynamic Animated Line Container with ultra-smooth slow dissolve (1.0s duration) */}
        <div className="min-h-[85px] sm:min-h-[110px] md:min-h-[130px] flex items-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 6, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(8px)" }}
              transition={{
                duration: 1.0,
                ease: [0.25, 0.1, 0.25, 1.0],
              }}
              className="w-full"
            >
              <h2 className="font-manifesto text-2xl sm:text-4xl md:text-5xl lg:text-[54px] leading-[1.08] text-white uppercase font-extrabold tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
                {currentLine}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 5-Second Smooth Progress Bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="w-52 h-1 bg-white/15 overflow-hidden relative">
            <motion.div
              key={currentIndex}
              initial={{ width: "0%" }}
              animate={{ width: isPaused ? "100%" : "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
            />
          </div>
          <div className="flex gap-1.5">
            {RIDER_MANIFESTO_LINES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex
                    ? "bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                    : "bg-white/30 hover:bg-white/60"
                }`}
                title={`Go to line ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full High-Impact Transmission Ribbon
  return (
    <div
      className={`w-full bg-[#0e0e11] border-y border-[#27272a] relative overflow-hidden py-6 sm:py-7 px-5 md:px-16 select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/5 via-transparent to-white/5 pointer-events-none" />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00ff88] via-white to-transparent" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
        {/* Left Telemetry Header */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-none bg-[#18181c] border border-white/20 flex items-center justify-center text-white shadow-inner">
            <Radio className="w-4 h-4 text-[#00ff88] animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono-tech text-[10px] text-[#00ff88] uppercase tracking-[0.25em] font-bold flex items-center gap-1.5">
              <span>MANIFESTO BROADCAST</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping" />
            </span>
            <span className="font-mono-tech text-xs text-[#8e9192] tracking-wider uppercase">
              CYCLE: 5.0S // [LINE {String(currentIndex + 1).padStart(2, "0")}/05]
            </span>
          </div>
        </div>

        {/* Center Animated Text Display (Ultra-smooth Slow Fade In & Fade Out 5s) */}
        <div className="flex-1 min-h-[54px] sm:min-h-[60px] flex items-center justify-center text-center px-2 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 5, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -5, filter: "blur(8px)" }}
              transition={{
                duration: 1.0,
                ease: [0.25, 0.1, 0.25, 1.0],
              }}
              className="w-full flex items-center justify-center"
            >
              <p className="font-manifesto text-lg sm:text-2xl md:text-3xl text-white font-extrabold uppercase tracking-tight leading-snug drop-shadow-[0_2px_16px_rgba(255,255,255,0.2)]">
                "{currentLine}"
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Controls & Interactive Line Markers */}
        <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
          {/* Audio Equalizer Simulation */}
          <div className="hidden lg:flex items-end gap-1 h-5 px-2">
            {[40, 75, 100, 60, 90, 45, 80].map((h, i) => (
              <motion.span
                key={i}
                animate={{ height: isPaused ? "20%" : [`${h * 0.2}%`, `${h}%`, `${h * 0.4}%`] }}
                transition={{ duration: 1.2 + i * 0.15, repeat: Infinity, ease: "easeInOut" }}
                className="w-0.5 bg-white/70"
              />
            ))}
          </div>

          {/* Line Indicator Buttons */}
          <div className="flex items-center gap-1.5 font-mono-tech text-[10px]">
            {RIDER_MANIFESTO_LINES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`px-2 py-1 transition-all cursor-pointer border ${
                  idx === currentIndex
                    ? "bg-white text-black font-bold border-white shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                    : "bg-[#141418] text-[#737678] border-[#27272a] hover:text-white hover:border-[#444]"
                }`}
                title={`Line ${idx + 1}`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>

          {/* Pause / Play toggle */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 text-[#8e9192] hover:text-white transition-colors cursor-pointer border border-[#27272a] bg-[#141418] hover:border-white"
            title={isPaused ? "Resume 5s cycle" : "Pause on this line"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Synchronized 5-Second Fill Bar at Bottom Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
        <motion.div
          key={currentIndex}
          initial={{ width: "0%" }}
          animate={{ width: isPaused ? "100%" : "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full bg-gradient-to-r from-[#00ff88] via-white to-[#00ff88]"
        />
      </div>
    </div>
  );
};
