"use client";

import React, { useEffect, useState } from "react";
import { X, MessageSquare, UserPlus, Check, Award, Calendar, Star } from "lucide-react";
import { useApp } from "../context/AppContext";
import { User } from "../types";

export default function ProfileModal() {
  const {
    selectedUserForModal,
    setSelectedUserForModal,
    connectWithUser,
    setActiveTab
  } = useApp();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (selectedUserForModal) {
      setTimeout(() => setAnimate(true), 50);
    } else {
      setAnimate(false);
    }
  }, [selectedUserForModal]);

  if (!selectedUserForModal) return null;
  const user = selectedUserForModal;

  const handleSendMessage = () => {
    // Open inbox thread
    setActiveTab("inbox");
    // Close modal
    setSelectedUserForModal(null);
  };

  return (
    <div className="absolute inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-end justify-center transition-all duration-300">
      <div
        className={`bg-slate-900 border-t border-slate-800 rounded-t-[32px] w-full max-h-[85%] overflow-y-auto relative shadow-2xl transition-all duration-500 transform ${
          animate ? "translate-y-0 opacity-100" : "translate-y-full opacity-50"
        }`}
      >
        {/* Sticky Drag Handle/Header Area */}
        <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-800 z-10">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-200">Campus Profile</h3>
          </div>
          <button
            onClick={() => setSelectedUserForModal(null)}
            className="text-slate-400 hover:text-white rounded-full p-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Content */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/30"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{user.name}</h2>
              <p className="text-sm text-slate-400 truncate">@{user.username}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  LVL {user.level}
                </span>
                <span className="text-slate-500 text-xs flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {user.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="bg-slate-850 rounded-2xl p-4 border border-slate-800 mb-6">
              <p className="text-sm text-slate-300 leading-relaxed italic">&quot;{user.bio}&quot;</p>
            </div>
          )}

          {/* Interests */}
          {user.interests.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-indigo-400" /> Interests
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {user.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-950/60 text-indigo-300 border border-indigo-500/20 text-xs px-3 py-1 rounded-lg font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {user.skills.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Skills & Tools</h4>
              <div className="flex flex-wrap gap-1.5">
                {user.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-800 text-slate-300 border border-slate-700/50 text-xs px-3 py-1 rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies */}
          {user.hobbies.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hobbies & Leisure</h4>
              <div className="flex flex-wrap gap-1.5">
                {user.hobbies.map((hobby, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-800 text-slate-300 border border-slate-700/50 text-xs px-3 py-1 rounded-lg font-medium"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-8">
            {user.isConnected ? (
              <div className="flex items-center justify-center gap-2 py-3.5 bg-slate-800 border border-slate-700 text-emerald-400 font-bold rounded-2xl text-sm">
                <Check className="w-4 h-4" />
                Connected
              </div>
            ) : (
              <button
                onClick={() => connectWithUser(user.id)}
                className="flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-indigo-600/20 transition active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                Connect
              </button>
            )}

            <button
              onClick={handleSendMessage}
              className="flex items-center justify-center gap-2 py-3.5 bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 font-bold rounded-2xl text-sm transition active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-slate-400" />
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
