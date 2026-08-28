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
    <div className="flex-1 flex flex-col h-full overflow-hidden text-slate-100 bg-[#070518]">
      
      {/* HEADER SECTION (Tab selectors, clean look) */}
      <div className="bg-[#120e2e] p-4.5 border-b border-[#1b1548]/40 shrink-0 shadow-md">
        <div className="flex items-center justify-between mb-3.5">
          <h1 className="text-lg font-black text-white tracking-wide">
            🗣️ Hub
          </h1>
          {activeSubTab === "forum" && !selectedPostId && (
            <button
              onClick={() => setShowNewPostForm(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-fuchsia-600 to-indigo-650 hover:from-fuchsia-500 text-white font-black rounded-xl text-[9px] uppercase tracking-wider flex items-center gap-0.5 transition active:scale-95 shadow-sm"
            >
              <Plus className="w-3 h-3" /> New Post
            </button>
          )}
        </div>
        
        {/* Toggle between People recommendations and forum discussions */}
        <div className="flex bg-[#070518] p-1 rounded-xl">
          <button
            onClick={() => { setActiveSubTab("people"); setSelectedPostId(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex justify-center items-center gap-1.5 ${
              activeSubTab === "people" ? "bg-[#1d1647] text-fuchsia-400 shadow-xs" : "text-slate-500 hover:text-slate-350"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Matches
          </button>
          <button
            onClick={() => setActiveSubTab("forum")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex justify-center items-center gap-1.5 ${
              activeSubTab === "forum" ? "bg-[#1d1647] text-fuchsia-400 shadow-xs" : "text-slate-500 hover:text-slate-350"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Community
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
                className="w-full bg-[#120e2e] border border-[#20174c]/50 text-xs text-slate-200 rounded-2xl pl-9 pr-4 py-3 focus:outline-hidden focus:ring-1 focus:ring-fuchsia-500 placeholder:text-slate-500 shadow-xs font-semibold"
              />
            </div>

            <div className="space-y-3">
              {recommendedPeers.length === 0 ? (
                <div className="text-center py-8 bg-[#120e2e] border border-[#2b2067]/30 p-4 rounded-xl">
                  <p className="text-xs text-slate-500">No peers found.</p>
                </div>
              ) : (
                recommendedPeers.map(peer => {
                  const percent = peer.matchScore;
                  return (
                    <div
                      key={peer.id}
                      className="bg-[#120e2e] border border-[#231b57]/20 rounded-3xl p-4 flex flex-col hover:border-fuchsia-500/20 transition shadow-sm"
                    >
                      {/* Top Row: Avatar & Match % */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div
                          className="flex items-center gap-3 cursor-pointer min-w-0"
                          onClick={() => setSelectedUserForModal(peer)}
                        >
                          <img
                            src={peer.avatar}
                            alt={peer.name}
                            className="w-9 h-9 rounded-xl object-cover border border-[#2b2067]/40 shrink-0"
                          />
                          <div className="min-w-0">
                            <h3 className="font-bold text-xs text-white hover:text-fuchsia-400 transition truncate">{peer.name}</h3>
                            <p className="text-[10px] text-slate-500 truncate">@{peer.username}</p>
                          </div>
                        </div>

                        {/* Match Meter */}
                        <div className="flex flex-col items-end shrink-0">
                          <span className="bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded-lg text-[9px] font-black flex items-center gap-0.5 shadow-xs">
                            <Sparkles className="w-2.5 h-2.5 animate-pulse" /> {percent}% Match
                          </span>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2 mb-3 font-semibold">
                        {peer.bio}
                      </p>

                      {/* Interests matching tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {peer.interests.map((interest, idx) => {
                          const matches = currentUser.interests.includes(interest);
                          return (
                            <span
                              key={idx}
                              className={`text-[9px] px-2 py-0.5 rounded-md font-bold ${
                                matches
                                  ? "bg-indigo-950/60 text-indigo-300"
                                  : "bg-[#070518] text-slate-550"
                              }`}
                            >
                              {interest}
                            </span>
                          );
                        })}
                      </div>

                      {/* Action trigger */}
                      <div className="flex items-center justify-between border-t border-[#1d1746] pt-3 mt-1.5">
                        <button
                          onClick={() => setSelectedUserForModal(peer)}
                          className="text-[10px] text-fuchsia-400 hover:text-fuchsia-300 font-bold flex items-center gap-0.5"
                        >
                          View Profile <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {peer.isConnected ? (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 py-1 px-2.5 bg-emerald-500/[0.03] rounded-xl">
                            <UserCheck className="w-3 h-3" /> Connected
                          </div>
                        ) : (
                          <button
                            onClick={() => connectWithUser(peer.id)}
                            className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-1 px-3.5 rounded-lg text-[10px] transition active:scale-95 shadow-sm"
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
                  className={`text-[9px] px-3.5 py-1.5 rounded-xl border font-bold shrink-0 transition ${
                    filterTag === tag
                      ? "bg-[#8b5cf6] text-white border-[#8b5cf6]"
                      : "bg-[#120e2e] text-slate-400 border-[#231b57]/20 hover:text-slate-300 shadow-xs"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>

            {/* Discussions Feed */}
            <div className="space-y-3">
              {filteredPosts.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No discussions in this category yet.</p>
              ) : (
                filteredPosts.map(post => (
                  <div
                    key={post.id}
                    className="bg-[#120e2e] border border-[#231b57]/15 rounded-3xl p-4 hover:border-fuchsia-500/20 transition cursor-pointer shadow-sm animate-fade-in"
                    onClick={() => setSelectedPostId(post.id)}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-7 h-7 rounded-lg object-cover cursor-pointer shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          const author = users.find(u => u.name === post.authorName);
                          if (author) setSelectedUserForModal(author);
                        }}
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[10px] text-slate-200">{post.authorName}</span>
                          <span className="bg-indigo-950/70 text-[8px] text-indigo-300 font-extrabold px-1.5 py-0.5 rounded-md uppercase">
                            {post.tag}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-500">{post.timestamp}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-xs text-white leading-snug mb-1 hover:text-fuchsia-400 transition">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3 font-semibold">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-4 mt-3 border-t border-[#1d1746] pt-2.5 text-[8.5px] text-[#a59ef5] font-extrabold uppercase">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-fuchsia-450 fill-current" />
                        {post.likes} Likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
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
          <div className="flex flex-col h-full bg-[#070518]">
            {/* Thread Header */}
            <div className="bg-[#120e2e] p-3.5 border-b border-[#1b1548]/40 flex items-center gap-3 shadow-xs">
              <button
                onClick={() => setSelectedPostId(null)}
                className="text-slate-400 hover:text-white p-1 hover:bg-[#1d1647] rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-slate-350">Discussion Thread</span>
            </div>

            {/* Scroller */}
            <div className="flex-1 overflow-y-auto p-4.5 space-y-4.5 scrollbar-none">
              
              {/* Original Post */}
              <div className="bg-[#120e2e] rounded-3xl p-4.5 shadow-sm">
                <div className="flex items-center gap-2.5 mb-3">
                  <img
                    src={selectedPost.authorAvatar}
                    alt={selectedPost.authorName}
                    className="w-7 h-7 rounded-lg object-cover cursor-pointer shrink-0 border border-[#2b2067]/40"
                    onClick={() => {
                      const author = users.find(u => u.name === selectedPost.authorName);
                      if (author) setSelectedUserForModal(author);
                    }}
                  />
                  <div>
                    <span className="font-bold text-xs text-white block">{selectedPost.authorName}</span>
                    <span className="text-[9px] text-slate-500">{selectedPost.timestamp}</span>
                  </div>
                  <span className="ml-auto bg-indigo-950/70 text-indigo-300 text-[8px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                    {selectedPost.tag}
                  </span>
                </div>

                <h2 className="text-sm font-black text-white leading-snug mb-2">
                  {selectedPost.title}
                </h2>
                <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedPost.content}
                </p>

                <div className="flex items-center gap-3 mt-4 text-[9px] text-slate-500 font-bold border-t border-[#1d1746] pt-3">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-fuchsia-500 fill-current" />
                    {selectedPost.likes} Likes
                  </span>
                </div>
              </div>

              {/* Comments/Replies Feed */}
              <div className="space-y-2">
                <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Replies ({selectedPost.comments.length})
                </h3>

                {selectedPost.comments.length === 0 ? (
                  <p className="text-xs text-slate-550 text-center py-4">No replies yet.</p>
                ) : (
                  selectedPost.comments.map(c => (
                    <div key={c.id} className="bg-[#120e2e]/50 p-3 rounded-2xl flex gap-2.5 shadow-xs">
                      <img
                        src={c.userAvatar}
                        alt={c.userName}
                        className="w-6 h-6 rounded-md object-cover cursor-pointer shrink-0 border border-[#2b2067]/30"
                        onClick={() => {
                          const author = users.find(u => u.name === c.userName);
                          if (author) setSelectedUserForModal(author);
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-xs text-slate-200">{c.userName}</span>
                          <span className="text-[8px] text-slate-500">{c.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-normal">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostReply} className="p-3 bg-[#120e2e] border-t border-[#1b1548]/40 flex gap-2 items-center shadow-md">
              <input
                type="text"
                placeholder="Write a comment..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="flex-1 bg-[#070518] border border-[#20174c]/50 text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-fuchsia-500 placeholder:text-slate-550"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-3.5 py-2 bg-[#8b5cf6] disabled:bg-[#1a1444] disabled:text-slate-500 text-white font-bold rounded-xl text-xs transition active:scale-95 shrink-0"
              >
                Send
              </button>
            </form>
          </div>
        )}

      </div>

      {/* CREATE NEW DISCUSSION POST DRAFT DIALOG OVERLAY */}
      {showNewPostForm && (
        <div className="absolute inset-0 bg-[#070518]/85 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePost}
            className="bg-[#120e2e] border border-[#231b57]/40 rounded-3xl p-5 w-full max-w-xs relative space-y-3.5 shadow-2xl"
          >
            <div className="flex justify-between items-center pb-2 border-b border-[#1d1746]">
              <h3 className="font-bold text-xs text-white uppercase tracking-wide">New Discussion</h3>
              <button
                type="button"
                onClick={() => setShowNewPostForm(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Title</label>
              <input
                type="text"
                placeholder="Question topic..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
                className="w-full bg-[#070518] border border-[#20174c]/50 text-xs text-white rounded-xl px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-fuchsia-500 placeholder:text-slate-550"
              />
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Tag Category</label>
              <select
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                className="w-full bg-[#070518] border border-[#20174c]/50 text-xs text-white rounded-xl px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-fuchsia-500"
              >
                <option value="Q&A">#Q&A</option>
                <option value="Hackathons">#Hackathons</option>
                <option value="Workshops">#Workshops</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Content Details</label>
              <textarea
                placeholder="Details of your post..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                required
                className="w-full bg-[#070518] border border-[#20174c]/50 text-xs text-white rounded-xl px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-fuchsia-500 h-24 resize-none placeholder:text-slate-550"
              />
            </div>

            <button
              type="submit"
              disabled={!newTitle.trim() || !newContent.trim()}
              className="w-full py-2.5 bg-[#8b5cf6] disabled:bg-[#1a1444] disabled:text-slate-500 text-white font-bold rounded-xl text-xs transition active:scale-95 shadow-sm"
            >
              Publish Post (+30 XP)
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
