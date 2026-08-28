"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, X, Award } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function LevelUpOverlay() {
  const { levelUpOverlay, closeLevelUpOverlay } = useApp();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (levelUpOverlay?.show) {
      setTimeout(() => setAnimate(true), 50);
    } else {
      setAnimate(false);
    }
  }, [levelUpOverlay]);

  if (!levelUpOverlay || !levelUpOverlay.show) return null;

  return (
    <div className="absolute inset-0 bg-[#070518]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all duration-300">
      <div
        className={`bg-white border border-[#c5bae8]/25 rounded-[32px] p-6 text-center max-w-[280px] w-full relative shadow-2xl transition-all duration-500 transform ${
          animate ? "scale-100 translate-y-0 opacity-100" : "scale-75 translate-y-8 opacity-0"
        }`}
      >
        <button
          onClick={closeLevelUpOverlay}
          className="absolute top-4 right-4 text-slate-400 hover:text-[#333136] rounded-full p-1 bg-[#f8f7ff] transition active:scale-95"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#f28f5f]/5 rounded-full blur-xl"></div>

        <div className="relative inline-flex p-3 bg-[#f28f5f]/10 rounded-full border border-[#f28f5f]/20 mb-3.5 animate-bounce">
          <Award className="w-9 h-9 text-[#f28f5f]" />
          <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-spin" />
        </div>

        <h2 className="text-lg font-black text-[#333136] mb-1">Rank Promoted!</h2>
        <p className="text-[#a27cf8] text-[9.5px] mb-4.5 font-black uppercase tracking-wider">Level Up Unlocked</p>

        <div className="flex justify-center items-center gap-3 mb-5">
          <div className="bg-[#f8f7ff] rounded-2xl px-3.5 py-2 border border-[#c5bae8]/20">
            <span className="text-[7.5px] uppercase text-[#635d73] block font-bold">From</span>
            <span className="text-xs font-bold text-[#635d73]">{levelUpOverlay.oldLevel}</span>
          </div>
          <div className="text-md font-bold text-[#f28f5f]">→</div>
          <div className="bg-[#f28f5f]/10 rounded-2xl px-4 py-2 border border-[#f28f5f]/20">
            <span className="text-[7.5px] uppercase text-[#f28f5f] block font-black tracking-wider">Level</span>
            <span className="text-xs font-black text-[#f28f5f]">{levelUpOverlay.newLevel}</span>
          </div>
        </div>

        <div className="bg-[#f2efff] border border-[#a27cf8]/10 rounded-2xl p-3 mb-4 text-center">
          <p className="text-[10px] text-[#a27cf8] font-bold leading-normal">
            {levelUpOverlay.newLevel === 2 && "🎒 Level 2 unlocked: 'Campus Scout'!"}
            {levelUpOverlay.newLevel === 3 && "🏆 Level 3 unlocked: 'Location Guru' (Badge won!)"}
            {levelUpOverlay.newLevel === 4 && "⚡ Level 4 unlocked: 'Genie Associate'!"}
            {levelUpOverlay.newLevel === 5 && "👑 Level 5 unlocked: 'Campus Legend'!"}
          </p>
        </div>

        <button
          onClick={closeLevelUpOverlay}
          className="w-full py-2.5 bg-[#f28f5f] hover:bg-[#e07f4f] text-white font-black rounded-xl shadow-md transition active:scale-95 text-xs uppercase tracking-wider"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
