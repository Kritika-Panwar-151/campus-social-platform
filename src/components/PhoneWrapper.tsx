"use client";

import React from "react";

export default function PhoneWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#080516] flex items-center justify-center p-0 md:p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#140e3d] via-[#070518] to-black overflow-y-auto">
      {/* Mobile Frame Container (Pinned full viewport on mobile, sleek phone frame on desktop) */}
      <div className="fixed inset-0 md:relative md:w-full md:h-[800px] md:max-w-[#380px] md:rounded-[44px] md:border-[12px] md:border-[#1d1647] bg-[#070518] shadow-[0_0_50px_rgba(139,92,246,0.1)] overflow-hidden flex flex-col transition-all duration-300">
        
        {/* Screen Area (Full height flex child, premium deep dark theme background) */}
        <div className="flex-1 flex flex-col bg-[#070518] overflow-hidden relative">
          {children}
        </div>
        
      </div>
    </div>
  );
}
