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
    // Scroll to bottom on message updates
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
    incrementGenieCount(); // Awards XP, unlocks badge if >= 3

    // Genie Reply Logic
    setTimeout(() => {
      const sanitized = question.toLowerCase().trim().replace(/[?.]/g, "");
      let answer = DEFAULT_GENIE_RESPONSE;
      
      // Match lookup in dictionary keys
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

  // Convert markdown-like double stars to standard HTML bolding
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="text-white font-extrabold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-slate-100 bg-slate-900">
      
      {/* Header */}
      <div className="bg-slate-850 p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-md font-black text-white">Campus Genie</h1>
            <p className="text-[10px] text-slate-400">AI Assistant • Online</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
          <span className="text-[10px] text-indigo-400 font-extrabold">+10 XP/Ask</span>
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
            <div className={`p-1.5 rounded-lg shrink-0 ${
              msg.sender === "user" 
                ? "bg-slate-800 border border-slate-700" 
                : "bg-indigo-600/20 border border-indigo-500/30"
            }`}>
              {msg.sender === "user" ? (
                <span className="text-[10px] font-black text-slate-300">ME</span>
              ) : (
                <Bot className="w-4 h-4 text-indigo-400" />
              )}
            </div>

            {/* Bubble */}
            <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed border ${
              msg.sender === "user"
                ? "bg-indigo-600 border-indigo-500 text-white rounded-tr-xs"
                : "bg-slate-850 border-slate-800 text-slate-300 rounded-tl-xs"
            }`}>
              <div className="whitespace-pre-line">
                {formatText(msg.text)}
              </div>
              <span className="text-[8px] text-slate-500 block text-right mt-1.5">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2.5 max-w-[80%] mr-auto">
            <div className="p-1.5 bg-indigo-600/20 border border-indigo-500/30 rounded-lg shrink-0">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="bg-slate-850 border border-slate-800 rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      <div className="p-3 bg-slate-900 border-t border-slate-850 shrink-0">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> Frequently Asked Questions
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {GENIE_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(q)}
              disabled={isTyping}
              className="bg-slate-850 border border-slate-800 hover:border-slate-700 disabled:opacity-50 text-[10px] text-slate-300 font-medium px-3.5 py-2 rounded-xl shrink-0 transition active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input Footer */}
      <form onSubmit={handleSend} className="p-3 bg-slate-850 border-t border-slate-800 flex gap-2 shrink-0">
        <input
          type="text"
          placeholder="Ask Genie about faculty, events, classrooms..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          disabled={isTyping}
          className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-3 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="bg-indigo-600 disabled:bg-slate-800 text-white font-bold p-3 rounded-xl transition active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
