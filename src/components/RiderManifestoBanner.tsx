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

  // Cycle every 10 seconds (10000ms) with ultra-smooth cinematic fade-in
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % RIDER_MANIFESTO_LINES.length);
    }, 10000);

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
        {/* Editorial Subtitle Tag */}
        <div className="flex items-center gap-3 mb-3 font-body text-xs tracking-wider uppercase text-[#9c9ca8]">
          <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/15 text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9e1b24]" />
            <span className="font-semibold text-[11px] tracking-widest">MANIFESTO [{String(currentIndex + 1).padStart(2, "0")}/05]</span>
          </span>
          <span className="text-[#71717a] hidden sm:inline tracking-widest text-[11px]">10.0S INTERVAL</span>
        </div>

        {/* Dynamic Animated Line Container with the smoothest cinematic blur & fade-in */}
        <div className="min-h-[75px] sm:min-h-[95px] md:min-h-[115px] flex items-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
              transition={{
                duration: 1.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full"
            >
              <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-[62px] leading-[1.02] text-white uppercase font-bold tracking-tight">
                {currentLine}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 10-Second Minimal Progress Bar */}
        <div className="mt-4 flex items-center gap-4">
          <div className="w-48 h-[2px] bg-white/10 overflow-hidden relative">
            <motion.div
              key={currentIndex}
              initial={{ width: "0%" }}
              animate={{ width: isPaused ? "100%" : "100%" }}
              transition={{ duration: 10, ease: "linear" }}
              className="h-full bg-white"
            />
          </div>
          <div className="flex gap-1.5">
            {RIDER_MANIFESTO_LINES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex
                    ? "bg-white scale-125"
                    : "bg-white/20 hover:bg-white/50"
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
      className={`w-full bg-[#08080a] border-y border-[#202026] relative overflow-hidden py-7 sm:py-8 px-5 md:px-16 select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        {/* Left Editorial Header */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="w-8 h-8 rounded-none bg-[#141418] border border-white/15 flex items-center justify-center text-white">
            <Radio className="w-4 h-4 text-[#9e1b24]" />
          </div>
          <div className="flex flex-col">
            <span className="font-body text-[11px] text-white uppercase tracking-widest font-semibold flex items-center gap-2">
              <span>RIDER STATEMENT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#9e1b24]" />
            </span>
            <span className="font-body text-[11px] text-[#71717a] tracking-wider uppercase">
              ARCHIVE // 0{currentIndex + 1} OF 05
            </span>
          </div>
        </div>

        {/* Center Animated Text Display */}
        <div className="flex-1 min-h-[50px] sm:min-h-[56px] flex items-center justify-center text-center px-2 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
              transition={{
                duration: 1.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full flex items-center justify-center"
            >
              <p className="font-display text-2xl sm:text-3xl md:text-4xl text-white font-bold uppercase tracking-tight leading-snug">
                "{currentLine}"
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Controls & Interactive Line Markers */}
        <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
          {/* Line Indicator Buttons */}
          <div className="flex items-center gap-1 font-body text-xs">
            {RIDER_MANIFESTO_LINES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`px-2.5 py-1 text-[11px] transition-all cursor-pointer border ${
                  idx === currentIndex
                    ? "bg-white text-black font-semibold border-white"
                    : "bg-[#101014] text-[#8e8e98] border-[#22222a] hover:text-white hover:border-[#444]"
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
            className="p-2 text-[#9c9ca8] hover:text-white transition-colors cursor-pointer border border-[#22222a] bg-[#101014] hover:border-white"
            title={isPaused ? "Resume 10s cycle" : "Pause on this line"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Synchronized 10-Second Fill Bar at Bottom Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10">
        <motion.div
          key={currentIndex}
          initial={{ width: "0%" }}
          animate={{ width: isPaused ? "100%" : "100%" }}
          transition={{ duration: 10, ease: "linear" }}
          className="h-full bg-white/80"
        />
      </div>
    </div>
  );
};
