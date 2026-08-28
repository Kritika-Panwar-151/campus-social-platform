"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, Send, Image as ImageIcon, MapPin, MessageSquare, Map } from "lucide-react";
import { useApp } from "../context/AppContext";
import { User, Message } from "../types";

export default function InboxTab() {
  const {
    users,
    messages,
    sendMessage,
    locations,
    setSelectedLocationIdForExplorer,
    setActiveTab
  } = useApp();

  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [showShareLocationDrawer, setShowShareLocationDrawer] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Custom mock image file selector
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll inside active chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChatUserId, messages]);

  const activePeer = users.find(u => u.id === activeChatUserId);
  const activeThread = activeChatUserId ? (messages[activeChatUserId] || []) : [];

  const activeThreadKeys = Object.keys(messages);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatUserId) return;
    sendMessage(activeChatUserId, inputText);
    setInputText("");
  };

  const handleShareLocation = (locId: string) => {
    if (!activeChatUserId) return;
    sendMessage(activeChatUserId, "", undefined, locId);
    setShowShareLocationDrawer(false);
  };

  const handleImageSend = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeChatUserId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        sendMessage(activeChatUserId, "", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSharedLocationClick = (locId: string) => {
    setActiveTab("explorer");
    setSelectedLocationIdForExplorer(locId);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-[#333136] bg-[#f8f7ff]">
      
      {/* 1. THREAD LIST VIEW */}
      {!activeChatUserId ? (
        <div className="flex-1 flex flex-col overflow-y-auto p-4.5 scrollbar-none">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-lg font-black text-[#333136] tracking-wide">
              💬 Inbox
            </h1>
            <p className="text-[10px] text-[#635d73] font-bold">Direct messages with classmates.</p>
          </div>

          {/* Conversation List */}
          <div className="space-y-2.5 mt-2">
            {activeThreadKeys.length === 0 ? (
              <div className="text-center py-10 bg-white border border-[#c5bae8]/20 rounded-[32px] p-6 shadow-xs">
                <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-[#333136]">No Conversations</h4>
                <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] mx-auto leading-normal">
                  Find peers on the Campus tab and click &quot;Connect&quot; to start chatting!
                </p>
                <button
                  onClick={() => setActiveTab("social")}
                  className="mt-4 px-4 py-2 bg-[#f28f5f] hover:bg-[#e07f4f] text-white font-black rounded-xl text-[10px] uppercase tracking-wider transition active:scale-95 shadow-sm"
                >
                  Find Students
                </button>
              </div>
            ) : (
              activeThreadKeys.map(key => {
                const peer = users.find(u => u.id === key);
                if (!peer) return null;
                const thread = messages[key];
                const lastMsg = thread[thread.length - 1];
                let summaryText = "...";
                if (lastMsg) {
                  if (lastMsg.text) summaryText = lastMsg.text;
                  else if (lastMsg.imageUrl) summaryText = "📸 Sent an image";
                  else if (lastMsg.sharedLocationId) summaryText = "📍 Shared a campus location";
                }

                return (
                  <div
                    key={key}
                    onClick={() => setActiveChatUserId(key)}
                    className="bg-white border border-[#c5bae8]/10 hover:border-[#a27cf8]/20 p-3.5 rounded-[24px] flex items-center gap-3.5 cursor-pointer transition shadow-xs"
                  >
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#c5bae8]/20 shrink-0"
                    />
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs text-[#333136] truncate">{peer.name}</span>
                        <span className="text-[9px] text-[#635d73] font-bold">{lastMsg?.timestamp || "Recent"}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate font-semibold">
                        {summaryText}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        
        /* 2. ACTIVE CHAT DIALOG */
        activePeer && (
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8f7ff]">
            {/* Chat header */}
            <div className="bg-white p-3 border-b border-[#c5bae8]/20 flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => setActiveChatUserId(null)}
                  className="text-slate-450 hover:text-[#333136] p-1 hover:bg-[#f2efff] rounded-lg transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <img
                  src={activePeer.avatar}
                  alt={activePeer.name}
                  className="w-7 h-7 rounded-lg object-cover border border-[#c5bae8]/20 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-xs text-[#333136] truncate">{activePeer.name}</h3>
                  <span className="text-[8px] text-[#f28f5f] font-black bg-[#f28f5f]/10 border border-[#f28f5f]/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                    LVL {activePeer.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none" ref={scrollRef}>
              {activeThread.length === 0 ? (
                <p className="text-[10px] text-slate-500 text-center py-4">Direct messages are private.</p>
              ) : (
                activeThread.map(msg => {
                  const isMe = msg.senderId === "me";
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 max-w-[80%] ${
                        isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                      }`}
                    >
                      {!isMe && (
                        <img
                          src={activePeer.avatar}
                          alt={activePeer.name}
                          className="w-5 h-5 rounded-md object-cover border border-[#c5bae8]/20 shrink-0 mb-0.5"
                        />
                      )}

                      {/* Msg bubble content */}
                      <div className={`rounded-[20px] px-3.5 py-2 text-xs leading-relaxed border ${
                        isMe
                          ? "bg-[#a27cf8] border-[#a27cf8] text-white rounded-br-none shadow-xs"
                          : "bg-white border-[#c5bae8]/20 text-slate-700 rounded-tl-none shadow-xs"
                      }`}>
                        
                        {msg.text && <p className="whitespace-pre-line font-bold">{msg.text}</p>}

                        {msg.imageUrl && (
                          <div className="rounded-lg overflow-hidden border border-[#c5bae8]/20 mt-1 max-w-[200px] shadow-sm">
                            <img src={msg.imageUrl} alt="Shared attachment" className="w-full object-cover max-h-48" />
                          </div>
                        )}

                        {msg.sharedLocationId && (
                          (() => {
                            const sharedLoc = locations.find(l => l.id === msg.sharedLocationId);
                            if (!sharedLoc) return null;
                            return (
                              <div
                                onClick={() => handleSharedLocationClick(sharedLoc.id)}
                                className="bg-[#f8f7ff] border border-[#a27cf8]/20 hover:border-[#f28f5f]/30 p-2.5 rounded-xl mt-1 max-w-[220px] text-left cursor-pointer select-none shadow-xs"
                              >
                                <span className="bg-[#f28f5f]/10 text-[#f28f5f] border border-[#f28f5f]/20 text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase mb-1 inline-block">
                                  CAMPUS PIN
                                </span>
                                <h4 className="font-bold text-[10px] text-[#333136] truncate">{sharedLoc.name}</h4>
                                <p className="text-[9px] text-[#635d73] truncate mb-2">{sharedLoc.building}</p>
                                
                                <div className="flex items-center justify-between text-[8px] text-[#f28f5f] font-black uppercase border-t border-[#c5bae8]/25 pt-1.5 mt-1.5">
                                  <span>View Sights</span>
                                  <Map className="w-2.5 h-2.5 text-[#f28f5f] shrink-0" />
                                </div>
                              </div>
                            );
                          })()
                        )}
                        
                        <span className={`text-[7px] block text-right mt-1 ${
                          isMe ? "text-indigo-100" : "text-slate-500"
                        }`}>{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Drawer options */}
            {showShareLocationDrawer && (
              <div className="absolute bottom-16 left-4 right-4 bg-white border border-[#c5bae8]/35 rounded-[24px] p-3.5 z-40 shadow-2xl">
                <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-slate-100">
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Share Spot</h4>
                  <button
                    onClick={() => setShowShareLocationDrawer(false)}
                    className="text-[10px] text-[#f28f5f] font-bold"
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-1 max-h-44 overflow-y-auto">
                  {locations.filter(l => l.isUnlocked).map(loc => (
                    <button
                      key={loc.id}
                      onClick={() => handleShareLocation(loc.id)}
                      className="bg-[#f8f7ff] border border-[#c5bae8]/10 hover:border-slate-400 rounded-lg p-2.5 text-left text-[11px] flex justify-between items-center transition shadow-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-bold text-slate-800 block truncate">{loc.name}</span>
                        <span className="text-[9px] text-[#635d73] truncate block">{loc.building}</span>
                      </div>
                      <MapPin className="w-3.5 h-3.5 text-[#f28f5f] shrink-0" />
                    </button>
                  ))}
                  {locations.filter(l => l.isUnlocked).length === 0 && (
                    <p className="text-[10px] text-slate-500 text-center py-3">Unlock a campus location first!</p>
                  )}
                </div>
              </div>
            )}

            {/* Message input footer */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#c5bae8]/20 flex gap-1.5 items-center shrink-0 shadow-md">
              
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageSend}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#635d73] hover:text-[#333136] p-2.5 bg-[#f8f7ff] border border-[#c5bae8]/20 rounded-xl transition shadow-xs"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowShareLocationDrawer(!showShareLocationDrawer)}
                className="text-[#635d73] hover:text-[#333136] p-2.5 bg-[#f8f7ff] border border-[#c5bae8]/20 rounded-xl transition shadow-xs"
              >
                <MapPin className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder="Type a message..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 bg-[#f8f7ff] border border-[#c5bae8]/20 text-xs text-[#333136] rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-[#f28f5f] placeholder:text-slate-450"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-[#f28f5f] disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold p-2 rounded-xl transition active:scale-95 shrink-0 shadow-sm"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>
        )
      )}
    </div>
  );
}
