"use client";

import React, { useEffect, useState } from "react";
import { X, UserPlus, Check, Award, Calendar, Star } from "lucide-react";
import { useApp } from "../context/AppContext";

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
    setActiveTab("inbox");
    setSelectedUserForModal(null);
  };

  return (
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end justify-center transition-all duration-300">
      <div
        className={`bg-white border-t border-slate-200 rounded-t-[32px] w-full max-h-[85%] overflow-y-auto relative shadow-2xl transition-all duration-500 transform ${
          animate ? "translate-y-0 opacity-100" : "translate-y-full opacity-50"
        }`}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-3.5 flex items-center justify-between border-b border-slate-100 z-10">
          <div className="flex items-center gap-1.5">
            <Award className="w-4.5 h-4.5 text-indigo-600" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">Campus Profile</h3>
          </div>
          <button
            onClick={() => setSelectedUserForModal(null)}
            className="text-slate-400 hover:text-slate-650 rounded-full p-1.5 bg-slate-100 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Content */}
        <div className="p-5">
          <div className="flex items-start gap-4 mb-5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-black text-slate-800 truncate leading-snug">{user.name}</h2>
              <p className="text-[11px] text-slate-450 truncate">@{user.username}</p>
              
              <div className="flex items-center gap-2 mt-1.5">
                <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[9px] px-2.5 py-0.5 rounded-full font-bold">
                  LVL {user.level}
                </span>
                <span className="text-slate-400 text-[10px] flex items-center gap-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {user.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 mb-5">
              <p className="text-xs text-slate-600 leading-relaxed italic font-semibold">&quot;{user.bio}&quot;</p>
            </div>
          )}

          {/* Interests */}
          {user.interests.length > 0 && (
            <div className="mb-4.5">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-indigo-600" /> Interests
              </h4>
              <div className="flex flex-wrap gap-1">
                {user.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] px-2.5 py-1 rounded-lg font-bold shadow-xs"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {user.skills.length > 0 && (
            <div className="mb-4.5">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Skills & Tools</h4>
              <div className="flex flex-wrap gap-1">
                {user.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-650 border border-slate-200/60 text-[10px] px-2.5 py-1 rounded-lg font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies */}
          {user.hobbies.length > 0 && (
            <div className="mb-5">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Hobbies</h4>
              <div className="flex flex-wrap gap-1">
                {user.hobbies.map((hobby, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-650 border border-slate-200/60 text-[10px] px-2.5 py-1 rounded-lg font-bold"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {user.isConnected ? (
              <div className="flex items-center justify-center gap-1.5 py-3 bg-slate-150 border border-slate-200 text-emerald-600 font-extrabold rounded-xl text-xs shadow-xs">
                <Check className="w-3.5 h-3.5" />
                Connected
              </div>
            ) : (
              <button
                onClick={() => connectWithUser(user.id)}
                className="flex items-center justify-center gap-1.5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs shadow-md transition active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Connect
              </button>
            )}

            <button
              onClick={handleSendMessage}
              className="flex items-center justify-center gap-1.5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-extrabold rounded-xl text-xs transition active:scale-95 shadow-xs"
            >
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
