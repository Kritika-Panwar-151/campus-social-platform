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
        return <strong key={index} className="text-[#f28f5f] font-black">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-[#333136] bg-[#f8f7ff]">
      
      {/* Header */}
      <div className="bg-white p-3.5 border-b border-[#c5bae8]/20 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#f2efff] border border-[#a27cf8]/10 rounded-xl">
            <Bot className="w-5 h-5 text-[#a27cf8]" />
          </div>
          <div>
            <h1 className="text-sm font-black text-[#333136]">Genie</h1>
            <p className="text-[9px] text-[#635d73] font-bold">Campus AI Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-[#f28f5f]/10 border border-[#f28f5f]/20 px-2.5 py-1 rounded-full shadow-xs">
          <Sparkles className="w-3 h-3 text-[#f28f5f] animate-pulse" />
          <span className="text-[9px] text-[#f28f5f] font-black">+10 XP</span>
        </div>
      </div>

      {/* Chat scroll view */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none" ref={scrollRef}>
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
                ? "bg-white border-[#c5bae8]/20" 
                : "bg-[#f2efff] border border-[#a27cf8]/15"
            }`}>
              {msg.sender === "user" ? (
                <span className="text-[9px] font-black text-[#f28f5f]">ME</span>
              ) : (
                <Bot className="w-3.5 h-3.5 text-[#a27cf8]" />
              )}
            </div>

            {/* Bubble */}
            <div className={`rounded-[20px] px-3.5 py-2.5 text-xs leading-relaxed border ${
              msg.sender === "user"
                ? "bg-[#a27cf8] border-[#a27cf8] text-white rounded-tr-none shadow-xs"
                : "bg-white border-[#c5bae8]/20 text-[#333136] rounded-tl-none shadow-xs"
            }`}>
              <div className="whitespace-pre-line font-bold leading-relaxed text-slate-700">
                {formatText(msg.text)}
              </div>
              <span className={`text-[7.5px] block text-right mt-1.5 ${
                msg.sender === "user" ? "text-indigo-100" : "text-[#635d73]"
              }`}>{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2.5 max-w-[80%] mr-auto">
            <div className="p-1.5 bg-[#f2efff] border border-[#a27cf8]/15 rounded-lg shrink-0">
              <Bot className="w-3.5 h-3.5 text-[#a27cf8]" />
            </div>
            <div className="bg-white border border-[#c5bae8]/20 rounded-2xl rounded-tl-none px-3.5 py-2.5 flex items-center gap-1 shadow-xs">
              <span className="w-1.2 h-1.2 rounded-full bg-[#f28f5f] animate-bounce"></span>
              <span className="w-1.2 h-1.2 rounded-full bg-[#f28f5f] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.2 h-1.2 rounded-full bg-[#f28f5f] animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      <div className="p-3 bg-white border-t border-[#c5bae8]/15 shrink-0 shadow-sm">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-[#f28f5f]" /> Frequently Asked
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {GENIE_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(q)}
              disabled={isTyping}
              className="bg-[#f2efff] border border-[#a27cf8]/10 hover:border-[#a27cf8]/45 disabled:opacity-50 text-[10px] text-[#635d73] font-bold px-3.5 py-2 rounded-xl shrink-0 transition active:scale-95 shadow-xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input Footer */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#c5bae8]/20 flex gap-2 shrink-0 shadow-md">
        <input
          type="text"
          placeholder="Ask Genie campus details..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          disabled={isTyping}
          className="flex-1 bg-[#f8f7ff] border border-[#c5bae8]/20 text-xs text-[#333136] rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-[#f28f5f] placeholder:text-slate-405"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="bg-[#f28f5f] hover:bg-[#e07f4f] disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold p-2.5 rounded-xl transition active:scale-95 shrink-0 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
