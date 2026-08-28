"use client";

import React, { useState, useEffect } from "react";
import { Battery, Wifi, Signal } from "lucide-react";

export default function PhoneWrapper({ children }: { children: React.ReactNode }) {
  const [time, setTime] = useState("09:41");

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
      setTime(`${hoursStr}:${minutesStr}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-0 md:p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-slate-950 to-black overflow-y-auto">
      {/* Mobile Frame Container (Desktop mockup, responsive on phone) */}
      <div className="w-full h-screen md:h-[840px] md:max-w-[400px] md:rounded-[40px] md:border-[10px] md:border-slate-850 bg-slate-950 shadow-2xl relative overflow-hidden flex flex-col md:ring-1 md:ring-slate-800 transition-all duration-300">
        
        {/* Notch / Dynamic Island simulation */}
        <div className="hidden md:flex absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ml-auto mr-3 border border-slate-950"></div>
        </div>

        {/* Status Bar */}
        <div className="h-10 bg-slate-950 text-slate-100 px-6 flex items-center justify-between text-xs font-semibold select-none z-45 shrink-0 pt-2">
          <span>{time}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5 fill-current" />
            <span className="text-[10px]">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <Battery className="w-4 h-4 rotate-0" />
            </div>
          </div>
        </div>

        {/* Screen Area (Full height flex child) */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden relative">
          {children}
        </div>

        {/* Home Indicator simulation */}
        <div className="h-5 bg-slate-900 w-full flex items-center justify-center z-45 shrink-0">
          <div className="w-32 h-1 bg-slate-700 rounded-full"></div>
        </div>
        
      </div>
    </div>
  );
}
