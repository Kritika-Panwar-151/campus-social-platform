"use client";

import React from "react";
import { AppProvider, useApp } from "../context/AppContext";
import PhoneWrapper from "../components/PhoneWrapper";
import ExplorerTab from "../components/ExplorerTab";
import CommunityTab from "../components/CommunityTab";
import GenieTab from "../components/GenieTab";
import InboxTab from "../components/InboxTab";
import ProfileTab from "../components/ProfileTab";
import ProfileModal from "../components/ProfileModal";
import LevelUpOverlay from "../components/LevelUpOverlay";
import { Compass, Users, MessageSquare, Sparkles } from "lucide-react";

function CampusAppContent() {
  const {
    activeTab,
    setActiveTab,
    toastNotification,
    currentUser,
    messages
  } = useApp();

  // Helper to render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "explorer":
        return <ExplorerTab />;
      case "social":
        return <CommunityTab />;
      case "genie":
        return <GenieTab />;
      case "inbox":
        return <InboxTab />;
      case "profile":
        return <ProfileTab />;
      default:
        return <ProfileTab />;
    }
  };

  // Check if there are any messages where the last message isn't read
  const hasUnreadMessages = Object.keys(messages).some(key => {
    const thread = messages[key];
    if (thread.length === 0) return false;
    const last = thread[thread.length - 1];
    return last.senderId !== "me" && key === "user_alice"; // mock unread dot on initial load for Alice
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#070518] relative">
      
      {/* Toast Notification Container (Bound to phone screen coordinates, sleek pill style) */}
      {toastNotification && (
        <div className="absolute top-4 left-4 right-4 z-50 animate-[slideDown_0.3s_ease-out]">
          <div className="bg-[#120e2e]/95 border border-[#2b2067] text-white px-4 py-2.5 rounded-full flex items-center justify-center gap-2 shadow-2xl backdrop-blur-md max-w-fit mx-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-ping"></div>
            <p className="text-[10px] font-bold leading-normal tracking-wide">{toastNotification}</p>
          </div>
        </div>
      )}

      {/* Main Tab Screen Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {renderTabContent()}
      </div>

      {/* BOTTOM TAB NAVIGATION BAR (Sleek dark violet with soft violet active state) */}
      <div className="bg-[#070518]/95 backdrop-blur-md border-t border-[#1b1548]/40 flex items-center justify-around shrink-0 px-3 select-none z-10 pt-2 pb-6 md:pb-3 h-auto">
        
        {/* TAB 1: EXPLORER */}
        <button
          onClick={() => setActiveTab("explorer")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${
            activeTab === "explorer" ? "text-fuchsia-400 scale-105" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <Compass className="w-4.5 h-4.5 mb-0.5" />
          <span className="text-[8.5px] font-bold tracking-wide">Explorer</span>
        </button>

        {/* TAB 2: COMMUNITY */}
        <button
          onClick={() => setActiveTab("social")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${
            activeTab === "social" ? "text-fuchsia-400 scale-105" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <Users className="w-4.5 h-4.5 mb-0.5" />
          <span className="text-[8.5px] font-bold tracking-wide">Campus</span>
        </button>

        {/* TAB 3: GENIE CHATBOT */}
        <button
          onClick={() => setActiveTab("genie")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 relative ${
            activeTab === "genie" ? "text-fuchsia-400 scale-105" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <div className="absolute -top-3 p-1.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full shadow-lg shadow-fuchsia-500/10">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-[8.5px] font-bold tracking-wide mt-5">Genie</span>
        </button>

        {/* TAB 4: INBOX */}
        <button
          onClick={() => setActiveTab("inbox")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 relative ${
            activeTab === "inbox" ? "text-fuchsia-400 scale-105" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <MessageSquare className="w-4.5 h-4.5 mb-0.5" />
          {hasUnreadMessages && (
            <span className="absolute top-1 right-5.5 w-1.5 h-1.5 rounded-full bg-fuchsia-500 border border-[#070518] animate-pulse"></span>
          )}
          <span className="text-[8.5px] font-bold tracking-wide">Inbox</span>
        </button>

        {/* TAB 5: PROFILE */}
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${
            activeTab === "profile" ? "text-fuchsia-400 scale-105" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <img
            src={currentUser.avatar}
            alt="My Avatar"
            className={`w-5 h-5 rounded-full object-cover mb-0.5 border ${
              activeTab === "profile" ? "border-fuchsia-500" : "border-[#1b1548]/40"
            }`}
          />
          <span className="text-[8.5px] font-bold tracking-wide">Profile</span>
        </button>

      </div>

      {/* OVERLAY MODALS & INTERMEDIATES */}
      <ProfileModal />
      <LevelUpOverlay />

    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <PhoneWrapper>
        <CampusAppContent />
      </PhoneWrapper>
    </AppProvider>
  );
}
