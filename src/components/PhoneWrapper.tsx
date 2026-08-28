"use client";

import React from "react";

export default function PhoneWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-0 md:p-6 bg-gradient-to-tr from-indigo-100 via-sky-50 to-violet-100 overflow-y-auto">
      {/* Mobile Frame Container (Desktop mockup, responsive on phone) */}
      <div className="w-full h-[100dvh] md:h-[800px] md:max-w-[390px] md:rounded-[40px] md:border-[10px] md:border-slate-800 bg-white shadow-2xl relative overflow-hidden flex flex-col md:ring-1 md:ring-slate-700/10 transition-all duration-300">
        
        {/* Screen Area (Full height flex child, bright background) */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
          {children}
        </div>
        
      </div>
    </div>
  );
}
