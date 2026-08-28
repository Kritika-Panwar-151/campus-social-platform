"use client";

import React, { useState, useRef } from "react";
import { Camera, Sparkles, ChevronLeft, MapPin, ThumbsUp, Upload, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ExplorerTab() {
  const {
    locations,
    scanLocation,
    uploadCustomLocationImage,
    addExperience,
    addCommentToLocation,
    selectedLocationIdForExplorer,
    setSelectedLocationIdForExplorer
  } = useApp();

  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [scanTargetId, setScanTargetId] = useState<string | null>(null);
  
  // Custom experience inputs
  const [experienceText, setExperienceText] = useState("");
  const [commentText, setCommentText] = useState("");
  
  // Photo upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active sub-section within the location details
  const [detailsSubTab, setDetailsSubTab] = useState<"info" | "experiences" | "comments">("info");

  const startScan = (locId: string) => {
    setScanning(true);
    setScanTargetId(locId);
    
    setScanStep("📸 Initializing AI scanner...");
    setTimeout(() => {
      setScanStep("🛰️ Analyzing structure points...");
    }, 800);
    
    setTimeout(() => {
      setScanStep("🧠 Classification search...");
    }, 1600);

    setTimeout(() => {
      setScanStep("✅ Match found: 98% confidence");
    }, 2400);

    setTimeout(() => {
      setScanning(false);
      scanLocation(locId);
    }, 3000);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const locked = locations.find(l => !l.isUnlocked);
        const targetId = locked ? locked.id : locations[0].id;
        startScan(targetId);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedLocationIdForExplorer) {
      const reader = new FileReader();
      reader.onloadend = () => {
        uploadCustomLocationImage(selectedLocationIdForExplorer, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!experienceText.trim() || !selectedLocationIdForExplorer) return;
    addExperience(selectedLocationIdForExplorer, experienceText);
    setExperienceText("");
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedLocationIdForExplorer) return;
    addCommentToLocation(selectedLocationIdForExplorer, commentText);
    setCommentText("");
  };

  const selectedLocation = locations.find(l => l.id === selectedLocationIdForExplorer);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-slate-200 bg-[#070518]">
      
      {/* SCANNING LOADER OVERLAY */}
      {scanning && (
        <div className="absolute inset-0 bg-[#070518]/98 z-50 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="relative w-56 h-56 border border-[#2d226a] rounded-3xl overflow-hidden mb-6 shadow-2xl bg-black">
            {scanTargetId && (
              <img
                src={
                  scanTargetId === "loc_ai_lab"
                    ? "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=300"
                    : scanTargetId === "loc_library"
                    ? "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=300"
                    : scanTargetId === "loc_canteen"
                    ? "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&q=80&w=300"
                    : "https://images.unsplash.com/photo-1503095391755-11200683a43f?auto=format&fit=crop&q=80&w=300"
                }
                alt="Scanning target"
                className="w-full h-full object-cover brightness-[0.4]"
              />
            )}
            <div className="absolute left-0 right-0 h-0.5 bg-fuchsia-400 shadow-[0_0_12px_#d946ef] animate-[bounce_2s_infinite]"></div>
            <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-fuchsia-400"></div>
            <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-fuchsia-400"></div>
            <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-fuchsia-400"></div>
            <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-fuchsia-400"></div>
          </div>
          <div className="inline-flex p-3 bg-fuchsia-500/10 rounded-full mb-3 animate-spin">
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
          </div>
          <h3 className="text-sm font-bold text-white mb-0.5 tracking-wide">Campus AI Scanner</h3>
          <p className="text-[#a59ef5] font-mono text-[9px] uppercase tracking-widest">{scanStep}</p>
        </div>
      )}

      {/* SCANNING HOME CAMERA VIEW */}
      {!selectedLocationIdForExplorer ? (
        <div className="flex-1 flex flex-col overflow-y-auto p-5 space-y-5">
          {/* Header */}
          <div>
            <h1 className="text-lg font-black text-white tracking-wide">
              📸 Explorer
            </h1>
            <p className="text-[10px] text-[#a59ef5] font-medium tracking-wide">AI identifies campus architecture from your photos.</p>
          </div>

          {/* Camera Viewport Mockup */}
          <div className="relative bg-[#120e2e] aspect-[4/3] rounded-3xl overflow-hidden border border-[#231b57]/40 flex flex-col items-center justify-center p-6 select-none shadow-lg">
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#120e2e]/90 border border-fuchsia-500/25 px-2.5 py-1 rounded-full text-[8px] font-black text-fuchsia-400 tracking-wider">
              <span className="w-1 h-1 rounded-full bg-fuchsia-400"></span>
              STANDBY
            </div>
            
            <div className="text-center p-4">
              <Camera className="w-8 h-8 text-fuchsia-400/70 mx-auto mb-2.5 animate-pulse" />
              <p className="text-[10px] text-[#a59ef5] font-bold">Select a photo of building or classroom</p>
              
              <div className="mt-4">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleCustomUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-indigo-650 hover:from-fuchsia-500 hover:to-indigo-600 text-white rounded-2xl text-[9px] font-black tracking-wider transition active:scale-95 shadow-md shadow-fuchsia-500/10 uppercase"
                >
                  Upload Photo
                </button>
              </div>
            </div>
          </div>

          {/* Preset Locations to Mock Scan */}
          <div className="flex-1 space-y-2.5">
            <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Campus Spots</h3>
            <div className="space-y-2">
              {locations.map(loc => (
                <div
                  key={loc.id}
                  className={`rounded-2xl p-4 flex items-center justify-between transition-all duration-300 ${
                    loc.isUnlocked
                      ? "bg-[#120e2e] border border-[#231b57]/30 shadow-xs hover:border-fuchsia-500/25"
                      : "bg-[#0b0822]/80 border border-[#1b1548]/30 opacity-90"
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h4 className="font-bold text-xs text-white truncate">{loc.name}</h4>
                      {loc.isUnlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-[#a59ef5] flex items-center gap-1 font-semibold">
                      <MapPin className="w-3 h-3 text-[#584ea0]" />
                      {loc.building} • {loc.floor}
                    </p>
                  </div>
                  
                  {loc.isUnlocked ? (
                    <button
                      onClick={() => setSelectedLocationIdForExplorer(loc.id)}
                      className="px-3.5 py-1.5 bg-[#1d1647] hover:bg-[#251d5c] text-fuchsia-300 font-black rounded-xl text-[9px] tracking-wider uppercase transition"
                    >
                      Enter
                    </button>
                  ) : (
                    <button
                      onClick={() => startScan(loc.id)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-black rounded-xl text-[9px] tracking-wider uppercase transition flex items-center gap-1 shadow-sm active:scale-95"
                    >
                      <Camera className="w-3 h-3" />
                      Scan
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* LOCATION DETAILS SCREEN */
        selectedLocation && (
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#070518]">
            {/* Header / Banner */}
            <div className="relative h-36 shrink-0 bg-slate-900">
              <img
                src={selectedLocation.photos[0]}
                alt={selectedLocation.name}
                className="w-full h-full object-cover brightness-[0.7]"
              />
              
              {/* Back Button */}
              <button
                onClick={() => setSelectedLocationIdForExplorer(null)}
                className="absolute top-4 left-4 bg-[#120e2e]/90 hover:bg-[#1c1647] text-white p-1.5 rounded-full border border-[#2b2067]/40 shadow-md transition active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="bg-[#ec4899] text-white text-[8px] font-black tracking-wider px-2 py-0.5 rounded-md uppercase mb-1 inline-block">
                  {selectedLocation.coordinates}
                </span>
                <h2 className="text-sm font-black text-white leading-tight">
                  {selectedLocation.name}
                </h2>
                <p className="text-[9.5px] text-slate-300 flex items-center gap-1 mt-0.5 font-bold">
                  <MapPin className="w-3 h-3 text-fuchsia-400" />
                  {selectedLocation.building}, {selectedLocation.floor}
                </p>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex border-b border-[#1b1548]/40 bg-[#0a071c] shrink-0 text-[10px]">
              <button
                onClick={() => setDetailsSubTab("info")}
                className={`flex-1 py-3.5 font-black uppercase tracking-wider text-center transition ${
                  detailsSubTab === "info"
                    ? "text-fuchsia-400 border-b-2 border-fuchsia-400"
                    : "text-slate-500 border-transparent hover:text-slate-350"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setDetailsSubTab("experiences")}
                className={`flex-1 py-3.5 font-black uppercase tracking-wider text-center transition ${
                  detailsSubTab === "experiences"
                    ? "text-fuchsia-400 border-b-2 border-fuchsia-400"
                    : "text-slate-500 border-transparent hover:text-slate-350"
                }`}
              >
                Diary ({selectedLocation.experiences.length})
              </button>
              <button
                onClick={() => setDetailsSubTab("comments")}
                className={`flex-1 py-3.5 font-black uppercase tracking-wider text-center transition ${
                  detailsSubTab === "comments"
                    ? "text-fuchsia-400 border-b-2 border-fuchsia-400"
                    : "text-slate-500 border-transparent hover:text-slate-350"
                }`}
              >
                Q&A ({selectedLocation.comments.length})
              </button>
            </div>

            {/* Inner Content Area */}
            <div className="flex-1 overflow-y-auto p-4.5 space-y-4.5 scrollbar-none">
              
              {/* TAB 1: INFO & FACILITIES */}
              {detailsSubTab === "info" && (
                <>
                  <div className="text-slate-300 text-xs leading-relaxed bg-[#120e2e] p-4 rounded-2xl border border-[#231b57]/20 shadow-xs">
                    <p>{selectedLocation.description}</p>
                  </div>

                  {/* Facilities */}
                  <div className="space-y-2">
                    <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Facilities</h3>
                    <div className="space-y-1">
                      {selectedLocation.facilities.map((fac, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-[#120e2e] p-3 rounded-2xl text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-400 shrink-0 mt-0.5" />
                          <span>{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="space-y-2">
                    <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Tips</h3>
                    <div className="space-y-1.5">
                      {selectedLocation.tips.map((tip, idx) => (
                        <div key={idx} className="bg-amber-500/[0.03] border border-amber-500/10 rounded-2xl p-3 flex items-start gap-2.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-200 font-semibold leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Photos Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Photos</h3>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          id="loc-gallery-upload"
                          className="hidden"
                          onChange={handleLocationPhotoUpload}
                        />
                        <label
                          htmlFor="loc-gallery-upload"
                          className="cursor-pointer bg-[#1d1647] hover:bg-[#251d5c] text-fuchsia-300 text-[8px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-0.5 transition shadow-sm"
                        >
                          <Plus className="w-2.5 h-2.5" /> Add
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedLocation.photos.map((photoUrl, idx) => (
                        <div key={idx} className="aspect-video rounded-2xl overflow-hidden border border-[#2b2067]/20 bg-[#120e2e] shadow-sm">
                          <img src={photoUrl} alt="Student upload" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: EXPERIENCES */}
              {detailsSubTab === "experiences" && (
                <div className="space-y-4">
                  {/* Share Experience Form */}
                  <form onSubmit={submitExperience} className="bg-[#120e2e] p-4 rounded-2xl space-y-3 shadow-xs">
                    <h4 className="text-xs font-bold text-white tracking-wide">Write Experience</h4>
                    <textarea
                      placeholder="Share a secret, study tips, or details..."
                      value={experienceText}
                      onChange={e => setExperienceText(e.target.value)}
                      className="w-full bg-[#070518] border border-[#20174c]/50 text-xs text-white rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-fuchsia-500 h-16 placeholder:text-slate-600 resize-none font-medium"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!experienceText.trim()}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-fuchsia-600 to-indigo-650 disabled:from-[#1a1444] disabled:text-slate-550 hover:from-fuchsia-500 text-white font-black rounded-xl text-[9px] tracking-wider uppercase transition active:scale-95 shadow-sm"
                      >
                        Publish (+30 XP)
                      </button>
                    </div>
                  </form>

                  {/* Experiences List */}
                  <div className="space-y-2">
                    {selectedLocation.experiences.length === 0 ? (
                      <p className="text-xs text-slate-550 text-center py-4">No entries yet.</p>
                    ) : (
                      selectedLocation.experiences.map(exp => (
                        <div key={exp.id} className="bg-[#120e2e] p-3.5 rounded-2xl flex items-start gap-3 shadow-xs">
                          <img src={exp.userAvatar} alt={exp.userName} className="w-7 h-7 rounded-xl object-cover border border-[#231b57]/40 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-bold text-xs text-white">{exp.userName}</span>
                              <span className="text-[8px] text-slate-500">{exp.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-350 leading-relaxed font-semibold">{exp.text}</p>
                            
                            <div className="flex items-center gap-3 mt-2">
                              <button className="flex items-center gap-0.5 text-[9px] text-[#a59ef5] hover:text-white transition">
                                <ThumbsUp className="w-3 h-3 text-[#a59ef5]" />
                                {exp.likes}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: DISCUSSIONS / COMMENTS */}
              {detailsSubTab === "comments" && (
                <div className="space-y-4">
                  {/* Write Comment Form */}
                  <form onSubmit={submitComment} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discuss or ask about this spot..."
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      className="flex-1 bg-[#120e2e] border border-[#20174c]/50 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-fuchsia-500 placeholder:text-slate-550 shadow-sm font-semibold"
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="bg-gradient-to-r from-fuchsia-600 to-indigo-650 hover:from-fuchsia-500 disabled:from-[#1a1444] disabled:text-slate-550 text-white font-black px-4 rounded-xl text-xs transition active:scale-95 shadow-sm shrink-0"
                    >
                      Post
                    </button>
                  </form>

                  {/* Comment Feed */}
                  <div className="space-y-2">
                    {selectedLocation.comments.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No comments here yet.</p>
                    ) : (
                      selectedLocation.comments.map(c => (
                        <div key={c.id} className="bg-[#120e2e]/60 p-3 rounded-xl flex gap-2.5">
                          <img src={c.userAvatar} alt={c.userName} className="w-6 h-6 rounded-md object-cover border border-[#231b57]/45 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-bold text-xs text-slate-200">{c.userName}</span>
                              <span className="text-[8px] text-slate-500">{c.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-350">{c.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        )
      )}
    </div>
  );
}
