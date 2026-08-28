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
    <div className="flex-1 flex flex-col h-full overflow-hidden text-slate-100 bg-[#0c0822]">
      
      {/* SCANNING LOADER OVERLAY (Semi-dark contrast for visibility) */}
      {scanning && (
        <div className="absolute inset-0 bg-[#070417]/95 z-50 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="relative w-60 h-60 border-2 border-fuchsia-500 rounded-2xl overflow-hidden mb-6 shadow-2xl shadow-fuchsia-500/10 bg-slate-950">
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
            <div className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_10px_#34d399] animate-[bounce_2s_infinite]"></div>
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-fuchsia-400"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-fuchsia-400"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-fuchsia-400"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-fuchsia-400"></div>
          </div>
          <div className="inline-flex p-3 bg-[#ec4899]/15 border border-[#ec4899]/30 rounded-full mb-3 animate-spin">
            <Sparkles className="w-5 h-5 text-fuchsia-400" />
          </div>
          <h3 className="text-md font-bold text-white mb-1">Campus AI Analyzer</h3>
          <p className="text-fuchsia-200 font-mono text-[10px]">{scanStep}</p>
        </div>
      )}

      {/* SCANNING HOME CAMERA VIEW */}
      {!selectedLocationIdForExplorer ? (
        <div className="flex-1 flex flex-col overflow-y-auto p-4.5">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-lg font-black text-white flex items-center gap-1.5">
              📸 Campus Explorer
            </h1>
            <p className="text-[11px] text-[#a59ef5]">Scan real campus spots with AI to unlock details & tips.</p>
          </div>

          {/* Camera Viewport Mockup */}
          <div className="relative bg-[#17123a] aspect-[4/3] rounded-2xl overflow-hidden border border-[#2b2067] flex flex-col items-center justify-center p-6 mb-5 select-none group shadow-inner">
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-fuchsia-600/90 border border-fuchsia-500/30 px-2 py-0.5 rounded-full text-[9px] font-bold text-white tracking-widest animate-pulse">
              <span className="w-1 h-1 rounded-full bg-white"></span>
              SCANNER READY
            </div>
            
            <div className="text-center p-4">
              <Camera className="w-10 h-10 text-fuchsia-400/80 mx-auto mb-2" />
              <p className="text-[11px] text-slate-350 font-semibold">Select below to scan or upload image</p>
              
              <div className="mt-3.5 flex gap-2 justify-center">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleCustomUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-[#251e5c] hover:bg-[#2d246f] text-fuchsia-300 border border-[#3b2e8f] rounded-xl text-[10px] font-bold transition flex items-center gap-1 active:scale-95 shadow-sm"
                >
                  <Upload className="w-3 h-3" />
                  Select Image
                </button>
              </div>
            </div>
          </div>

          {/* Preset Locations to Mock Scan */}
          <div className="flex-1">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Unlocked & Locked Spots</h3>
            <div className="grid grid-cols-1 gap-2">
              {locations.map(loc => (
                <div
                  key={loc.id}
                  className={`border rounded-xl p-3 flex items-center justify-between transition-all ${
                    loc.isUnlocked
                      ? "bg-[#17123a] border-[#2b2067] shadow-sm hover:border-[#ec4899]/30"
                      : "bg-[#0e0a29]/80 border-[#221852]/50 opacity-90"
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h4 className="font-bold text-xs text-slate-200 truncate">{loc.name}</h4>
                      {loc.isUnlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {loc.building} • {loc.floor}
                    </p>
                  </div>
                  
                  {loc.isUnlocked ? (
                    <button
                      onClick={() => setSelectedLocationIdForExplorer(loc.id)}
                      className="px-3 py-1 bg-[#251e5c] hover:bg-[#2d246f] text-slate-300 font-bold rounded-lg text-[10px] transition"
                    >
                      View
                    </button>
                  ) : (
                    <button
                      onClick={() => startScan(loc.id)}
                      className="px-3 py-1 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold rounded-lg text-[10px] transition flex items-center gap-1 shadow-md shadow-[#8b5cf6]/10 active:scale-95 animate-pulse"
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
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0c0822]">
            {/* Header / Banner */}
            <div className="relative h-40 shrink-0 bg-slate-900">
              <img
                src={selectedLocation.photos[0]}
                alt={selectedLocation.name}
                className="w-full h-full object-cover brightness-75"
              />
              
              {/* Back Button */}
              <button
                onClick={() => setSelectedLocationIdForExplorer(null)}
                className="absolute top-4 left-4 bg-[#17123a]/90 hover:bg-[#201954] text-white p-1.5 rounded-full border border-[#2b2067] shadow-md transition active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="bg-[#ec4899] text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider mb-1 inline-block shadow-sm">
                  {selectedLocation.coordinates}
                </span>
                <h2 className="text-md font-black text-white leading-tight drop-shadow-md">
                  {selectedLocation.name}
                </h2>
                <p className="text-[10px] text-slate-200 flex items-center gap-1 mt-0.5 drop-shadow-sm font-semibold">
                  <MapPin className="w-3 h-3 text-fuchsia-300" />
                  {selectedLocation.building}, {selectedLocation.floor}
                </p>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex border-b border-[#211952] bg-[#070417] shrink-0 text-xs">
              <button
                onClick={() => setDetailsSubTab("info")}
                className={`flex-1 py-3 font-bold border-b-2 text-center transition ${
                  detailsSubTab === "info"
                    ? "text-fuchsia-400 border-fuchsia-500"
                    : "text-slate-500 border-transparent hover:text-slate-350"
                }`}
              >
                Info
              </button>
              <button
                onClick={() => setDetailsSubTab("experiences")}
                className={`flex-1 py-3 font-bold border-b-2 text-center transition ${
                  detailsSubTab === "experiences"
                    ? "text-fuchsia-400 border-fuchsia-500"
                    : "text-slate-500 border-transparent hover:text-slate-350"
                }`}
              >
                Experiences ({selectedLocation.experiences.length})
              </button>
              <button
                onClick={() => setDetailsSubTab("comments")}
                className={`flex-1 py-3 font-bold border-b-2 text-center transition ${
                  detailsSubTab === "comments"
                    ? "text-fuchsia-400 border-fuchsia-500"
                    : "text-slate-500 border-transparent hover:text-slate-350"
                }`}
              >
                Q&A ({selectedLocation.comments.length})
              </button>
            </div>

            {/* Inner Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* TAB 1: INFO & FACILITIES */}
              {detailsSubTab === "info" && (
                <>
                  <div className="text-slate-300 text-xs leading-relaxed bg-[#17123a] p-3.5 rounded-2xl border border-[#2b2067] shadow-sm">
                    <p>{selectedLocation.description}</p>
                  </div>

                  {/* Facilities */}
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Facilities</h3>
                    <div className="grid grid-cols-1 gap-1">
                      {selectedLocation.facilities.map((fac, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-[#17123a] border border-[#2b2067] p-2 rounded-xl text-xs text-slate-300 shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-400 shrink-0 mt-0.5" />
                          <span>{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tips</h3>
                    <div className="space-y-1.5">
                      {selectedLocation.tips.map((tip, idx) => (
                        <div key={idx} className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-2.5 flex items-start gap-2 shadow-xs">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-250 font-semibold leading-normal">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Photos Section */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Photo Gallery</h3>
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
                          className="cursor-pointer bg-[#251e5c] hover:bg-[#2d246f] text-fuchsia-300 border border-[#3b2e8f] text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-0.5 transition shadow-sm"
                        >
                          <Plus className="w-2.5 h-2.5" /> Add
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedLocation.photos.map((photoUrl, idx) => (
                        <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-[#2b2067] bg-[#17123a] shadow-sm">
                          <img src={photoUrl} alt="Student upload" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: EXPERIENCES */}
              {detailsSubTab === "experiences" && (
                <div className="space-y-3.5">
                  {/* Share Experience Form */}
                  <form onSubmit={submitExperience} className="bg-[#17123a] border border-[#2b2067] p-3 rounded-xl space-y-2 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-205">Share Your Experience</h4>
                    <textarea
                      placeholder="What is it like here? Any tip or secret?"
                      value={experienceText}
                      onChange={e => setExperienceText(e.target.value)}
                      className="w-full bg-[#0c0822] border border-[#251b5e] text-xs text-slate-100 rounded-xl p-2 focus:outline-hidden focus:ring-1 focus:ring-fuchsia-500 h-14 placeholder:text-slate-500 resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!experienceText.trim()}
                        className="px-3 py-1 bg-[#8b5cf6] disabled:bg-[#1a1444] disabled:text-slate-500 hover:bg-[#7c3aed] text-white font-bold rounded-lg text-[10px] transition active:scale-95 shadow-sm"
                      >
                        Publish (+30 XP)
                      </button>
                    </div>
                  </form>

                  {/* Experiences List */}
                  <div className="space-y-2">
                    {selectedLocation.experiences.length === 0 ? (
                      <p className="text-xs text-slate-550 text-center py-4">No student experiences yet.</p>
                    ) : (
                      selectedLocation.experiences.map(exp => (
                        <div key={exp.id} className="bg-[#17123a] border border-[#2b2067] p-3 rounded-xl flex items-start gap-2.5 shadow-sm">
                          <img src={exp.userAvatar} alt={exp.userName} className="w-7 h-7 rounded-lg object-cover border border-[#251b5e] shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-bold text-xs text-slate-200">{exp.userName}</span>
                              <span className="text-[8px] text-slate-500">{exp.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-normal font-medium">{exp.text}</p>
                            
                            <div className="flex items-center gap-3 mt-1.5">
                              <button className="flex items-center gap-0.5 text-[9px] text-slate-450 hover:text-slate-300">
                                <ThumbsUp className="w-3 h-3 text-slate-450" />
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
                <div className="space-y-3.5">
                  {/* Write Comment Form */}
                  <form onSubmit={submitComment} className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Ask a question about this place..."
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      className="flex-1 bg-[#17123a] border border-[#2b2067] text-xs text-slate-100 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-fuchsia-550 placeholder:text-slate-500 shadow-sm"
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:bg-[#1a1444] disabled:text-slate-500 text-white font-bold px-3 rounded-xl text-xs transition active:scale-95 shadow-sm shrink-0"
                    >
                      Comment
                    </button>
                  </form>

                  {/* Comment Feed */}
                  <div className="space-y-2">
                    {selectedLocation.comments.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No comments here yet.</p>
                    ) : (
                      selectedLocation.comments.map(c => (
                        <div key={c.id} className="bg-[#17123a] border border-[#2b2067]/60 p-2.5 rounded-xl flex gap-2 shadow-xs">
                          <img src={c.userAvatar} alt={c.userName} className="w-6 h-6 rounded-md object-cover border border-[#251b5e] shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-bold text-xs text-slate-200">{c.userName}</span>
                              <span className="text-[8px] text-slate-500">{c.timestamp}</span>
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
