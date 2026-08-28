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
    <div className="flex-1 flex flex-col h-full overflow-hidden text-slate-100 bg-[#0c0822]">
      
      {/* 1. THREAD LIST VIEW */}
      {!activeChatUserId ? (
        <div className="flex-1 flex flex-col overflow-y-auto p-4.5">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-lg font-black text-white flex items-center gap-1.5">
              💬 Campus DMs
            </h1>
            <p className="text-[11px] text-[#a59ef5]">Direct private conversations with fellow classmates.</p>
          </div>

          {/* Conversation List */}
          <div className="space-y-2.5 mt-1.5">
            {activeThreadKeys.length === 0 ? (
              <div className="text-center py-10 bg-[#17123a] border border-[#2b2067] rounded-2xl p-6 shadow-sm">
                <MessageSquare className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-300">No Active Conversations</h4>
                <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] mx-auto leading-normal">
                  Find peers on the Campus tab and click &quot;Connect&quot; to trigger a chat window!
                </p>
                <button
                  onClick={() => setActiveTab("social")}
                  className="mt-4 px-4 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold rounded-lg text-[10px] transition active:scale-95 shadow-sm"
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
                    className="bg-[#17123a] border border-[#2b2067] hover:border-[#ec4899]/15 p-3.5 rounded-2xl flex items-center gap-3 cursor-pointer transition shadow-sm"
                  >
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#2b2067] shrink-0"
                    />
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs text-slate-200 truncate">{peer.name}</span>
                        <span className="text-[9px] text-slate-500">{lastMsg?.timestamp || "Recent"}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate font-semibold">
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
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0c0822]">
            {/* Chat header */}
            <div className="bg-[#17123a] p-3.5 border-b border-[#2b2067] flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => setActiveChatUserId(null)}
                  className="text-slate-400 hover:text-white p-1 hover:bg-[#251e5c] rounded-lg transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <img
                  src={activePeer.avatar}
                  alt={activePeer.name}
                  className="w-7 h-7 rounded-lg object-cover border border-[#2b2067] shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-xs text-slate-200 truncate">{activePeer.name}</h3>
                  <span className="text-[8px] text-fuchsia-400 font-extrabold bg-[#ec4899]/10 border border-[#ec4899]/20 px-1.5 py-0.5 rounded-md">
                    LVL {activePeer.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={scrollRef}>
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
                          className="w-5 h-5 rounded-md object-cover border border-[#2b2067] shrink-0 mb-0.5"
                        />
                      )}

                      {/* Msg bubble content */}
                      <div className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed border ${
                        isMe
                          ? "bg-[#8b5cf6] border-[#9b6cff] text-white rounded-br-xs shadow-sm"
                          : "bg-[#17123a] border-[#2b2067] text-slate-300 rounded-bl-xs shadow-xs"
                      }`}>
                        
                        {msg.text && <p className="whitespace-pre-line font-medium">{msg.text}</p>}

                        {msg.imageUrl && (
                          <div className="rounded-lg overflow-hidden border border-[#2c2069] mt-1 max-w-[200px] shadow-sm">
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
                                className="bg-[#0c0822] border border-[#251b5e] hover:border-[#2d226a] p-2.5 rounded-xl mt-1 max-w-[220px] text-left cursor-pointer select-none shadow-xs"
                              >
                                <span className="bg-[#ec4899]/10 text-fuchsia-400 border border-[#ec4899]/20 text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase mb-1 inline-block">
                                  CAMPUS PIN
                                </span>
                                <h4 className="font-bold text-[10px] text-slate-200 truncate">{sharedLoc.name}</h4>
                                <p className="text-[9px] text-slate-500 truncate mb-2">{sharedLoc.building}</p>
                                
                                <div className="flex items-center justify-between text-[8px] text-fuchsia-400 font-extrabold uppercase border-t border-[#251b5e] pt-1.5 mt-1.5">
                                  <span>View Details</span>
                                  <Map className="w-2.5 h-2.5 text-fuchsia-400 shrink-0" />
                                </div>
                              </div>
                            );
                          })()
                        )}
                        
                        <span className={`text-[7.5px] block text-right mt-1.5 ${
                          isMe ? "text-indigo-250" : "text-slate-500"
                        }`}>{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Drawer options (Shared spots drawer) */}
            {showShareLocationDrawer && (
              <div className="absolute bottom-16 left-4 right-4 bg-[#0a071c] border border-[#2b2067] rounded-2xl p-3.5 z-40 shadow-2xl">
                <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-[#211952]">
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Share Spot</h4>
                  <button
                    onClick={() => setShowShareLocationDrawer(false)}
                    className="text-[10px] text-fuchsia-400 font-bold"
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-1 max-h-44 overflow-y-auto">
                  {locations.filter(l => l.isUnlocked).map(loc => (
                    <button
                      key={loc.id}
                      onClick={() => handleShareLocation(loc.id)}
                      className="bg-[#17123a] border border-[#2c2069] hover:border-slate-500 rounded-lg p-2.5 text-left text-[11px] flex justify-between items-center transition shadow-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-bold text-slate-200 block truncate">{loc.name}</span>
                        <span className="text-[9px] text-slate-500 truncate block">{loc.building}</span>
                      </div>
                      <MapPin className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                    </button>
                  ))}
                  {locations.filter(l => l.isUnlocked).length === 0 && (
                    <p className="text-[10px] text-slate-500 text-center py-3">Unlock a campus location first!</p>
                  )}
                </div>
              </div>
            )}

            {/* Message input footer */}
            <form onSubmit={handleSend} className="p-3 bg-[#17123a] border-t border-[#2b2067] flex gap-1.5 items-center shrink-0 shadow-md">
              
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
                className="text-slate-450 hover:text-white p-2.5 bg-[#0c0822] border border-[#251b5e] rounded-xl transition shadow-xs"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowShareLocationDrawer(!showShareLocationDrawer)}
                className="text-slate-455 hover:text-white p-2.5 bg-[#0c0822] border border-[#251b5e] rounded-xl transition shadow-xs"
              >
                <MapPin className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder="Type a message..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 bg-[#0c0822] border border-[#251b5e] text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-fuchsia-500 placeholder:text-slate-550"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-[#8b5cf6] disabled:bg-[#1a1444] disabled:text-slate-500 text-white font-bold p-2.5 rounded-xl transition active:scale-95 shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )
      )}
    </div>
  );
}
