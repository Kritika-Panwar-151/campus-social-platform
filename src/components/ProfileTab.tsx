"use client";

import React, { useState } from "react";
import { Edit2, Award, Sparkles, Check, ArrowRight, Lock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Badge } from "../types";

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120",
  "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=120",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120"
];

const INTERESTS_PRESETS = ["AI", "Robotics", "Cybersecurity", "Web Dev", "Game Dev", "Fintech", "IoT", "Mobile Apps"];
const SKILLS_PRESETS = ["React", "Python", "Figma", "C++", "TypeScript", "Docker", "SQL", "ROS"];
const HOBBIES_PRESETS = ["Chess", "Hiking", "Street Photography", "Gaming", "Anime", "Coffee", "Sketching", "Music"];

export default function ProfileTab() {
  const {
    currentUser,
    updateUserProfile,
    badges,
    locations,
    messages
  } = useApp();

  const [isEditing, setIsEditing] = useState(currentUser.interests.length === 0);
  
  // Form Draft States
  const [draftName, setDraftName] = useState(currentUser.name || "New Explorer");
  const [draftBio, setDraftBio] = useState(currentUser.bio || "CS freshman looking for hackathon teams.");
  const [draftAvatar, setDraftAvatar] = useState(currentUser.avatar || AVATAR_OPTIONS[0]);
  const [draftInterests, setDraftInterests] = useState<string[]>(currentUser.interests || []);
  const [draftSkills, setDraftSkills] = useState<string[]>(currentUser.skills || []);
  const [draftHobbies, setDraftHobbies] = useState<string[]>(currentUser.hobbies || []);

  const handleToggleInterest = (item: string) => {
    setDraftInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleToggleSkill = (item: string) => {
    setDraftSkills(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleToggleHobby = (item: string) => {
    setDraftHobbies(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(draftName, draftBio, draftInterests, draftAvatar);
    setIsEditing(false);
  };

  const getLevelXPMax = (level: number) => {
    if (level === 1) return 100;
    if (level === 2) return 250;
    if (level === 3) return 500;
    if (level === 4) return 900;
    return 1500;
  };

  const getLevelName = (level: number) => {
    switch (level) {
      case 1: return "Freshman Explorer";
      case 2: return "Campus Scout";
      case 3: return "Location Guru";
      case 4: return "Genie Associate";
      case 5: return "Campus Legend";
      default: return "Explorer";
    }
  };

  const xpMax = getLevelXPMax(currentUser.level);
  const xpPercent = Math.min((currentUser.xp / xpMax) * 100, 100);

  const scannedCount = locations.filter(l => l.isUnlocked).length;
  const badgeCount = badges.filter(b => b.unlockedAt).length;
  const dmCount = Object.keys(messages).length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-5 text-[#333136] bg-[#f8f7ff] select-none scrollbar-none space-y-4">
      
      {/* 1. EDIT PROFILE SCREEN */}
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <h1 className="text-lg font-black text-[#333136]">
              👤 Setup Profile
            </h1>
            <p className="text-[10px] text-[#635d73] font-bold">Select your interests to connect with campus groups.</p>
          </div>

          {/* Name & Bio input */}
          <div className="space-y-3 bg-white p-4 rounded-[28px] border border-[#c5bae8]/20 shadow-xs">
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Full Name</label>
              <input
                type="text"
                value={draftName}
                onChange={e => setDraftName(e.target.value)}
                required
                className="w-full bg-[#f8f7ff] border border-[#c5bae8]/20 text-xs text-[#333136] rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-[#f28f5f] font-bold"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Bio Description</label>
              <textarea
                value={draftBio}
                onChange={e => setDraftBio(e.target.value)}
                placeholder="Talk about classes, projects or clubs..."
                className="w-full bg-[#f8f7ff] border border-[#c5bae8]/20 text-xs text-[#333136] rounded-xl px-3.5 py-2.5 h-16 resize-none focus:outline-hidden focus:ring-1 focus:ring-[#f28f5f] font-bold"
              />
            </div>
          </div>

          {/* Avatar Selector Grid */}
          <div>
            <label className="text-[9px] font-bold text-[#635d73] uppercase tracking-widest block mb-1.5">Choose Avatar</label>
            <div className="flex gap-2.5 justify-center bg-white p-4 rounded-[28px] border border-[#c5bae8]/20 shadow-xs">
              {AVATAR_OPTIONS.map((av, idx) => (
                <div
                  key={idx}
                  onClick={() => setDraftAvatar(av)}
                  className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition ${
                    draftAvatar === av ? "border-[#f28f5f] scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={av} alt="Avatar option" className="w-9 h-9 object-cover" />
                  {draftAvatar === av && (
                    <div className="absolute inset-0 bg-[#f28f5f]/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#f28f5f] font-extrabold" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interests Tag Selector */}
          <div>
            <label className="text-[9px] font-bold text-[#635d73] uppercase tracking-widest block mb-1.5">Interests</label>
            <div className="flex flex-wrap gap-1.5 bg-white p-4 rounded-[28px] border border-[#c5bae8]/20 shadow-xs">
              {INTERESTS_PRESETS.map((item, idx) => {
                const selected = draftInterests.includes(item);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleToggleInterest(item)}
                    className={`text-[10px] px-3.5 py-1.5 rounded-xl border font-bold transition ${
                      selected
                        ? "bg-[#a27cf8] border-[#a27cf8] text-white shadow-xs"
                        : "bg-[#f8f7ff] border-[#c5bae8]/25 text-[#635d73] hover:text-[#333136]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skills Tag Selector */}
          <div>
            <label className="text-[9px] font-bold text-[#635d73] uppercase tracking-widest block mb-1.5">Skills</label>
            <div className="flex flex-wrap gap-1.5 bg-white p-4 rounded-[28px] border border-[#c5bae8]/20 shadow-xs">
              {SKILLS_PRESETS.map((item, idx) => {
                const selected = draftSkills.includes(item);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleToggleSkill(item)}
                    className={`text-[10px] px-3.5 py-1.5 rounded-xl border font-bold transition ${
                      selected
                        ? "bg-[#a27cf8] border-[#a27cf8] text-white shadow-xs"
                        : "bg-[#f8f7ff] border-[#c5bae8]/25 text-[#635d73] hover:text-[#333136]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hobbies Tag Selector */}
          <div>
            <label className="text-[9px] font-bold text-[#635d73] uppercase tracking-widest block mb-1.5">Hobbies</label>
            <div className="flex flex-wrap gap-1.5 bg-white p-4 rounded-[28px] border border-[#c5bae8]/20 shadow-xs">
              {HOBBIES_PRESETS.map((item, idx) => {
                const selected = draftHobbies.includes(item);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleToggleHobby(item)}
                    className={`text-[10px] px-3.5 py-1.5 rounded-xl border font-bold transition ${
                      selected
                        ? "bg-[#a27cf8] border-[#a27cf8] text-white shadow-xs"
                        : "bg-[#f8f7ff] border-[#c5bae8]/25 text-[#635d73] hover:text-[#333136]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Profile */}
          <button
            type="submit"
            className="w-full py-3 bg-[#f28f5f] hover:bg-[#e07f4f] text-white font-black rounded-xl text-xs uppercase tracking-wider transition shadow-md active:scale-95 flex items-center justify-center gap-1.5"
          >
            Save Profile
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        
        /* 2. STANDARD USER DASHBOARD PROFILE VIEW */
        <div className="space-y-4.5">
          
          {/* Profile Card Summary */}
          <div className="relative bg-white border border-[#c5bae8]/10 rounded-[32px] p-5 shadow-xs overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#f28f5f]/5 rounded-full blur-xl"></div>
            
            <div className="flex items-start gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-2xl object-cover border border-[#c5bae8]/20 shrink-0 shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-black text-[#333136] truncate leading-snug">{currentUser.name}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[#a27cf8] hover:text-[#f28f5f] p-1 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-[#635d73] font-bold">@{currentUser.username}</p>
                
                <div className="flex items-center gap-1 mt-1.5 bg-[#f28f5f]/10 border border-[#f28f5f]/20 px-2.5 py-0.5 rounded-full w-fit">
                  <span className="text-[8px] text-[#f28f5f] font-black uppercase tracking-wider">{getLevelName(currentUser.level)}</span>
                </div>
              </div>
            </div>

            {/* Level & XP Gauge */}
            <div className="mt-4 border-t border-slate-100 pt-3.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-[#635d73] mb-1.5">
                <span>XP Level {currentUser.level}</span>
                <span>{currentUser.xp} / {xpMax} XP</span>
              </div>
              <div className="w-full h-2 bg-[#f8f7ff] rounded-full overflow-hidden border border-[#c5bae8]/10">
                <div
                  className="h-full bg-gradient-to-r from-[#f28f5f] to-[#a27cf8] rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                ></div>
              </div>
              <p className="text-[8.5px] text-[#a27cf8] font-black mt-1.5 italic uppercase tracking-wider">
                Earn XP by scanning spots or completing hunts!
              </p>
            </div>
          </div>

          {/* Quick Statistics Stats Grid */}
          <div>
            <h3 className="text-[9px] font-bold text-[#635d73] uppercase tracking-widest mb-2">My Stats</h3>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-[#f2efff] border border-[#a27cf8]/10 rounded-2xl p-3 text-center shadow-xs">
                <span className="text-base font-black text-[#a27cf8] block">{scannedCount}</span>
                <span className="text-[8px] font-bold text-[#635d73] uppercase tracking-wide">Scans</span>
              </div>
              <div className="bg-[#f2efff] border border-[#a27cf8]/10 rounded-2xl p-3 text-center shadow-xs">
                <span className="text-base font-black text-[#a27cf8] block">{badgeCount}</span>
                <span className="text-[8px] font-bold text-[#635d73] uppercase tracking-wide">Badges</span>
              </div>
              <div className="bg-[#f2efff] border border-[#a27cf8]/10 rounded-2xl p-3 text-center shadow-xs">
                <span className="text-base font-black text-[#a27cf8] block">{dmCount}</span>
                <span className="text-[8px] font-bold text-[#635d73] uppercase tracking-wide">Chats</span>
              </div>
            </div>
          </div>

          {/* Interests profile */}
          <div>
            <h3 className="text-[9px] font-bold text-[#635d73] uppercase tracking-widest mb-2">Selected Interests</h3>
            <div className="flex flex-wrap gap-1">
              {currentUser.interests.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-[#f2efff] border border-[#a27cf8]/10 text-[#a27cf8] text-[9.5px] px-2.5 py-1 rounded-lg font-bold shadow-xs"
                >
                  {item}
                </span>
              ))}
              {currentUser.interests.length === 0 && (
                <span className="text-[#635d73] text-xs italic font-bold">Choose interests by editing profile!</span>
              )}
            </div>
          </div>

          {/* Badges Achievements */}
          <div>
            <h3 className="text-[9px] font-bold text-[#635d73] uppercase tracking-widest mb-2">My Achievement Badges</h3>
            <div className="grid grid-cols-1 gap-2">
              {badges.map((badge: Badge) => {
                const unlocked = !!badge.unlockedAt;
                return (
                  <div
                    key={badge.id}
                    className={`border rounded-2xl p-3 flex items-center justify-between transition ${
                      unlocked
                        ? "bg-white border-amber-500/25 shadow-xs"
                        : "bg-slate-50/50 border-dashed border-slate-350 opacity-70"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 border ${
                        unlocked
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                          : "bg-[#f8f7ff] border-[#c5bae8]/20 text-slate-400"
                      }`}>
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 pr-1">
                        <h4 className={`font-black text-xs ${unlocked ? "text-[#333136]" : "text-slate-400"}`}>
                          {badge.name}
                        </h4>
                        <p className="text-[9px] text-[#635d73] font-bold leading-normal truncate">{badge.description}</p>
                      </div>
                    </div>

                    {unlocked ? (
                      <span className="text-[8px] text-amber-500 font-extrabold uppercase shrink-0">
                        {badge.unlockedAt}
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
