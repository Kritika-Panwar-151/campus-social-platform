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
import { Compass, Users, Bot, MessageSquare, User, Sparkles } from "lucide-react";

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

  // Check if there are any messages where the last message isn't read / is active
  const hasUnreadMessages = Object.keys(messages).some(key => {
    const thread = messages[key];
    if (thread.length === 0) return false;
    const last = thread[thread.length - 1];
    return last.senderId !== "me" && key === "user_alice"; // mock unread dot on initial load for Alice
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900 relative">
      
      {/* Toast Notification Container (Bound to phone screen coordinates) */}
      {toastNotification && (
        <div className="absolute top-4 left-4 right-4 z-50 animate-[slideDown_0.3s_ease-out]">
          <div className="bg-slate-950/95 border border-indigo-500/35 text-slate-100 px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xl backdrop-blur-md">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping"></div>
            <p className="text-xs font-bold leading-normal">{toastNotification}</p>
          </div>
        </div>
      )}

      {/* Main Tab Screen Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {renderTabContent()}
      </div>

      {/* BOTTOM TAB NAVIGATION BAR */}
      <div className="h-16 bg-slate-950/95 backdrop-blur-md border-t border-slate-850 flex items-center justify-around shrink-0 px-2 select-none z-10">
        
        {/* TAB 1: EXPLORER */}
        <button
          onClick={() => setActiveTab("explorer")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === "explorer" ? "text-indigo-400 scale-105" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-bold">Explorer</span>
        </button>

        {/* TAB 2: COMMUNITY */}
        <button
          onClick={() => setActiveTab("social")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === "social" ? "text-indigo-400 scale-105" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-bold">Campus</span>
        </button>

        {/* TAB 3: GENIE CHATBOT */}
        <button
          onClick={() => setActiveTab("genie")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
            activeTab === "genie" ? "text-indigo-400 scale-105" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <div className="absolute -top-3 p-2 bg-gradient-to-r from-indigo-650 to-violet-650 border border-indigo-500/25 rounded-full shadow-lg">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-[9px] font-bold mt-5">Genie</span>
        </button>

        {/* TAB 4: INBOX */}
        <button
          onClick={() => setActiveTab("inbox")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
            activeTab === "inbox" ? "text-indigo-400 scale-105" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          {hasUnreadMessages && (
            <span className="absolute top-1 right-5 w-2 h-2 rounded-full bg-indigo-500 border border-slate-950 animate-pulse"></span>
          )}
          <span className="text-[9px] font-bold">Inbox</span>
        </button>

        {/* TAB 5: PROFILE */}
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === "profile" ? "text-indigo-400 scale-105" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <img
            src={currentUser.avatar}
            alt="My Avatar"
            className={`w-5.5 h-5.5 rounded-full object-cover mb-0.5 border ${
              activeTab === "profile" ? "border-indigo-400" : "border-slate-700"
            }`}
          />
          <span className="text-[9px] font-bold">Profile</span>
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
