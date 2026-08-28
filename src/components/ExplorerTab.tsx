"use client";

import React, { useState, useRef } from "react";
import { Camera, Sparkles, ChevronLeft, MapPin, ThumbsUp, Upload, CheckCircle2, MessageCircle, AlertCircle, Plus } from "lucide-react";
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
    
    // Simulate multi-step AI scan
    setScanStep("📸 Activating Camera Scanner...");
    setTimeout(() => {
      setScanStep("🛰️ Analyzing image geometry & features...");
    }, 800);
    
    setTimeout(() => {
      setScanStep("🧠 Running AI Campus classification model...");
    }, 1600);

    setTimeout(() => {
      setScanStep("✅ Match found! 98.4% Confidence.");
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
        // Mock identifying custom uploaded image as one of the locked locations
        const locked = locations.find(l => !l.isUnlocked);
        const targetId = locked ? locked.id : locations[0].id;
        startScan(targetId);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload student photo for active location
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
    <div className="flex-1 flex flex-col h-full overflow-hidden text-slate-100">
      
      {/* SCANNING LOADER OVERLAY */}
      {scanning && (
        <div className="absolute inset-0 bg-slate-950/90 z-50 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="relative w-64 h-64 border-2 border-indigo-500/50 rounded-2xl overflow-hidden mb-8 shadow-2xl shadow-indigo-500/10">
            {/* Camera feed mockup during scan */}
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
                className="w-full h-full object-cover brightness-50"
              />
            )}
            
            {/* Green laser scanning horizontal line */}
            <div className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_10px_#34d399] animate-[bounce_2s_infinite]"></div>
            
            {/* Target corners */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-indigo-400"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-indigo-400"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-indigo-400"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-indigo-400"></div>
          </div>
          
          <div className="inline-flex p-3 bg-indigo-500/10 border border-indigo-500/25 rounded-full mb-4 animate-spin">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          
          <h3 className="text-lg font-bold text-white mb-2">Campus AI Analyzer</h3>
          <p className="text-indigo-300 font-mono text-xs">{scanStep}</p>
        </div>
      )}

      {/* SCANNING HOME CAMERA VIEW */}
      {!selectedLocationIdForExplorer ? (
        <div className="flex-1 flex flex-col overflow-y-auto p-5">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              📸 Campus Explorer
            </h1>
            <p className="text-xs text-slate-400">Take or upload photos of landmarks on campus to scan with AI.</p>
          </div>

          {/* Camera Viewport Mockup */}
          <div className="relative bg-slate-950 aspect-[4/3] rounded-3xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center p-6 mb-6 select-none group shadow-inner">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-600/80 border border-red-500/50 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white tracking-widest animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              LIVE VIEW
            </div>
            
            <div className="text-center p-4">
              <Camera className="w-12 h-12 text-indigo-400/70 mx-auto mb-2 animate-pulse" />
              <p className="text-xs text-slate-400 font-medium">Point camera at a building or classroom</p>
              
              <div className="mt-4 flex gap-2 justify-center">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleCustomUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-indigo-400 border border-slate-700/60 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Photo
                </button>
              </div>
            </div>
          </div>

          {/* Preset Locations to Mock Scan */}
          <div className="flex-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Campus Locations & Hotspots</h3>
            <div className="grid grid-cols-1 gap-2.5">
              {locations.map(loc => (
                <div
                  key={loc.id}
                  className={`border rounded-2xl p-3.5 flex items-center justify-between transition-all ${
                    loc.isUnlocked
                      ? "bg-slate-850 border-slate-800 hover:border-indigo-500/30"
                      : "bg-slate-900/40 border-slate-850 opacity-90"
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-bold text-sm text-slate-200 truncate">{loc.name}</h4>
                      {loc.isUnlocked && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {loc.building} • {loc.floor}
                    </p>
                  </div>
                  
                  {loc.isUnlocked ? (
                    <button
                      onClick={() => setSelectedLocationIdForExplorer(loc.id)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl text-xs transition"
                    >
                      View Details
                    </button>
                  ) : (
                    <button
                      onClick={() => startScan(loc.id)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1 shadow-md shadow-indigo-600/10 active:scale-95 animate-pulse"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Scan Place
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
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900">
            {/* Header / Banner */}
            <div className="relative h-44 shrink-0 bg-slate-950">
              <img
                src={selectedLocation.photos[0]}
                alt={selectedLocation.name}
                className="w-full h-full object-cover brightness-60"
              />
              
              {/* Back Button */}
              <button
                onClick={() => setSelectedLocationIdForExplorer(null)}
                className="absolute top-4 left-4 bg-slate-900/80 hover:bg-slate-800 text-white p-2 rounded-full backdrop-blur-xs border border-slate-700/50 transition active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider mb-1.5 inline-block">
                  {selectedLocation.coordinates}
                </span>
                <h2 className="text-lg font-black text-white leading-tight drop-shadow-md">
                  {selectedLocation.name}
                </h2>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5 drop-shadow-sm font-medium">
                  <MapPin className="w-3 h-3 text-indigo-400" />
                  {selectedLocation.building}, {selectedLocation.floor}
                </p>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex border-b border-slate-850 bg-slate-850 shrink-0 text-sm">
              <button
                onClick={() => setDetailsSubTab("info")}
                className={`flex-1 py-3 font-bold border-b-2 text-center transition ${
                  detailsSubTab === "info"
                    ? "text-indigo-400 border-indigo-500"
                    : "text-slate-400 border-transparent hover:text-slate-200"
                }`}
              >
                Facilities & Tips
              </button>
              <button
                onClick={() => setDetailsSubTab("experiences")}
                className={`flex-1 py-3 font-bold border-b-2 text-center transition ${
                  detailsSubTab === "experiences"
                    ? "text-indigo-400 border-indigo-500"
                    : "text-slate-400 border-transparent hover:text-slate-200"
                }`}
              >
                Experiences ({selectedLocation.experiences.length})
              </button>
              <button
                onClick={() => setDetailsSubTab("comments")}
                className={`flex-1 py-3 font-bold border-b-2 text-center transition ${
                  detailsSubTab === "comments"
                    ? "text-indigo-400 border-indigo-500"
                    : "text-slate-400 border-transparent hover:text-slate-200"
                }`}
              >
                Discussions ({selectedLocation.comments.length})
              </button>
            </div>

            {/* Inner Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              {/* TAB 1: INFO & FACILITIES */}
              {detailsSubTab === "info" && (
                <>
                  <div className="text-slate-300 text-xs leading-relaxed bg-slate-850 p-3.5 rounded-2xl border border-slate-805">
                    <p>{selectedLocation.description}</p>
                  </div>

                  {/* Facilities */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Key Facilities & Equipment</h3>
                    <div className="grid grid-cols-1 gap-1.5">
                      {selectedLocation.facilities.map((fac, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-slate-900 border border-slate-805 p-2.5 rounded-xl text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Insider Tips</h3>
                    <div className="space-y-2">
                      {selectedLocation.tips.map((tip, idx) => (
                        <div key={idx} className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-200 font-medium leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Photos Section inside Info tab */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Photo Gallery</h3>
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
                          className="cursor-pointer bg-slate-800 hover:bg-slate-750 text-indigo-400 border border-slate-700/60 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                        >
                          <Plus className="w-3 h-3" /> Add Photo
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedLocation.photos.map((photoUrl, idx) => (
                        <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
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
                  <form onSubmit={submitExperience} className="bg-slate-850 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-slate-300">Share Your Experience</h4>
                    <textarea
                      placeholder="What is it like here? Any secrets, keycard rules, or temperature warnings?"
                      value={experienceText}
                      onChange={e => setExperienceText(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 h-16 placeholder:text-slate-500 resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!experienceText.trim()}
                        className="px-4 py-1.5 bg-indigo-600 disabled:bg-slate-800 hover:bg-indigo-500 text-white font-bold rounded-xl text-[11px] transition active:scale-95 shrink-0"
                      >
                        Publish Experience (+30 XP)
                      </button>
                    </div>
                  </form>

                  {/* Experiences List */}
                  <div className="space-y-3">
                    {selectedLocation.experiences.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No student experiences yet. Be the first to share one!</p>
                    ) : (
                      selectedLocation.experiences.map(exp => (
                        <div key={exp.id} className="bg-slate-900 border border-slate-805 p-3.5 rounded-2xl flex items-start gap-3">
                          <img src={exp.userAvatar} alt={exp.userName} className="w-8 h-8 rounded-lg object-cover border border-slate-700" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-slate-200">{exp.userName}</span>
                              <span className="text-[10px] text-slate-500">{exp.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">{exp.text}</p>
                            
                            <div className="flex items-center gap-3 mt-2">
                              <button className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-350">
                                <ThumbsUp className="w-3 h-3 text-slate-500" />
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
                      placeholder="Ask a question or discuss this place..."
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      className="flex-1 bg-slate-850 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500"
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="bg-indigo-600 disabled:bg-slate-800 text-white font-bold px-4 rounded-xl text-xs transition active:scale-95 shrink-0"
                    >
                      Comment
                    </button>
                  </form>

                  {/* Comment Feed */}
                  <div className="space-y-2.5">
                    {selectedLocation.comments.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No comments here yet. Start the conversation!</p>
                    ) : (
                      selectedLocation.comments.map(c => (
                        <div key={c.id} className="bg-slate-850 border border-slate-805/40 p-3 rounded-xl flex gap-2.5">
                          <img src={c.userAvatar} alt={c.userName} className="w-7 h-7 rounded-md object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-bold text-xs text-slate-200">{c.userName}</span>
                              <span className="text-[9px] text-slate-500">{c.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-300">{c.text}</p>
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
