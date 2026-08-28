"use client";

import React from "react";

export default function PhoneWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#130e33] flex items-center justify-center p-0 md:p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d164d] via-[#0b0822] to-black overflow-y-auto">
      {/* Mobile Frame Container (Pinned full viewport on mobile, phone-sized on desktop) */}
      <div className="fixed inset-0 md:relative md:w-full md:h-[800px] md:max-w-[#390px] md:rounded-[40px] md:border-[10px] md:border-[#251e56] bg-[#0c0822] shadow-[0_0_40px_rgba(139,92,246,0.15)] overflow-hidden flex flex-col transition-all duration-300">
        
        {/* Screen Area (Full height flex child, deep game theme background) */}
        <div className="flex-1 flex flex-col bg-[#0c0822] overflow-hidden relative">
          {children}
        </div>
        
      </div>
    </div>
  );
}
