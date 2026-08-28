"use client";

import React, { useState } from "react";
import { Users, MessageSquare, Plus, Heart, Sparkles, Filter, ChevronLeft, ArrowRight, UserCheck, Search } from "lucide-react";
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

  // Recommendations sorted by match percentage
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
    <div className="flex-1 flex flex-col h-full overflow-hidden text-slate-100 bg-slate-900">
      
      {/* HEADER SECTION (Tab selectors) */}
      <div className="bg-slate-850 p-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            🗣️ Campus Hub
          </h1>
          {activeSubTab === "forum" && !selectedPostId && (
            <button
              onClick={() => setShowNewPostForm(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition active:scale-95 shadow-md shadow-indigo-600/10"
            >
              <Plus className="w-3.5 h-3.5" /> Post Draft
            </button>
          )}
        </div>
        
        {/* Toggle between People recommendations and forum discussions */}
        <div className="flex bg-slate-900 p-1 rounded-xl">
          <button
            onClick={() => { setActiveSubTab("people"); setSelectedPostId(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex justify-center items-center gap-1.5 ${
              activeSubTab === "people" ? "bg-slate-800 text-indigo-400 shadow-xs" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Discover People
          </button>
          <button
            onClick={() => setActiveSubTab("forum")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex justify-center items-center gap-1.5 ${
              activeSubTab === "forum" ? "bg-slate-800 text-indigo-400 shadow-xs" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Discussions
          </button>
        </div>
      </div>

      {/* DYNAMIC SCROLL CONTAINER */}
      <div className="flex-1 overflow-y-auto">
        
        {/* 1. PEOPLE DISCOVERY SUB-TAB */}
        {activeSubTab === "people" && (
          <div className="p-5 space-y-4">
            
            {/* Search filter for interests */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search peers by name or interest (e.g. AI)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-850 border border-slate-800 text-xs text-slate-200 rounded-xl pl-9 pr-4 py-3 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-3">
              {recommendedPeers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-500">No matching peers found. Try customizing your profile interests!</p>
                </div>
              ) : (
                recommendedPeers.map(peer => {
                  const percent = peer.matchScore;
                  return (
                    <div
                      key={peer.id}
                      className="bg-slate-850 border border-slate-800/80 rounded-2xl p-4 flex flex-col hover:border-slate-700/80 transition shadow-xs"
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
                            className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <h3 className="font-bold text-xs text-slate-200 hover:text-indigo-400 transition truncate">{peer.name}</h3>
                            <p className="text-[10px] text-slate-500 truncate">@{peer.username}</p>
                          </div>
                        </div>

                        {/* Match Meter */}
                        <div className="flex flex-col items-end shrink-0">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> {percent}% Match
                          </span>
                          <span className="text-[8px] text-slate-500 font-semibold uppercase mt-0.5">Complementary</span>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2 mb-3">
                        {peer.bio}
                      </p>

                      {/* Interests matching tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {peer.interests.map((interest, idx) => {
                          const matches = currentUser.interests.includes(interest);
                          return (
                            <span
                              key={idx}
                              className={`text-[9px] px-2 py-0.5 rounded-md font-medium border ${
                                matches
                                  ? "bg-indigo-950/70 text-indigo-300 border-indigo-500/30"
                                  : "bg-slate-900 text-slate-500 border-slate-800"
                              }`}
                            >
                              {interest}
                            </span>
                          );
                        })}
                      </div>

                      {/* Action trigger */}
                      <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
                        <button
                          onClick={() => setSelectedUserForModal(peer)}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5"
                        >
                          View Card <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {peer.isConnected ? (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 py-1 px-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                            <UserCheck className="w-3.5 h-3.5" /> Connected
                          </div>
                        ) : (
                          <button
                            onClick={() => connectWithUser(peer.id)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1 px-3.5 rounded-xl text-[11px] transition active:scale-95"
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
          <div className="p-5 space-y-4">
            
            {/* Tag Filter Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
              {["All", "Hackathons", "Workshops", "Q&A"].map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`text-[10px] px-3.5 py-1.5 rounded-lg border font-bold shrink-0 transition ${
                    filterTag === tag
                      ? "bg-indigo-600 text-white border-indigo-500"
                      : "bg-slate-850 text-slate-400 border-slate-800 hover:text-slate-200"
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
                    className="bg-slate-850 border border-slate-800 rounded-2xl p-4 hover:border-slate-700/80 transition cursor-pointer"
                    onClick={() => setSelectedPostId(post.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-7 h-7 rounded-md object-cover cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          const author = users.find(u => u.name === post.authorName);
                          if (author) setSelectedUserForModal(author);
                        }}
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[11px] text-slate-200">{post.authorName}</span>
                          <span className="bg-slate-900 border border-slate-800 text-[8px] text-indigo-400 font-bold px-1.5 py-0.5 rounded-md uppercase">
                            {post.tag}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-500">{post.timestamp}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-xs text-white leading-snug mb-1 hover:text-indigo-400 transition">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-4 mt-3 border-t border-slate-800/60 pt-2.5 text-[10px] text-slate-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        {post.likes} Likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {post.comments.length} Comments
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
          <div className="flex flex-col h-full bg-slate-900">
            {/* Thread Header */}
            <div className="bg-slate-850 p-4 border-b border-slate-800 flex items-center gap-3">
              <button
                onClick={() => setSelectedPostId(null)}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-slate-300">Discussion Thread</span>
            </div>

            {/* Scroller */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              {/* Original Post */}
              <div className="bg-slate-850 border border-slate-800/80 rounded-2xl p-4.5">
                <div className="flex items-center gap-2.5 mb-3">
                  <img
                    src={selectedPost.authorAvatar}
                    alt={selectedPost.authorName}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-700 cursor-pointer animate-pulse-once"
                    onClick={() => {
                      const author = users.find(u => u.name === selectedPost.authorName);
                      if (author) setSelectedUserForModal(author);
                    }}
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-200 block">{selectedPost.authorName}</span>
                    <span className="text-[9px] text-slate-500">{selectedPost.timestamp}</span>
                  </div>
                  <span className="ml-auto bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold px-2.5 py-0.5 rounded-md uppercase">
                    {selectedPost.tag}
                  </span>
                </div>

                <h2 className="text-sm font-black text-white leading-snug mb-2">
                  {selectedPost.title}
                </h2>
                <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedPost.content}
                </p>

                <div className="flex items-center gap-3 mt-4 text-[10px] text-slate-500 font-semibold border-t border-slate-800 pt-3">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    {selectedPost.likes} Likes
                  </span>
                </div>
              </div>

              {/* Comments/Replies Feed */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Comments ({selectedPost.comments.length})
                </h3>

                {selectedPost.comments.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No comments yet. Start the conversation!</p>
                ) : (
                  selectedPost.comments.map(c => (
                    <div key={c.id} className="bg-slate-850/60 border border-slate-805/40 p-3 rounded-2xl flex gap-2.5">
                      <img
                        src={c.userAvatar}
                        alt={c.userName}
                        className="w-7 h-7 rounded-md object-cover cursor-pointer shrink-0"
                        onClick={() => {
                          const author = users.find(u => u.name === c.userName);
                          if (author) setSelectedUserForModal(author);
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-xs text-slate-200">{c.userName}</span>
                          <span className="text-[9px] text-slate-500">{c.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-normal">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostReply} className="p-3 bg-slate-850 border-t border-slate-800 flex gap-2 items-center">
              <input
                type="text"
                placeholder="Write a comment..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-4 py-2 bg-indigo-600 disabled:bg-slate-800 text-white font-bold rounded-xl text-xs transition active:scale-95 shrink-0"
              >
                Send
              </button>
            </form>
          </div>
        )}

      </div>

      {/* CREATE NEW DISCUSSION POST DRAFT DIALOG OVERLAY */}
      {showNewPostForm && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePost}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-sm relative space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-slate-200">New Discussion Draft</h3>
              <button
                type="button"
                onClick={() => setShowNewPostForm(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Title</label>
              <input
                type="text"
                placeholder="E.g., Anyone studying in Library quiet zone tonight?"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
                className="w-full bg-slate-850 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Tag Category</label>
              <select
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                className="w-full bg-slate-850 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Q&A">#Q&A</option>
                <option value="Hackathons">#Hackathons</option>
                <option value="Workshops">#Workshops</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Content Details</label>
              <textarea
                placeholder="Describe your question or discussion details..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                required
                className="w-full bg-slate-850 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 h-28 resize-none placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={!newTitle.trim() || !newContent.trim()}
              className="w-full py-3 bg-indigo-600 disabled:bg-slate-800 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition active:scale-95 shadow-md shadow-indigo-600/10"
            >
              Publish Post (+30 XP)
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
