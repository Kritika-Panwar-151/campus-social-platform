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
    <div className="absolute inset-0 bg-[#070518]/50 backdrop-blur-xs z-50 flex items-end justify-center transition-all duration-300">
      <div
        className={`bg-white border-t border-[#c5bae8]/30 rounded-t-[32px] w-full max-h-[85%] overflow-y-auto relative shadow-2xl transition-all duration-500 transform ${
          animate ? "translate-y-0 opacity-100" : "translate-y-full opacity-50"
        }`}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-[#c5bae8]/20 z-10">
          <div className="flex items-center gap-1.5">
            <Award className="w-4.5 h-4.5 text-[#f28f5f]" />
            <h3 className="text-xs font-black text-[#333136] uppercase tracking-wider">Student Details</h3>
          </div>
          <button
            onClick={() => setSelectedUserForModal(null)}
            className="text-slate-400 hover:text-[#333136] rounded-full p-1.5 bg-[#f2efff] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover border border-[#c5bae8]/20 shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-black text-[#333136] truncate leading-snug">{user.name}</h2>
              <p className="text-[10px] text-slate-500">@{user.username}</p>
              
              <div className="flex items-center gap-2 mt-1.5">
                <span className="bg-[#f28f5f]/10 text-[#f28f5f] border border-[#f28f5f]/20 text-[9px] px-2.5 py-0.5 rounded-full font-bold">
                  LVL {user.level}
                </span>
                <span className="text-slate-550 text-[10px] flex items-center gap-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {user.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="bg-[#f8f7ff] rounded-2xl p-3.5 border border-[#c5bae8]/20">
              <p className="text-xs text-[#635d73] leading-relaxed italic font-bold">&quot;{user.bio}&quot;</p>
            </div>
          )}

          {/* Interests */}
          {user.interests.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-[9px] font-bold text-slate-550 uppercase tracking-widest flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#f28f5f]" /> Interests
              </h4>
              <div className="flex flex-wrap gap-1">
                {user.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="bg-[#a27cf8]/10 text-[#a27cf8] text-[10px] px-2.5 py-1 rounded-lg font-bold shadow-xs"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {user.skills.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-[9px] font-bold text-slate-550 uppercase tracking-widest">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {user.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-[#f2efff] text-[#635d73] text-[10px] px-2.5 py-1 rounded-lg font-bold border border-[#c5bae8]/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies */}
          {user.hobbies.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-[9px] font-bold text-slate-550 uppercase tracking-widest">Hobbies</h4>
              <div className="flex flex-wrap gap-1">
                {user.hobbies.map((hobby, idx) => (
                  <span
                    key={idx}
                    className="bg-[#f2efff] text-[#635d73] text-[10px] px-2.5 py-1 rounded-lg font-bold border border-[#c5bae8]/10"
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
              <div className="flex items-center justify-center gap-1.5 py-3 bg-[#f8f7ff] border border-[#c5bae8]/20 text-emerald-600 font-extrabold rounded-xl text-xs shadow-xs">
                <Check className="w-3.5 h-3.5" />
                Connected
              </div>
            ) : (
              <button
                onClick={() => connectWithUser(user.id)}
                className="flex items-center justify-center gap-1.5 py-3 bg-[#f28f5f] hover:bg-[#e07f4f] text-white font-extrabold rounded-xl text-xs shadow-md transition active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Connect
              </button>
            )}

            <button
              onClick={handleSendMessage}
              className="flex items-center justify-center gap-1.5 py-3 bg-[#f2efff] hover:bg-[#e6e0fc] text-[#a27cf8] border border-[#a27cf8]/20 font-extrabold rounded-xl text-xs transition active:scale-95 shadow-xs"
            >
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
