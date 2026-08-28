"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, Sparkles, Send, HelpCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { GENIE_RESPONSES, DEFAULT_GENIE_RESPONSE, GENIE_QUESTIONS } from "../utils/mockData";

interface GenieMessage {
  id: string;
  sender: "user" | "genie";
  text: string;
  timestamp: string;
}

export default function GenieTab() {
  const { incrementGenieCount } = useApp();
  
  const [messages, setMessages] = useState<GenieMessage[]>([
    {
      id: "g_init",
      sender: "genie",
      text: "Hello! I am the **Campus Genie**, your personal guide to building locations, teachers, clubs, schedules, and printing. Ask me anything or select a question below!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleAskQuestion = (question: string) => {
    const userMsg: GenieMessage = {
      id: `g_msg_${Date.now()}`,
      sender: "user",
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    incrementGenieCount(); // Awards XP

    // Genie Reply Logic
    setTimeout(() => {
      const sanitized = question.toLowerCase().trim().replace(/[?.]/g, "");
      let answer = DEFAULT_GENIE_RESPONSE;
      
      const keys = Object.keys(GENIE_RESPONSES);
      const match = keys.find(k => sanitized.includes(k.replace(/[?.]/g, "").toLowerCase()) || k.replace(/[?.]/g, "").toLowerCase().includes(sanitized));
      
      if (match) {
        answer = GENIE_RESPONSES[match];
      }

      const genieMsg: GenieMessage = {
        id: `g_reply_${Date.now()}`,
        sender: "genie",
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, genieMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const txt = inputText;
    setInputText("");
    handleAskQuestion(txt);
  };

  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="text-fuchsia-350 font-extrabold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-slate-100 bg-[#0c0822]">
      
      {/* Header (Deep purple) */}
      <div className="bg-[#17123a] p-3.5 border-b border-[#2b2067] flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-950/70 border border-[#3d2f9b] rounded-xl">
            <Bot className="w-5 h-5 text-[#a59ef5]" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white">Campus Genie</h1>
            <p className="text-[10px] text-slate-400">AI Assistant • Online</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-[#ec4899]/15 border border-[#ec4899]/30 px-2.5 py-1 rounded-full shadow-xs">
          <Sparkles className="w-3 h-3 text-fuchsia-400" />
          <span className="text-[9px] text-[#f472b6] font-black">+10 XP</span>
        </div>
      </div>

      {/* Chat scroll view */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 max-w-[85%] ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Avatar */}
            <div className={`p-1.5 rounded-lg shrink-0 border ${
              msg.sender === "user" 
                ? "bg-[#17123a] border-[#2b2067]" 
                : "bg-indigo-950/70 border border-[#3d2f9b]"
            }`}>
              {msg.sender === "user" ? (
                <span className="text-[9px] font-black text-slate-350">ME</span>
              ) : (
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
              )}
            </div>

            {/* Bubble */}
            <div className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed border ${
              msg.sender === "user"
                ? "bg-[#8b5cf6] border-[#9b6cff] text-white rounded-tr-xs shadow-sm"
                : "bg-[#17123a] border-[#2b2067] text-slate-300 rounded-tl-xs shadow-xs"
            }`}>
              <div className="whitespace-pre-line font-medium">
                {formatText(msg.text)}
              </div>
              <span className={`text-[7.5px] block text-right mt-1.5 ${
                msg.sender === "user" ? "text-indigo-200" : "text-slate-500"
              }`}>{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2.5 max-w-[80%] mr-auto">
            <div className="p-1.5 bg-indigo-950/70 border border-[#3d2f9b] rounded-lg shrink-0">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="bg-[#17123a] border border-[#2b2067] rounded-2xl rounded-tl-xs px-3.5 py-2.5 flex items-center gap-1 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      <div className="p-3 bg-[#0a071c] border-t border-[#1a1444]/60 shrink-0">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-fuchsia-400" /> Frequently Asked
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {GENIE_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(q)}
              disabled={isTyping}
              className="bg-[#17123a] border border-[#2c2069] hover:border-slate-500 disabled:opacity-50 text-[10px] text-slate-200 font-bold px-3 py-1.5 rounded-xl shrink-0 transition active:scale-95 shadow-xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input Footer */}
      <form onSubmit={handleSend} className="p-3 bg-[#17123a] border-t border-[#2b2067] flex gap-2 shrink-0 shadow-md">
        <input
          type="text"
          placeholder="Ask Genie campus details..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          disabled={isTyping}
          className="flex-1 bg-[#0c0822] border border-[#251b5e] text-xs text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-fuchsia-500 placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="bg-[#8b5cf6] disabled:bg-[#1a1444] disabled:text-slate-500 text-white font-bold p-2.5 rounded-xl transition active:scale-95 shrink-0 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
