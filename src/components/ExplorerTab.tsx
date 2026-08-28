"use client";

import React, { useState, useRef } from "react";
import { Camera, Sparkles, ChevronLeft, MapPin, ThumbsUp, Upload, CheckCircle2, AlertCircle, Plus, Lock, Eye, BookOpen, Cpu, Coffee, Music, Award } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ExplorerTab() {
  const {
    locations,
    scanLocation,
    uploadCustomLocationImage,
    addExperience,
    addCommentToLocation,
    selectedLocationIdForExplorer,
    setSelectedLocationIdForExplorer,
    currentUser,
    mapTiles,
    quests
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

  // Sub tab inside Explorer: "scanner" or "map" or "passport"
  const [explorerViewMode, setExplorerViewMode] = useState<"scanner" | "map" | "passport">("scanner");

  const startScan = (locId: string) => {
    setScanning(true);
    setScanTargetId(locId);
    
    setScanStep("📸 Initializing AI camera...");
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

  // Helper to render map tile icons
  const renderTileIcon = (iconName: string, revealed: boolean) => {
    const colorClass = revealed ? "text-[#a27cf8]" : "text-slate-400";
    switch (iconName) {
      case "Cpu": return <Cpu className={`w-6 h-6 ${colorClass}`} />;
      case "BookOpen": return <BookOpen className={`w-6 h-6 ${colorClass}`} />;
      case "Coffee": return <Coffee className={`w-6 h-6 ${colorClass}`} />;
      case "Music": return <Music className={`w-6 h-6 ${colorClass}`} />;
      default: return <MapPin className={`w-6 h-6 ${colorClass}`} />;
    }
  };

  // Get active scavenger hunt details
  const activeQuest = quests.find(q => q.isActive);
  const questProgress = activeQuest 
    ? Math.round((activeQuest.completedLocationIds.length / activeQuest.targetLocationIds.length) * 100) 
    : 0;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-[#333136] bg-[#f8f7ff]">
      
      {/* SCANNING LOADER OVERLAY */}
      {scanning && (
        <div className="absolute inset-0 bg-white/98 z-50 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="relative w-52 h-52 border-2 border-[#a27cf8]/30 rounded-[32px] overflow-hidden mb-6 shadow-xl bg-[#f2efff]">
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
                className="w-full h-full object-cover brightness-[0.75]"
              />
            )}
            <div className="absolute left-0 right-0 h-1 bg-[#f28f5f] shadow-[0_0_12px_#f28f5f] animate-[bounce_2s_infinite]"></div>
            <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t-2 border-l-2 border-[#f28f5f]"></div>
            <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t-2 border-r-2 border-[#f28f5f]"></div>
            <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b-2 border-l-2 border-[#f28f5f]"></div>
            <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b-2 border-r-2 border-[#f28f5f]"></div>
          </div>
          <div className="inline-flex p-3 bg-[#a27cf8]/10 rounded-full mb-3 animate-bounce">
            <Sparkles className="w-5 h-5 text-[#a27cf8]" />
          </div>
          <h3 className="text-sm font-black text-[#333136] mb-0.5 tracking-wide">Scanning Spot</h3>
          <p className="text-[#a27cf8] font-mono text-[9px] uppercase tracking-widest font-black">{scanStep}</p>
        </div>
      )}

      {/* EXPLORER TABS MENU */}
      {!selectedLocationIdForExplorer && (
        <div className="bg-white px-5 pt-4 pb-2.5 border-b border-[#c5bae8]/20 shrink-0 shadow-xs flex items-center justify-between">
          <div className="flex bg-[#f2efff] p-1 rounded-2xl w-full">
            <button
              onClick={() => setExplorerViewMode("scanner")}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition ${
                explorerViewMode === "scanner"
                  ? "bg-white text-[#f28f5f] shadow-xs"
                  : "text-[#635d73] hover:text-[#333136]"
              }`}
            >
              Scanner
            </button>
            <button
              onClick={() => setExplorerViewMode("map")}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition ${
                explorerViewMode === "map"
                  ? "bg-white text-[#f28f5f] shadow-xs"
                  : "text-[#635d73] hover:text-[#333136]"
              }`}
            >
              Fog Map
            </button>
            <button
              onClick={() => setExplorerViewMode("passport")}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition ${
                explorerViewMode === "passport"
                  ? "bg-white text-[#f28f5f] shadow-xs"
                  : "text-[#635d73] hover:text-[#333136]"
              }`}
            >
              Passport
            </button>
          </div>
        </div>
      )}

      {/* SCANNING HOME CAMERA VIEW */}
      {!selectedLocationIdForExplorer ? (
        <div className="flex-1 flex flex-col overflow-y-auto p-5 space-y-5 scrollbar-none">
          
          {/* VIEW 1: SCANNER */}
          {explorerViewMode === "scanner" && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between shrink-0">
                <div>
                  <h1 className="text-lg font-black text-[#333136] tracking-wide flex items-center gap-1.5">
                    📸 Campus Scanner
                  </h1>
                  <p className="text-[10px] text-[#635d73] font-bold tracking-wide">Scan campus sights to build your profile.</p>
                </div>
                
                {/* Active Explore Streak widget */}
                <div className="bg-[#f28f5f]/10 border border-[#f28f5f]/20 rounded-full px-3 py-1 flex items-center gap-1 text-[#f28f5f] shrink-0">
                  <span className="text-[10px] font-black">🔥 {currentUser.exploreStreak || 1} Day Streak</span>
                </div>
              </div>

              {/* Scavenger Hunt Event Banner */}
              {activeQuest && (
                <div className="bg-gradient-to-r from-[#a27cf8] to-[#c5bae8] rounded-[24px] p-4 text-white shadow-xs relative overflow-hidden shrink-0">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <span className="bg-white/20 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1.5">
                        ⚡ Live Event
                      </span>
                      <h4 className="text-xs font-black tracking-wide leading-tight">{activeQuest.title}</h4>
                      <p className="text-[9px] text-[#f2efff] mt-1 font-bold">
                        Find and scan the targets to win the limited badge!
                      </p>
                      
                      {/* Quest progress tracker */}
                      <div className="mt-3.5 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/25 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${questProgress}%` }}></div>
                        </div>
                        <span className="text-[9px] font-black shrink-0">{activeQuest.completedLocationIds.length}/{activeQuest.targetLocationIds.length}</span>
                      </div>
                    </div>
                    <div className="p-2 bg-white/25 border border-white/30 rounded-xl shrink-0">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              )}

              {/* Camera Viewport Mockup */}
              <div className="relative bg-white aspect-[4/3] rounded-[32px] overflow-hidden border border-[#c5bae8]/20 flex flex-col items-center justify-center p-6 select-none shadow-sm shrink-0">
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#f2efff] px-2.5 py-1 rounded-full text-[8px] font-black text-[#a27cf8] tracking-wider uppercase">
                  <span className="w-1 h-1 rounded-full bg-[#a27cf8]"></span>
                  Ready to scan
                </div>
                
                <div className="text-center p-4">
                  <Camera className="w-8 h-8 text-[#a27cf8] mx-auto mb-2.5" />
                  <p className="text-[10px] text-[#635d73] font-black">Choose a custom photo to identify spots</p>
                  
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
                      className="px-5 py-2.5 bg-[#f28f5f] hover:bg-[#e07f4f] text-white rounded-full text-[9px] font-black tracking-wider transition active:scale-95 shadow-md shadow-[#f28f5f]/15 uppercase"
                    >
                      Choose Photo
                    </button>
                  </div>
                </div>
              </div>

              {/* Preset Locations to Mock Scan */}
              <div className="space-y-2.5">
                <h3 className="text-[9px] font-bold text-[#635d73] uppercase tracking-widest">Available Spots</h3>
                <div className="space-y-2">
                  {locations.map(loc => (
                    <div
                      key={loc.id}
                      className="bg-white border border-[#c5bae8]/10 rounded-[24px] p-4 flex items-center justify-between shadow-xs hover:border-[#a27cf8]/20 transition-all duration-300"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h4 className="font-bold text-xs text-[#333136] truncate">{loc.name}</h4>
                          {loc.isUnlocked && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-[#635d73] flex items-center gap-1 font-bold">
                          <MapPin className="w-3 h-3 text-[#a27cf8]" />
                          {loc.building} • {loc.floor}
                        </p>
                      </div>
                      
                      {loc.isUnlocked ? (
                        <button
                          onClick={() => setSelectedLocationIdForExplorer(loc.id)}
                          className="px-4 py-2 bg-[#f2efff] text-[#a27cf8] font-black rounded-xl text-[9px] tracking-wider uppercase transition active:scale-95"
                        >
                          Enter
                        </button>
                      ) : (
                        <button
                          onClick={() => startScan(loc.id)}
                          className="px-4 py-2 bg-[#f28f5f] hover:bg-[#e07f4f] text-white font-black rounded-xl text-[9px] tracking-wider uppercase transition flex items-center gap-1 shadow-sm active:scale-95"
                        >
                          <Camera className="w-3 h-3" />
                          Scan
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* VIEW 2: FOG-OF-WAR MAP */}
          {explorerViewMode === "map" && (
            <div className="space-y-4">
              <div>
                <h1 className="text-lg font-black text-[#333136] tracking-wide">
                  🗺️ Fog of War Map
                </h1>
                <p className="text-[10px] text-[#635d73] font-bold tracking-wide">Clear fog tiles by scanning and identifying campus hotspots.</p>
              </div>

              {/* Map grid representation */}
              <div className="grid grid-cols-2 gap-3.5 bg-white p-4.5 rounded-[32px] border border-[#c5bae8]/20 shadow-xs">
                {mapTiles.map(tile => {
                  const revealed = tile.isRevealed;
                  return (
                    <div
                      key={tile.id}
                      onClick={() => revealed && setSelectedLocationIdForExplorer(tile.associatedLocationId)}
                      className={`relative aspect-square rounded-[24px] p-3.5 flex flex-col justify-between transition-all select-none ${
                        revealed
                          ? "bg-[#f2efff] border border-[#a27cf8]/20 shadow-xs cursor-pointer hover:border-[#a27cf8]/50"
                          : "bg-slate-100/50 border border-dashed border-slate-350 opacity-90 cursor-not-allowed"
                      }`}
                    >
                      {/* Top icon and state */}
                      <div className="flex items-start justify-between">
                        <div className={`p-2 rounded-xl ${revealed ? "bg-white" : "bg-slate-200/50"}`}>
                          {renderTileIcon(tile.icon, revealed)}
                        </div>
                        {revealed ? (
                          <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">
                            Revealed
                          </span>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>

                      {/* Info labels */}
                      <div className="mt-2 text-left">
                        <span className={`text-[8px] font-black tracking-widest uppercase block ${revealed ? "text-[#a27cf8]" : "text-slate-400"}`}>
                          {tile.coordinates}
                        </span>
                        <h4 className={`text-xs font-black truncate leading-tight ${revealed ? "text-[#333136]" : "text-slate-400 font-bold"}`}>
                          {revealed ? tile.name : "Fog of War"}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#f2efff] rounded-[24px] p-4 flex gap-2.5 border border-[#a27cf8]/10 shadow-xs">
                <AlertCircle className="w-4 h-4 text-[#a27cf8] shrink-0 mt-0.5" />
                <p className="text-[10px] text-[#635d73] font-bold leading-normal">
                  Each tile represents a unique zone. Unlock the associated building using your camera or scan codes to reveal the detailed map assets, experiences, and comments!
                </p>
              </div>
            </div>
          )}

          {/* VIEW 3: CAMPUS PASSPORT */}
          {explorerViewMode === "passport" && (
            <div className="space-y-4">
              <div>
                <h1 className="text-lg font-black text-[#333136] tracking-wide">
                  ✈️ Campus Passport
                </h1>
                <p className="text-[10px] text-[#635d73] font-bold tracking-wide">Your collection of official inked stamps for unlocked campus zones.</p>
              </div>

              {/* Passport Stamp collection grid */}
              <div className="bg-white p-4.5 rounded-[32px] border border-[#c5bae8]/20 shadow-xs space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {locations.map(loc => {
                    const stamped = (currentUser.passportStamps || []).includes(loc.id);
                    return (
                      <div
                        key={loc.id}
                        className={`aspect-square rounded-[24px] flex flex-col items-center justify-center p-3 text-center border relative overflow-hidden transition-all duration-300 ${
                          stamped
                            ? "bg-white border-2 border-dashed border-[#f28f5f] shadow-xs"
                            : "bg-slate-50/50 border border-dashed border-slate-350 opacity-60"
                        }`}
                      >
                        {stamped ? (
                          <>
                            {/* Ink stamp stamp style layout */}
                            <div className="w-16 h-16 rounded-full border-4 border-[#f28f5f]/40 flex flex-col items-center justify-center rotate-[-12deg] mb-1">
                              <span className="text-[8px] font-black text-[#f28f5f]/50 uppercase tracking-widest">OFFICIAL</span>
                              <span className="text-xs font-black text-[#f28f5f]">{loc.name.split(" ").map(w => w[0]).join("")}</span>
                              <span className="text-[6.5px] font-bold text-[#f28f5f]/60 uppercase">UNLOCKED</span>
                            </div>
                            <span className="text-[9.5px] text-[#333136] font-black truncate max-w-full block">
                              {loc.name}
                            </span>
                            <span className="text-[8px] font-bold text-[#635d73] uppercase tracking-wider block mt-0.5">
                              {loc.rarity}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2 border border-slate-200">
                              <Lock className="w-4 h-4" />
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold max-w-full truncate">
                              {loc.name}
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Set Unlock Progress explanation */}
              <div className="bg-[#f2efff] rounded-[24px] p-4 flex gap-2.5 border border-[#a27cf8]/10 shadow-xs">
                <Sparkles className="w-4 h-4 text-[#a27cf8] shrink-0 mt-0.5" />
                <p className="text-[10px] text-[#635d73] font-bold leading-normal">
                  <strong>Stamp Sets:</strong> Collect all stamps for a building section (e.g. &quot;Engineering Block C&quot;) to auto-unlock exclusive profile background frames and XP badges!
                </p>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* LOCATION DETAILS SCREEN */
        selectedLocation && (
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8f7ff]">
            {/* Header / Banner */}
            <div className="relative h-36 shrink-0 bg-slate-900">
              <img
                src={selectedLocation.photos[0]}
                alt={selectedLocation.name}
                className="w-full h-full object-cover brightness-[0.8]"
              />
              
              {/* Back Button */}
              <button
                onClick={() => setSelectedLocationIdForExplorer(null)}
                className="absolute top-4 left-4 bg-white/90 hover:bg-slate-100 text-[#333136] p-1.5 rounded-full border border-[#c5bae8]/20 shadow-md transition active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <div className="flex gap-1 mb-1">
                  <span className="bg-[#f28f5f] text-white text-[8px] font-black tracking-wider px-2 py-0.5 rounded-md uppercase">
                    {selectedLocation.coordinates}
                  </span>
                  <span className="bg-[#a27cf8] text-white text-[8px] font-black tracking-wider px-2 py-0.5 rounded-md uppercase">
                    {selectedLocation.rarity}
                  </span>
                </div>
                <h2 className="text-sm font-black text-white leading-tight">
                  {selectedLocation.name}
                </h2>
                <p className="text-[9.5px] text-slate-205 flex items-center gap-1 mt-0.5 font-bold">
                  <MapPin className="w-3 h-3 text-[#f28f5f]" />
                  {selectedLocation.building}, {selectedLocation.floor}
                </p>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex border-b border-[#c5bae8]/20 bg-white shrink-0 text-[10px]">
              <button
                onClick={() => setDetailsSubTab("info")}
                className={`flex-1 py-3.5 font-black uppercase tracking-wider text-center transition ${
                  detailsSubTab === "info"
                    ? "text-[#f28f5f] border-b-2 border-[#f28f5f]"
                    : "text-[#635d73] border-transparent hover:text-[#333136]"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setDetailsSubTab("experiences")}
                className={`flex-1 py-3.5 font-black uppercase tracking-wider text-center transition ${
                  detailsSubTab === "experiences"
                    ? "text-[#f28f5f] border-b-2 border-[#f28f5f]"
                    : "text-[#635d73] border-transparent hover:text-[#333136]"
                }`}
              >
                Experiences ({selectedLocation.experiences.length})
              </button>
              <button
                onClick={() => setDetailsSubTab("comments")}
                className={`flex-1 py-3.5 font-black uppercase tracking-wider text-center transition ${
                  detailsSubTab === "comments"
                    ? "text-[#f28f5f] border-b-2 border-[#f28f5f]"
                    : "text-[#635d73] border-transparent hover:text-[#333136]"
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
                  <div className="text-slate-650 text-xs leading-relaxed bg-white p-4 rounded-[24px] border border-[#c5bae8]/10 shadow-xs">
                    <p>{selectedLocation.description}</p>
                  </div>

                  {/* Facilities */}
                  <div className="space-y-2">
                    <h3 className="text-[9px] font-bold text-[#635d73] uppercase tracking-widest">Facilities Available</h3>
                    <div className="space-y-1">
                      {selectedLocation.facilities.map((fac, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-white p-3 rounded-[20px] text-xs text-slate-700 shadow-xs border border-[#c5bae8]/10">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#f28f5f] shrink-0 mt-0.5" />
                          <span>{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="space-y-2">
                    <h3 className="text-[9px] font-bold text-[#635d73] uppercase tracking-widest">Student Tips</h3>
                    <div className="space-y-1.5">
                      {selectedLocation.tips.map((tip, idx) => (
                        <div key={idx} className="bg-[#f2efff] border border-[#a27cf8]/15 rounded-[20px] p-3 flex items-start gap-2.5">
                          <AlertCircle className="w-3.5 h-3.5 text-[#a27cf8] shrink-0 mt-0.5" />
                          <p className="text-xs text-[#635d73] font-bold leading-normal">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Photos Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[9px] font-bold text-[#635d73] uppercase tracking-widest">Photo Gallery</h3>
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
                          className="cursor-pointer bg-[#f2efff] hover:bg-[#e6e0fc] text-[#a27cf8] text-[8px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-0.5 transition shadow-sm"
                        >
                          <Plus className="w-2.5 h-2.5" /> Add
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedLocation.photos.map((photoUrl, idx) => (
                        <div key={idx} className="aspect-video rounded-[20px] overflow-hidden border border-[#c5bae8]/20 bg-white shadow-xs">
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
                  <form onSubmit={submitExperience} className="bg-white p-4 rounded-[24px] border border-[#c5bae8]/10 space-y-3 shadow-xs">
                    <h4 className="text-xs font-bold text-[#333136] tracking-wide">Write Experience</h4>
                    <textarea
                      placeholder="Share tips, secrets, or helpful details..."
                      value={experienceText}
                      onChange={e => setExperienceText(e.target.value)}
                      className="w-full bg-[#f8f7ff] border border-[#c5bae8]/25 text-xs text-[#333136] rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-[#f28f5f] h-16 placeholder:text-slate-450 resize-none font-semibold"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!experienceText.trim()}
                        className="px-4 py-2 bg-[#f28f5f] disabled:bg-slate-100 disabled:text-slate-400 hover:bg-[#e07f4f] text-white font-black rounded-xl text-[9px] tracking-wider uppercase transition active:scale-95 shadow-sm"
                      >
                        Publish (+30 XP)
                      </button>
                    </div>
                  </form>

                  {/* Experiences List */}
                  <div className="space-y-2">
                    {selectedLocation.experiences.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No experiences shared yet.</p>
                    ) : (
                      selectedLocation.experiences.map(exp => (
                        <div key={exp.id} className="bg-white border border-[#c5bae8]/10 p-3.5 rounded-[24px] flex items-start gap-3 shadow-xs">
                          <img src={exp.userAvatar} alt={exp.userName} className="w-7 h-7 rounded-xl object-cover shrink-0 border border-[#c5bae8]/20" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-bold text-xs text-[#333136]">{exp.userName}</span>
                              <span className="text-[8px] text-slate-400">{exp.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-650 leading-relaxed font-bold">{exp.text}</p>
                            
                            <div className="flex items-center gap-3 mt-2">
                              <button className="flex items-center gap-0.5 text-[9px] text-[#635d73] hover:text-[#333136] transition">
                                <ThumbsUp className="w-3 h-3 text-[#635d73]" />
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
                      className="flex-1 bg-white border border-[#c5bae8]/20 text-xs text-[#333136] rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-[#f28f5f] placeholder:text-slate-450 shadow-xs font-semibold"
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="bg-[#f28f5f] hover:bg-[#e07f4f] disabled:bg-slate-100 disabled:text-slate-400 text-white font-black px-4 rounded-xl text-xs transition active:scale-95 shadow-sm shrink-0"
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
                        <div key={c.id} className="bg-white border border-[#c5bae8]/10 p-3 rounded-[20px] flex gap-2.5 shadow-xs">
                          <img src={c.userAvatar} alt={c.userName} className="w-6 h-6 rounded-lg object-cover shrink-0 border border-[#c5bae8]/20" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-bold text-xs text-[#333136]">{c.userName}</span>
                              <span className="text-[8px] text-slate-400">{c.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-600 font-semibold leading-relaxed">{c.text}</p>
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
