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
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4.5 text-slate-800 bg-slate-50 select-none">
      
      {/* 1. EDIT PROFILE SCREEN / PROFILE ACCOUNT CREATION SETUP */}
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <h1 className="text-lg font-black text-slate-800 flex items-center gap-1.5">
              👤 Setup Student Profile
            </h1>
            <p className="text-[11px] text-slate-500">Create your campus profile to match with similar students.</p>
          </div>

          {/* Name & Bio input */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div>
              <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Full Name</label>
              <input
                type="text"
                value={draftName}
                onChange={e => setDraftName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 font-semibold"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-455 uppercase tracking-wider block mb-1">Short Bio</label>
              <textarea
                value={draftBio}
                onChange={e => setDraftBio(e.target.value)}
                placeholder="Talk about classes, clubs or hobbies..."
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-2 h-14 resize-none focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 font-semibold"
              />
            </div>
          </div>

          {/* Avatar Selector Grid */}
          <div>
            <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Choose Avatar</label>
            <div className="flex gap-2.5 justify-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              {AVATAR_OPTIONS.map((av, idx) => (
                <div
                  key={idx}
                  onClick={() => setDraftAvatar(av)}
                  className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition ${
                    draftAvatar === av ? "border-indigo-500 scale-105" : "border-slate-100 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={av} alt="Avatar option" className="w-10 h-10 object-cover" />
                  {draftAvatar === av && (
                    <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-indigo-600 font-extrabold" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interests Tag Selector */}
          <div>
            <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Interests</label>
            <div className="flex flex-wrap gap-1.5 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              {INTERESTS_PRESETS.map((item, idx) => {
                const selected = draftInterests.includes(item);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleToggleInterest(item)}
                    className={`text-[10px] px-3 py-1.5 rounded-lg border font-bold transition ${
                      selected
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800"
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
            <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Skills</label>
            <div className="flex flex-wrap gap-1.5 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              {SKILLS_PRESETS.map((item, idx) => {
                const selected = draftSkills.includes(item);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleToggleSkill(item)}
                    className={`text-[10px] px-3 py-1.5 rounded-lg border font-bold transition ${
                      selected
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800"
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
            <label className="text-[9px] font-bold text-slate-455 uppercase tracking-wider block mb-1">Hobbies</label>
            <div className="flex flex-wrap gap-1.5 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              {HOBBIES_PRESETS.map((item, idx) => {
                const selected = draftHobbies.includes(item);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleToggleHobby(item)}
                    className={`text-[10px] px-3 py-1.5 rounded-lg border font-bold transition ${
                      selected
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Save */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-md active:scale-95 flex items-center justify-center gap-1"
          >
            Save Profile & Explore Campus
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        
        /* 2. STANDARD USER DASHBOARD PROFILE VIEW */
        <div className="space-y-5">
          
          {/* Profile Card Summary */}
          <div className="relative bg-white border border-slate-100 rounded-3xl p-5 shadow-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/5 rounded-full blur-2xl"></div>
            
            <div className="flex items-start gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-slate-800 truncate leading-snug">{currentUser.name}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-50 rounded-lg transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">@{currentUser.username}</p>
                
                <div className="flex items-center gap-1 mt-1.5 bg-indigo-55/70 border border-indigo-100 px-2 py-0.5 rounded-full w-fit">
                  <span className="text-[9px] text-indigo-600 font-extrabold uppercase">{getLevelName(currentUser.level)}</span>
                </div>
              </div>
            </div>

            {/* Level & XP Gauge */}
            <div className="mt-4.5 border-t border-slate-100 pt-3.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                <span>XP Level {currentUser.level}</span>
                <span>{currentUser.xp} / {xpMax} XP</span>
              </div>
              <div className="w-full h-2 bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-slate-450 mt-1.5 italic font-semibold">
                Earn XP by sharing experiences or scanning spots.
              </p>
            </div>
          </div>

          {/* Quick Statistics Stats Grid */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Campus Statistics</h3>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white border border-slate-100 rounded-xl p-2.5 text-center shadow-xs">
                <span className="text-base font-black text-indigo-600 block">{scannedCount}</span>
                <span className="text-[8px] font-bold text-slate-450 uppercase tracking-wide">Spots Scanned</span>
              </div>
              <div className="bg-white border border-slate-100 rounded-xl p-2.5 text-center shadow-xs">
                <span className="text-base font-black text-purple-600 block">{badgeCount}</span>
                <span className="text-[8px] font-bold text-slate-455 uppercase tracking-wide">Badges Won</span>
              </div>
              <div className="bg-white border border-slate-100 rounded-xl p-2.5 text-center shadow-xs">
                <span className="text-base font-black text-emerald-600 block">{dmCount}</span>
                <span className="text-[8px] font-bold text-slate-450 uppercase tracking-wide">Chats Open</span>
              </div>
            </div>
          </div>

          {/* Interests profile */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Interests</h3>
            <div className="flex flex-wrap gap-1">
              {currentUser.interests.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-50 text-indigo-650 border border-indigo-100 text-[10px] px-2.5 py-1 rounded-lg font-bold shadow-xs"
                >
                  {item}
                </span>
              ))}
              {currentUser.interests.length === 0 && (
                <span className="text-slate-400 text-xs italic">Setup profile to select interests!</span>
              )}
            </div>
          </div>

          {/* Badges Achievements */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Badges</h3>
            <div className="grid grid-cols-1 gap-2">
              {badges.map((badge: Badge) => {
                const unlocked = !!badge.unlockedAt;
                return (
                  <div
                    key={badge.id}
                    className={`border rounded-xl p-2.5 flex items-center justify-between transition ${
                      unlocked
                        ? "bg-white border-amber-200 shadow-xs"
                        : "bg-slate-100/50 border-slate-200/50 opacity-70"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 border ${
                        unlocked
                          ? "bg-amber-50 border-amber-200 text-amber-600"
                          : "bg-slate-50 border-slate-200 text-slate-400"
                      }`}>
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 pr-1">
                        <h4 className={`font-bold text-xs ${unlocked ? "text-slate-800" : "text-slate-400"}`}>
                          {badge.name}
                        </h4>
                        <p className="text-[9.5px] text-slate-500 leading-normal truncate">{badge.description}</p>
                      </div>
                    </div>

                    {unlocked ? (
                      <span className="text-[8px] text-amber-600 font-extrabold uppercase shrink-0">
                        {badge.unlockedAt}
                      </span>
                    ) : (
                      <Lock className="w-3 h-3 text-slate-400 shrink-0 mr-1" />
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
