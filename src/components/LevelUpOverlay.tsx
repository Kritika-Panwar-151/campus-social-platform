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
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
      <div
        className={`bg-slate-900 border border-amber-500/30 rounded-3xl p-6 text-center max-w-sm w-full relative shadow-2xl transition-all duration-500 transform ${
          animate ? "scale-100 translate-y-0 opacity-100" : "scale-75 translate-y-8 opacity-0"
        }`}
      >
        <button
          onClick={closeLevelUpOverlay}
          className="absolute top-4 right-4 text-slate-400 hover:text-white rounded-full p-1 bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Celebration sparkles */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl animate-pulse"></div>

        <div className="relative inline-flex p-4 bg-amber-500/10 rounded-full border border-amber-500/25 mb-4 animate-bounce">
          <Award className="w-12 h-12 text-amber-400" />
          <Sparkles className="w-6 h-6 text-amber-300 absolute -top-1 -right-1 animate-spin" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">Level Up!</h2>
        <p className="text-slate-400 text-sm mb-4">You have leveled up in your campus journey</p>

        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="bg-slate-800 rounded-2xl px-4 py-2 border border-slate-700">
            <span className="text-[10px] uppercase text-slate-500 block">Level</span>
            <span className="text-xl font-bold text-slate-300">{levelUpOverlay.oldLevel}</span>
          </div>
          <div className="text-2xl font-bold text-amber-500">→</div>
          <div className="bg-amber-500/10 rounded-2xl px-4 py-2 border border-amber-500/30 animate-pulse">
            <span className="text-[10px] uppercase text-amber-500 block font-bold">New Level</span>
            <span className="text-xl font-bold text-amber-400">{levelUpOverlay.newLevel}</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4 text-left">
          <p className="text-xs text-amber-300 font-semibold text-center">
            {levelUpOverlay.newLevel === 2 && "🎒 You've unlocked Level 2: 'Explorer'!"}
            {levelUpOverlay.newLevel === 3 && "🏆 You've unlocked Level 3: 'Campus Guide' (Badge Unlocked!)"}
            {levelUpOverlay.newLevel === 4 && "⚡ You've unlocked Level 4: 'Genie Partner'!"}
            {levelUpOverlay.newLevel === 5 && "👑 You've unlocked Level 5: 'Campus Legend'!"}
          </p>
        </div>

        <button
          onClick={closeLevelUpOverlay}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-xl shadow-lg hover:from-amber-400 hover:to-yellow-400 transition active:scale-95"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
