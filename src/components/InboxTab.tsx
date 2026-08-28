"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, Send, Image as ImageIcon, MapPin, Search, Bot, MessageSquare, Map, Info } from "lucide-react";
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

  // Group threads by user id that have messages
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

  // Mock share custom image
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
    // Open explorer tab
    setActiveTab("explorer");
    // Open detailed view of that location
    setSelectedLocationIdForExplorer(locId);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-slate-100 bg-slate-900">
      
      {/* 1. THREAD LIST VIEW */}
      {!activeChatUserId ? (
        <div className="flex-1 flex flex-col overflow-y-auto p-5">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              💬 Campus DMs
            </h1>
            <p className="text-xs text-slate-400">Direct private conversations with fellow classmates.</p>
          </div>

          {/* Conversation List */}
          <div className="space-y-2 mt-2">
            {activeThreadKeys.length === 0 ? (
              <div className="text-center py-12 bg-slate-850 border border-dashed border-slate-800 rounded-2xl p-6">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-400">No Active Conversations</h4>
                <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] mx-auto">
                  Find peers on the Community tab and click &quot;Connect&quot; to trigger a chat window!
                </p>
                <button
                  onClick={() => setActiveTab("social")}
                  className="mt-4 px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-xl text-[10px] transition active:scale-95"
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
                    className="bg-slate-850 border border-slate-800 hover:border-slate-750/80 p-3.5 rounded-2xl flex items-center gap-3.5 cursor-pointer transition"
                  >
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs text-slate-200 truncate">{peer.name}</span>
                        <span className="text-[9px] text-slate-500">{lastMsg?.timestamp || "Recent"}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate font-medium">
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
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900">
            {/* Chat header */}
            <div className="bg-slate-850 p-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setActiveChatUserId(null)}
                  className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <img
                  src={activePeer.avatar}
                  alt={activePeer.name}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-xs text-slate-200 truncate">{activePeer.name}</h3>
                  <span className="text-[9px] text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-md">
                    LVL {activePeer.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={scrollRef}>
              {activeThread.length === 0 ? (
                <p className="text-[11px] text-slate-500 text-center py-4">Start the conversation! Direct messages are private.</p>
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
                      {/* Avatar snippet */}
                      {!isMe && (
                        <img
                          src={activePeer.avatar}
                          alt={activePeer.name}
                          className="w-5.5 h-5.5 rounded-md object-cover border border-slate-700 shrink-0 mb-0.5"
                        />
                      )}

                      {/* Msg bubble content */}
                      <div className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed border ${
                        isMe
                          ? "bg-indigo-600 border-indigo-500 text-white rounded-br-xs"
                          : "bg-slate-850 border-slate-800 text-slate-350 rounded-bl-xs"
                      }`}>
                        
                        {/* 1. Standard text */}
                        {msg.text && <p className="whitespace-pre-line">{msg.text}</p>}

                        {/* 2. Image sent */}
                        {msg.imageUrl && (
                          <div className="rounded-lg overflow-hidden border border-slate-700/50 mt-1 max-w-[200px]">
                            <img src={msg.imageUrl} alt="Shared attachment" className="w-full object-cover max-h-48" />
                          </div>
                        )}

                        {/* 3. Location Shared Card */}
                        {msg.sharedLocationId && (
                          (() => {
                            const sharedLoc = locations.find(l => l.id === msg.sharedLocationId);
                            if (!sharedLoc) return null;
                            return (
                              <div
                                onClick={() => handleSharedLocationClick(sharedLoc.id)}
                                className="bg-slate-900 border border-slate-800 hover:border-slate-750/70 p-2.5 rounded-xl mt-1 max-w-[220px] text-left cursor-pointer select-none"
                              >
                                <span className="bg-indigo-500/10 text-indigo-400 text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase mb-1 inline-block">
                                  CAMPUS PIN
                                </span>
                                <h4 className="font-bold text-[11px] text-slate-200 truncate">{sharedLoc.name}</h4>
                                <p className="text-[9px] text-slate-500 truncate mb-2">{sharedLoc.building}</p>
                                
                                <div className="flex items-center justify-between text-[8px] text-indigo-400 font-extrabold uppercase border-t border-slate-800/80 pt-1.5 mt-1.5">
                                  <span>Tap to View Details</span>
                                  <Map className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
                                </div>
                              </div>
                            );
                          })()
                        )}
                        
                        <span className="text-[7.5px] text-slate-500 block text-right mt-1">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Drawer options */}
            {showShareLocationDrawer && (
              <div className="absolute bottom-16 left-4 right-4 bg-slate-950 border border-slate-800 rounded-2xl p-3.5 z-40 shadow-2xl">
                <div className="flex justify-between items-center mb-2.5 border-b border-slate-850 pb-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Share Campus Spot</h4>
                  <button
                    onClick={() => setShowShareLocationDrawer(false)}
                    className="text-[10px] text-slate-500 font-bold"
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto">
                  {locations.filter(l => l.isUnlocked).map(loc => (
                    <button
                      key={loc.id}
                      onClick={() => handleShareLocation(loc.id)}
                      className="bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-xl p-2.5 text-left text-[11px] flex justify-between items-center transition"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-bold text-slate-205 block truncate">{loc.name}</span>
                        <span className="text-[9px] text-slate-500 truncate block">{loc.building}</span>
                      </div>
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    </button>
                  ))}
                  {locations.filter(l => l.isUnlocked).length === 0 && (
                    <p className="text-[10px] text-slate-500 text-center py-3">Scan and unlock a campus location first!</p>
                  )}
                </div>
              </div>
            )}

            {/* Message input footer */}
            <form onSubmit={handleSend} className="p-3 bg-slate-850 border-t border-slate-800 flex gap-2 items-center shrink-0">
              
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
                className="text-slate-400 hover:text-white p-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl transition"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowShareLocationDrawer(!showShareLocationDrawer)}
                className="text-slate-400 hover:text-white p-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl transition"
              >
                <MapPin className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder="Type a private message..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-indigo-600 disabled:bg-slate-800 text-white font-bold p-2.5 rounded-xl transition active:scale-95 shrink-0"
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
