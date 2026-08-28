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

  const hasUnreadMessages = Object.keys(messages).some(key => {
    const thread = messages[key];
    if (thread.length === 0) return false;
    const last = thread[thread.length - 1];
    return last.senderId !== "me" && key === "user_alice"; // mock unread dot
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8f7ff] relative">
      
      {/* Toast Notification Container (Dynamic Island Pill style) */}
      {toastNotification && (
        <div className="absolute top-4 left-4 right-4 z-50 animate-[slideDown_0.3s_ease-out]">
          <div className="bg-white border border-[#a27cf8]/20 text-[#333136] px-4 py-2.5 rounded-full flex items-center justify-center gap-2 shadow-lg backdrop-blur-md max-w-fit mx-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f28f5f] animate-ping"></div>
            <p className="text-[10px] font-black leading-normal tracking-wide uppercase">{toastNotification}</p>
          </div>
        </div>
      )}

      {/* Main Tab Screen Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {renderTabContent()}
      </div>

      {/* BOTTOM TAB NAVIGATION BAR (Pure White with Candied Yam orange active state) */}
      <div className="bg-white/95 backdrop-blur-md border-t border-[#c5bae8]/20 flex items-center justify-around shrink-0 px-3 select-none z-10 pt-2.5 pb-6 md:pb-3 h-auto">
        
        {/* TAB 1: EXPLORER */}
        <button
          onClick={() => setActiveTab("explorer")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${
            activeTab === "explorer" ? "text-[#f28f5f] scale-105" : "text-[#635d73] hover:text-[#333136]"
          }`}
        >
          <Compass className="w-4.5 h-4.5 mb-0.5" />
          <span className="text-[8.5px] font-black tracking-wide">Explorer</span>
        </button>

        {/* TAB 2: COMMUNITY */}
        <button
          onClick={() => setActiveTab("social")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${
            activeTab === "social" ? "text-[#f28f5f] scale-105" : "text-[#635d73] hover:text-[#333136]"
          }`}
        >
          <Users className="w-4.5 h-4.5 mb-0.5" />
          <span className="text-[8.5px] font-black tracking-wide">Campus</span>
        </button>

        {/* TAB 3: GENIE CHATBOT */}
        <button
          onClick={() => setActiveTab("genie")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 relative ${
            activeTab === "genie" ? "text-[#f28f5f] scale-105" : "text-[#635d73] hover:text-[#333136]"
          }`}
        >
          <div className="absolute -top-3 p-1.5 bg-[#f28f5f] rounded-full shadow-md shadow-[#f28f5f]/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-[8.5px] font-black tracking-wide mt-5">Genie</span>
        </button>

        {/* TAB 4: INBOX */}
        <button
          onClick={() => setActiveTab("inbox")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 relative ${
            activeTab === "inbox" ? "text-[#f28f5f] scale-105" : "text-[#635d73] hover:text-[#333136]"
          }`}
        >
          <MessageSquare className="w-4.5 h-4.5 mb-0.5" />
          {hasUnreadMessages && (
            <span className="absolute top-1 right-5.5 w-1.5 h-1.5 rounded-full bg-[#f28f5f] border border-white animate-pulse"></span>
          )}
          <span className="text-[8.5px] font-black tracking-wide">Inbox</span>
        </button>

        {/* TAB 5: PROFILE */}
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${
            activeTab === "profile" ? "text-[#f28f5f] scale-105" : "text-[#635d73] hover:text-[#333136]"
          }`}
        >
          <img
            src={currentUser.avatar}
            alt="My Avatar"
            className={`w-5 h-5 rounded-full object-cover mb-0.5 border ${
              activeTab === "profile" ? "border-[#f28f5f]" : "border-[#c5bae8]/20"
            }`}
          />
          <span className="text-[8.5px] font-black tracking-wide">Profile</span>
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
