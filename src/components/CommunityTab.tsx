"use client";

import React, { useState } from "react";
import { Users, MessageSquare, Plus, Heart, Sparkles, ChevronLeft, ArrowRight, UserCheck, Search } from "lucide-react";
import { useApp } from "../context/AppContext";
import { User, DiscussionPost } from "../types";

export default function CommunityTab() {
  const {
    currentUser,
    users,
    discussions,
    connectWithUser,
    addCommentToPost,
    createPost,
    setSelectedUserForModal
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<"people" | "forum">("people");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  
  // Post Filter Tag
  const [filterTag, setFilterTag] = useState<string>("All");
  
  // New Post form state
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState("Q&A");

  // New Reply state
  const [replyText, setReplyText] = useState("");

  // People recommendation filtering
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate Match Score between current user and peer
  const getMatchScore = (peer: User) => {
    const mine = new Set([...currentUser.interests, ...currentUser.skills, ...currentUser.hobbies]);
    const theirs = [...peer.interests, ...peer.skills, ...peer.hobbies];
    
    if (mine.size === 0) return 30; // base fallback
    let matches = 0;
    theirs.forEach(item => {
      if (mine.has(item)) matches++;
    });

    const percent = Math.min(30 + Math.round((matches / mine.size) * 70), 99);
    return percent;
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    createPost(newTitle, newContent, newTag);
    setNewTitle("");
    setNewContent("");
    setShowNewPostForm(false);
  };

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedPostId) return;
    addCommentToPost(selectedPostId, replyText);
    setReplyText("");
  };

  const filteredPosts = filterTag === "All"
    ? discussions
    : discussions.filter(p => p.tag === filterTag);

  const selectedPost = discussions.find(p => p.id === selectedPostId);

  const recommendedPeers = users
    .filter(u => u.id !== currentUser.id)
    .map(u => ({ ...u, matchScore: getMatchScore(u) }))
    .filter(u => {
      if (!searchQuery) return true;
      const term = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(term) ||
        u.interests.some(i => i.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-[#333136] bg-[#f8f7ff]">
      
      {/* HEADER SECTION (Tab selectors) */}
      <div className="bg-white p-4.5 border-b border-[#c5bae8]/20 shrink-0 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <h1 className="text-lg font-black text-[#333136] tracking-wide">
            🗣️ Hub
          </h1>
          {activeSubTab === "forum" && !selectedPostId && (
            <button
              onClick={() => setShowNewPostForm(true)}
              className="px-3.5 py-1.5 bg-[#f28f5f] hover:bg-[#e07f4f] text-white font-black rounded-xl text-[9px] uppercase tracking-wider flex items-center gap-0.5 transition active:scale-95 shadow-sm"
            >
              <Plus className="w-3 h-3" /> New Post
            </button>
          )}
        </div>
        
        {/* Toggle between People recommendations and forum discussions */}
        <div className="flex bg-[#f2efff] p-1 rounded-2xl">
          <button
            onClick={() => { setActiveSubTab("people"); setSelectedPostId(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex justify-center items-center gap-1.5 ${
              activeSubTab === "people" ? "bg-white text-[#f28f5f] shadow-xs" : "text-[#635d73] hover:text-[#333136]"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Matches
          </button>
          <button
            onClick={() => setActiveSubTab("forum")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex justify-center items-center gap-1.5 ${
              activeSubTab === "forum" ? "bg-white text-[#f28f5f] shadow-xs" : "text-[#635d73] hover:text-[#333136]"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Discussions
          </button>
        </div>
      </div>

      {/* DYNAMIC SCROLL CONTAINER */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        
        {/* 1. PEOPLE DISCOVERY SUB-TAB */}
        {activeSubTab === "people" && (
          <div className="p-4.5 space-y-4">
            
            {/* Search filter for interests */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search classmates by interest..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#c5bae8]/20 text-xs text-[#333136] rounded-2xl pl-9 pr-4 py-3 focus:outline-hidden focus:ring-1 focus:ring-[#f28f5f] placeholder:text-slate-405 shadow-xs font-semibold"
              />
            </div>

            <div className="space-y-3">
              {recommendedPeers.length === 0 ? (
                <div className="text-center py-8 bg-white border border-[#c5bae8]/20 p-4 rounded-[24px]">
                  <p className="text-xs text-slate-400">No peers found.</p>
                </div>
              ) : (
                recommendedPeers.map(peer => {
                  const percent = peer.matchScore;
                  return (
                    <div
                      key={peer.id}
                      className="bg-white border border-[#c5bae8]/10 rounded-[32px] p-4.5 flex flex-col hover:border-[#a27cf8]/20 transition shadow-xs"
                    >
                      {/* Top Row: Avatar & Match % */}
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div
                          className="flex items-center gap-3 cursor-pointer min-w-0"
                          onClick={() => setSelectedUserForModal(peer)}
                        >
                          <img
                            src={peer.avatar}
                            alt={peer.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#c5bae8]/20 shrink-0"
                          />
                          <div className="min-w-0">
                            <h3 className="font-bold text-xs text-[#333136] hover:text-[#f28f5f] transition truncate">{peer.name}</h3>
                            <p className="text-[10px] text-slate-500 truncate">@{peer.username}</p>
                          </div>
                        </div>

                        {/* Match Meter */}
                        <div className="flex flex-col items-end shrink-0">
                          <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-lg text-[9px] font-black flex items-center gap-0.5 shadow-xs">
                            <Sparkles className="w-2.5 h-2.5 animate-pulse" /> {percent}% Match
                          </span>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-[#635d73] text-[11px] leading-relaxed line-clamp-2 mb-3.5 font-bold">
                        {peer.bio}
                      </p>

                      {/* Interests matching tags */}
                      <div className="flex flex-wrap gap-1 mb-3.5">
                        {peer.interests.map((interest, idx) => {
                          const matches = currentUser.interests.includes(interest);
                          return (
                            <span
                              key={idx}
                              className={`text-[9px] px-2 py-0.5 rounded-md font-bold ${
                                matches
                                  ? "bg-[#a27cf8]/10 text-[#a27cf8]"
                                  : "bg-[#f2efff] text-[#635d73]"
                              }`}
                            >
                              {interest}
                            </span>
                          );
                        })}
                      </div>

                      {/* Action trigger */}
                      <div className="flex items-center justify-between border-t border-[#c5bae8]/20 pt-3.5 mt-1">
                        <button
                          onClick={() => setSelectedUserForModal(peer)}
                          className="text-[10px] text-[#f28f5f] hover:text-[#e07f4f] font-black flex items-center gap-0.5 uppercase tracking-wider"
                        >
                          View Card <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {peer.isConnected ? (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 py-1 px-2.5 bg-emerald-500/10 rounded-xl">
                            <UserCheck className="w-3 h-3" /> Connected
                          </div>
                        ) : (
                          <button
                            onClick={() => connectWithUser(peer.id)}
                            className="bg-[#f28f5f] hover:bg-[#e07f4f] text-white font-black py-1.5 px-4 rounded-xl text-[9px] uppercase tracking-wider transition active:scale-95 shadow-sm"
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* 2. FORUM DISCUSSIONS SUB-TAB */}
        {activeSubTab === "forum" && !selectedPostId && (
          <div className="p-4.5 space-y-4">
            
            {/* Tag Filter Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
              {["All", "Hackathons", "Workshops", "Q&A"].map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`text-[9px] px-3.5 py-1.5 rounded-xl border font-black uppercase tracking-wider shrink-0 transition ${
                    filterTag === tag
                      ? "bg-[#a27cf8] text-white border-[#a27cf8]"
                      : "bg-white text-[#635d73] border-[#c5bae8]/20 hover:text-[#333136] shadow-xs"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>

            {/* Discussions Feed */}
            <div className="space-y-3">
              {filteredPosts.length === 0 ? (
                <p className="text-xs text-[#635d73] text-center py-6">No discussions yet.</p>
              ) : (
                filteredPosts.map(post => (
                  <div
                    key={post.id}
                    className="bg-white border border-[#c5bae8]/10 rounded-[32px] p-4.5 hover:border-[#a27cf8]/20 transition cursor-pointer shadow-xs"
                    onClick={() => setSelectedPostId(post.id)}
                  >
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-7 h-7 rounded-lg object-cover cursor-pointer shrink-0 border border-[#c5bae8]/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          const author = users.find(u => u.name === post.authorName);
                          if (author) setSelectedUserForModal(author);
                        }}
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[10px] text-[#333136]">{post.authorName}</span>
                          <span className="bg-[#a27cf8]/10 text-[#a27cf8] text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">
                            {post.tag}
                          </span>
                        </div>
                        <span className="text-[9px] text-[#635d73] font-bold">{post.timestamp}</span>
                      </div>
                    </div>

                    <h3 className="font-black text-xs text-[#333136] leading-snug mb-1 hover:text-[#f28f5f] transition">
                      {post.title}
                    </h3>
                    <p className="text-[#635d73] text-[11px] leading-relaxed line-clamp-3 font-semibold">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-4 mt-3.5 border-t border-[#c5bae8]/25 pt-3 text-[8.5px] text-[#a27cf8] font-black uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-[#f28f5f] fill-current" />
                        {post.likes} Likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        {post.comments.length} Replies
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 3. DEDICATED INDIVIDUAL POST DETAIL VIEW */}
        {activeSubTab === "forum" && selectedPostId && selectedPost && (
          <div className="flex flex-col h-full bg-[#f8f7ff]">
            {/* Thread Header */}
            <div className="bg-white p-3.5 border-b border-[#c5bae8]/20 flex items-center gap-3 shadow-xs">
              <button
                onClick={() => setSelectedPostId(null)}
                className="text-slate-400 hover:text-[#333136] p-1 hover:bg-[#f2efff] rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-black text-[#333136] uppercase tracking-wider">Thread Details</span>
            </div>

            {/* Scroller */}
            <div className="flex-1 overflow-y-auto p-4.5 space-y-4 scrollbar-none">
              
              {/* Original Post */}
              <div className="bg-white rounded-[32px] p-4.5 shadow-xs border border-[#c5bae8]/10">
                <div className="flex items-center gap-2.5 mb-3">
                  <img
                    src={selectedPost.authorAvatar}
                    alt={selectedPost.authorName}
                    className="w-7 h-7 rounded-lg object-cover border border-[#c5bae8]/20 cursor-pointer shrink-0"
                    onClick={() => {
                      const author = users.find(u => u.name === selectedPost.authorName);
                      if (author) setSelectedUserForModal(author);
                    }}
                  />
                  <div>
                    <span className="font-bold text-xs text-[#333136] block">{selectedPost.authorName}</span>
                    <span className="text-[9px] text-[#635d73] font-bold">{selectedPost.timestamp}</span>
                  </div>
                  <span className="ml-auto bg-[#a27cf8]/10 text-[#a27cf8] text-[8px] font-black px-2 py-0.5 rounded-md uppercase">
                    {selectedPost.tag}
                  </span>
                </div>

                <h2 className="text-sm font-black text-[#333136] leading-snug mb-2">
                  {selectedPost.title}
                </h2>
                <p className="text-[#635d73] text-xs leading-relaxed whitespace-pre-wrap font-bold">
                  {selectedPost.content}
                </p>

                <div className="flex items-center gap-3 mt-4 text-[9px] text-slate-500 font-bold border-t border-[#c5bae8]/25 pt-3">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-[#f28f5f] fill-current" />
                    {selectedPost.likes} Likes
                  </span>
                </div>
              </div>

              {/* Comments/Replies Feed */}
              <div className="space-y-2">
                <h3 className="text-[9px] font-bold text-[#635d73] uppercase tracking-widest mb-1">
                  Replies ({selectedPost.comments.length})
                </h3>

                {selectedPost.comments.length === 0 ? (
                  <p className="text-xs text-[#635d73] text-center py-4">No replies yet.</p>
                ) : (
                  selectedPost.comments.map(c => (
                    <div key={c.id} className="bg-white border border-[#c5bae8]/10 p-3.5 rounded-[24px] flex gap-2.5 shadow-xs">
                      <img
                        src={c.userAvatar}
                        alt={c.userName}
                        className="w-6 h-6 rounded-lg object-cover cursor-pointer shrink-0 border border-[#c5bae8]/20"
                        onClick={() => {
                          const author = users.find(u => u.name === c.userName);
                          if (author) setSelectedUserForModal(author);
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-xs text-[#333136]">{c.userName}</span>
                          <span className="text-[8px] text-[#635d73] font-bold">{c.timestamp}</span>
                        </div>
                        <p className="text-xs text-[#635d73] leading-relaxed font-bold">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostReply} className="p-3 bg-white border-t border-[#c5bae8]/20 flex gap-2 items-center shadow-md">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="flex-1 bg-[#f8f7ff] border border-[#c5bae8]/20 text-xs text-[#333136] rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-[#f28f5f] placeholder:text-[#635d73]"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-4 py-2 bg-[#f28f5f] disabled:bg-slate-100 disabled:text-slate-400 text-white font-black rounded-xl text-xs uppercase tracking-wider transition active:scale-95 shrink-0"
              >
                Send
              </button>
            </form>
          </div>
        )}

      </div>

      {/* CREATE NEW DISCUSSION POST DRAFT DIALOG OVERLAY */}
      {showNewPostForm && (
        <div className="absolute inset-0 bg-[#070518]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePost}
            className="bg-white border border-[#c5bae8]/25 rounded-[32px] p-5 w-full max-w-xs relative space-y-3.5 shadow-2xl"
          >
            <div className="flex justify-between items-center pb-2 border-b border-[#c5bae8]/20">
              <h3 className="font-black text-xs text-[#333136] uppercase tracking-wide">New Discussion</h3>
              <button
                type="button"
                onClick={() => setShowNewPostForm(false)}
                className="text-[#635d73] hover:text-[#333136] text-xs font-black uppercase"
              >
                Close
              </button>
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Title</label>
              <input
                type="text"
                placeholder="What is your topic?"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
                className="w-full bg-[#f8f7ff] border border-[#c5bae8]/20 text-xs text-[#333136] rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-[#f28f5f] placeholder:text-slate-450"
              />
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Tag Category</label>
              <select
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                className="w-full bg-[#f8f7ff] border border-[#c5bae8]/20 text-xs text-[#333136] rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-[#f28f5f]"
              >
                <option value="Q&A">#Q&A</option>
                <option value="Hackathons">#Hackathons</option>
                <option value="Workshops">#Workshops</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Content Details</label>
              <textarea
                placeholder="Details of your post..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                required
                className="w-full bg-[#f8f7ff] border border-[#c5bae8]/20 text-xs text-[#333136] rounded-xl px-3 py-2.5 h-24 resize-none focus:outline-hidden focus:ring-1 focus:ring-[#f28f5f] placeholder:text-slate-455"
              />
            </div>

            <button
              type="submit"
              disabled={!newTitle.trim() || !newContent.trim()}
              className="w-full py-2.5 bg-[#f28f5f] disabled:bg-slate-100 disabled:text-slate-400 text-white font-black rounded-xl text-xs uppercase tracking-wider transition active:scale-95 shadow-sm"
            >
              Publish Post (+30 XP)
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
