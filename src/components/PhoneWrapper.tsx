"use client";

import React from "react";

export default function PhoneWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#e8e4fc] flex items-center justify-center p-0 md:p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ded6fb] via-[#e9e6fd] to-white overflow-y-auto">
      {/* Mobile Frame Container (Pinned full viewport on mobile, sleek phone frame on desktop) */}
      <div className="fixed inset-0 md:relative md:w-full md:h-[800px] md:max-w-[#380px] md:rounded-[44px] md:border-[12px] md:border-[#c5bae8]/60 bg-[#f8f7ff] shadow-[0_15px_40px_rgba(162,124,248,0.15)] overflow-hidden flex flex-col transition-all duration-300">
        
        {/* Screen Area (Full height flex child, premium Ermine White theme background) */}
        <div className="flex-1 flex flex-col bg-[#f8f7ff] overflow-hidden relative">
          {children}
        </div>
        
      </div>
    </div>
  );
}
