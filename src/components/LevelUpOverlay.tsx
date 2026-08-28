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
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all duration-300">
      <div
        className={`bg-white border border-amber-400 rounded-3xl p-6 text-center max-w-[280px] w-full relative shadow-2xl transition-all duration-500 transform ${
          animate ? "scale-100 translate-y-0 opacity-100" : "scale-75 translate-y-8 opacity-0"
        }`}
      >
        <button
          onClick={closeLevelUpOverlay}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-full p-1 bg-slate-100 transition active:scale-95"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-amber-500/10 rounded-full blur-xl"></div>

        <div className="relative inline-flex p-3 bg-amber-50 rounded-full border border-amber-250 mb-3 animate-bounce">
          <Award className="w-10 h-10 text-amber-550" />
          <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1 animate-spin" />
        </div>

        <h2 className="text-xl font-black text-slate-800 mb-1">Level Up!</h2>
        <p className="text-slate-500 text-[10px] mb-4 font-semibold">You unlocked a new rank on campus!</p>

        <div className="flex justify-center items-center gap-3 mb-5">
          <div className="bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-205">
            <span className="text-[8px] uppercase text-slate-400 block font-bold">From</span>
            <span className="text-base font-bold text-slate-700">{levelUpOverlay.oldLevel}</span>
          </div>
          <div className="text-xl font-bold text-amber-500">→</div>
          <div className="bg-amber-50 rounded-xl px-3 py-1.5 border border-amber-200">
            <span className="text-[8px] uppercase text-amber-600 block font-extrabold">New Rank</span>
            <span className="text-base font-bold text-amber-550">{levelUpOverlay.newLevel}</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 mb-4 text-left shadow-xs">
          <p className="text-[10px] text-amber-800 font-extrabold text-center leading-normal">
            {levelUpOverlay.newLevel === 2 && "🎒 Level 2 unlocked: 'Campus Scout'!"}
            {levelUpOverlay.newLevel === 3 && "🏆 Level 3 unlocked: 'Location Guru' (Badge won!)"}
            {levelUpOverlay.newLevel === 4 && "⚡ Level 4 unlocked: 'Genie Associate'!"}
            {levelUpOverlay.newLevel === 5 && "👑 Level 5 unlocked: 'Campus Legend'!"}
          </p>
        </div>

        <button
          onClick={closeLevelUpOverlay}
          className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold rounded-xl shadow-md transition active:scale-95 text-xs"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
