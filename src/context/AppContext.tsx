"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Location, DiscussionPost, Badge, Message, Comment, Experience, MapTile, ScavengerQuest } from "../types";
import { MOCK_USERS, MOCK_LOCATIONS, MOCK_DISCUSSIONS, MOCK_BADGES, MOCK_MAP_TILES, MOCK_QUESTS } from "../utils/mockData";

interface AppContextType {
  currentUser: User;
  users: User[];
  locations: Location[];
  discussions: DiscussionPost[];
  messages: Record<string, Message[]>; // Key: userId
  badges: Badge[];
  quests: ScavengerQuest[];
  mapTiles: MapTile[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedUserForModal: User | null;
  setSelectedUserForModal: (user: User | null) => void;
  selectedLocationIdForExplorer: string | null;
  setSelectedLocationIdForExplorer: (id: string | null) => void;
  
  // Gamification & XP actions
  addXP: (amount: number) => { leveledUp: boolean; oldLevel: number; newLevel: number } | null;
  levelUpOverlay: { show: boolean; oldLevel: number; newLevel: number } | null;
  closeLevelUpOverlay: () => void;
  toastNotification: string | null;
  showToast: (message: string) => void;
  
  // Action Handlers
  scanLocation: (locationId: string) => void;
  uploadCustomLocationImage: (locationId: string, base64Image: string) => void;
  addExperience: (locationId: string, text: string) => void;
  addCommentToLocation: (locationId: string, text: string) => void;
  addCommentToPost: (postId: string, text: string) => void;
  createPost: (title: string, content: string, tag: string) => void;
  connectWithUser: (userId: string) => void;
  sendMessage: (userId: string, text: string, imageUrl?: string, sharedLocationId?: string) => void;
  incrementGenieCount: () => void;
  unlockBadge: (badgeId: string) => void;
  updateUserProfile: (name: string, bio: string, interests: string[], avatar: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Navigation states
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  // UI overlays
  const [selectedUserForModal, setSelectedUserForModal] = useState<User | null>(null);
  const [selectedLocationIdForExplorer, setSelectedLocationIdForExplorer] = useState<string | null>(null);
  const [levelUpOverlay, setLevelUpOverlay] = useState<{ show: boolean; oldLevel: number; newLevel: number } | null>(null);
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  
  // Genie count for badges
  const [genieCount, setGenieCount] = useState<number>(0);

  // Core Entity States
  const [currentUser, setCurrentUser] = useState<User>({
    id: "me",
    name: "New Explorer",
    username: "freshman_xyz",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
    level: 1,
    xp: 0,
    interests: [],
    skills: [],
    hobbies: [],
    bio: "Setup your interests to find people!",
    joinedDate: "Today",
    exploreStreak: 0,
    passportStamps: [],
    unlockedMapTiles: []
  });

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  const [discussions, setDiscussions] = useState<DiscussionPost[]>(MOCK_DISCUSSIONS);
  const [badges, setBadges] = useState<Badge[]>(MOCK_BADGES);
  const [quests, setQuests] = useState<ScavengerQuest[]>(MOCK_QUESTS);
  const [mapTiles, setMapTiles] = useState<MapTile[]>(MOCK_MAP_TILES);
  
  // Messages pre-populated
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    user_alice: [
      {
        id: "msg_init_1",
        senderId: "user_alice",
        text: "Hey! Welcome to campus. Have you checked out the AI Lab yet?",
        timestamp: "10:30 AM"
      },
      {
        id: "msg_init_2",
        senderId: "me",
        text: "Not yet! Where is it located?",
        timestamp: "10:35 AM"
      },
      {
        id: "msg_init_3",
        senderId: "user_alice",
        text: "It is in Engineering Block C, 3rd Floor. Let me share its details here!",
        timestamp: "10:36 AM"
      },
      {
        id: "msg_init_4",
        senderId: "user_alice",
        text: "",
        sharedLocationId: "loc_ai_lab",
        timestamp: "10:36 AM"
      }
    ],
    user_jordan: [
      {
        id: "msg_init_5",
        senderId: "user_jordan",
        text: "Yo! We are running a small CTF prep tonight. Are you joining the server?",
        timestamp: "Yesterday"
      }
    ]
  });

  // Load from LocalStorage on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("campus_user");
      const storedUsers = localStorage.getItem("campus_users");
      const storedLocations = localStorage.getItem("campus_locations");
      const storedDiscussions = localStorage.getItem("campus_discussions");
      const storedMessages = localStorage.getItem("campus_messages");
      const storedBadges = localStorage.getItem("campus_badges");
      const storedGenieCount = localStorage.getItem("campus_genie_count");
      const storedQuests = localStorage.getItem("campus_quests");
      const storedMapTiles = localStorage.getItem("campus_map_tiles");

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setCurrentUser({
          ...parsed,
          exploreStreak: parsed.exploreStreak || 0,
          passportStamps: parsed.passportStamps || [],
          unlockedMapTiles: parsed.unlockedMapTiles || []
        });
      }
      if (storedUsers) setUsers(JSON.parse(storedUsers));
      if (storedLocations) setLocations(JSON.parse(storedLocations));
      if (storedDiscussions) setDiscussions(JSON.parse(storedDiscussions));
      if (storedMessages) setMessages(JSON.parse(storedMessages));
      if (storedBadges) setBadges(JSON.parse(storedBadges));
      if (storedGenieCount) setGenieCount(parseInt(storedGenieCount, 10));
      if (storedQuests) setQuests(JSON.parse(storedQuests));
      if (storedMapTiles) setMapTiles(JSON.parse(storedMapTiles));
    }
  }, []);

  // Save changes helper
  const saveState = (
    updatedUser: User,
    updatedUsers = users,
    updatedLocations = locations,
    updatedDiscussions = discussions,
    updatedMessages = messages,
    updatedBadges = badges,
    updatedGenie = genieCount,
    updatedQuests = quests,
    updatedMapTiles = mapTiles
  ) => {
    setCurrentUser(updatedUser);
    setUsers(updatedUsers);
    setLocations(updatedLocations);
    setDiscussions(updatedDiscussions);
    setMessages(updatedMessages);
    setBadges(updatedBadges);
    setGenieCount(updatedGenie);
    setQuests(updatedQuests);
    setMapTiles(updatedMapTiles);

    if (typeof window !== "undefined") {
      localStorage.setItem("campus_user", JSON.stringify(updatedUser));
      localStorage.setItem("campus_users", JSON.stringify(updatedUsers));
      localStorage.setItem("campus_locations", JSON.stringify(updatedLocations));
      localStorage.setItem("campus_discussions", JSON.stringify(updatedDiscussions));
      localStorage.setItem("campus_messages", JSON.stringify(updatedMessages));
      localStorage.setItem("campus_badges", JSON.stringify(updatedBadges));
      localStorage.setItem("campus_genie_count", updatedGenie.toString());
      localStorage.setItem("campus_quests", JSON.stringify(updatedQuests));
      localStorage.setItem("campus_map_tiles", JSON.stringify(updatedMapTiles));
    }
  };

  // Toast Helper
  const showToast = (message: string) => {
    setToastNotification(message);
    setTimeout(() => {
      setToastNotification(null);
    }, 3000);
  };

  // Close Level Up Overlay
  const closeLevelUpOverlay = () => {
    setLevelUpOverlay(null);
  };

  // XP Thresholds: Level 1: 0-99, Level 2: 100-249, Level 3: 250-499, Level 4: 500-899, Level 5: 900+
  const getLevelForXP = (xp: number): number => {
    if (xp >= 900) return 5;
    if (xp >= 500) return 4;
    if (xp >= 250) return 3;
    if (xp >= 100) return 2;
    return 1;
  };

  // Gamification XP Adder
  const addXP = (amount: number) => {
    const oldXP = currentUser.xp;
    const newXP = oldXP + amount;
    const oldLevel = currentUser.level;
    const newLevel = getLevelForXP(newXP);
    const leveledUp = newLevel > oldLevel;

    const updatedUser = {
      ...currentUser,
      xp: newXP,
      level: newLevel
    };

    let updatedBadges = [...badges];
    // Auto-unlock level badge
    if (newLevel >= 3) {
      const idx = updatedBadges.findIndex(b => b.id === "badge_level_3");
      if (idx !== -1 && !updatedBadges[idx].unlockedAt) {
        updatedBadges[idx] = { ...updatedBadges[idx], unlockedAt: new Date().toLocaleDateString() };
        showToast(`🏆 Badge Unlocked: ${updatedBadges[idx].name}!`);
      }
    }

    if (leveledUp) {
      setLevelUpOverlay({
        show: true,
        oldLevel,
        newLevel
      });
      showToast(`🎉 Level Up! You reached Level ${newLevel}!`);
    } else {
      showToast(`✨ +${amount} XP Earned!`);
    }

    saveState(updatedUser, users, locations, discussions, messages, updatedBadges);
    return { leveledUp, oldLevel, newLevel };
  };

  // Unlock Badge Helper
  const unlockBadge = (badgeId: string) => {
    const badgeIdx = badges.findIndex(b => b.id === badgeId);
    if (badgeIdx !== -1 && !badges[badgeIdx].unlockedAt) {
      const updatedBadges = [...badges];
      updatedBadges[badgeIdx] = {
        ...updatedBadges[badgeIdx],
        unlockedAt: new Date().toLocaleDateString()
      };
      showToast(`🏆 Badge Unlocked: ${updatedBadges[badgeIdx].name}!`);
      
      // Earn 50 XP bonus for unlocking a badge!
      const currentXP = currentUser.xp;
      const newXP = currentXP + 50;
      const oldLevel = currentUser.level;
      const newLevel = getLevelForXP(newXP);
      const leveledUp = newLevel > oldLevel;

      const updatedUser = {
        ...currentUser,
        xp: newXP,
        level: newLevel
      };

      if (leveledUp) {
        setLevelUpOverlay({ show: true, oldLevel, newLevel });
      }

      saveState(updatedUser, users, locations, discussions, messages, updatedBadges);
    }
  };

  // Camera Scanning Place
  const scanLocation = (locationId: string) => {
    const targetLoc = locations.find(l => l.id === locationId);
    if (!targetLoc) return;

    const updatedLocations = locations.map(loc => {
      if (loc.id === locationId) {
        return { ...loc, isUnlocked: true };
      }
      return loc;
    });

    let updatedQuests = [...quests];
    let updatedMapTiles = [...mapTiles];
    let updatedBadges = [...badges];

    // 1. Stamp Passport if not already stamped
    const isAlreadyStamped = currentUser.passportStamps.includes(locationId);
    const updatedPassportStamps = isAlreadyStamped 
      ? currentUser.passportStamps 
      : [...currentUser.passportStamps, locationId];

    // 2. Reveal map tile (Fog of war map unlock)
    const associatedTile = mapTiles.find(t => t.associatedLocationId === locationId);
    const updatedUnlockedMapTiles = [...currentUser.unlockedMapTiles];
    if (associatedTile) {
      if (!updatedUnlockedMapTiles.includes(associatedTile.id)) {
        updatedUnlockedMapTiles.push(associatedTile.id);
      }
      updatedMapTiles = mapTiles.map(t => {
        if (t.id === associatedTile.id) {
          return { ...t, isRevealed: true };
        }
        return t;
      });
    }

    // 3. XP calculation (Points for first-ever photo, smaller if already scanned)
    const isFirstTimeScanForMe = !currentUser.passportStamps.includes(locationId);
    let pointsAwarded = 50;
    let firstEverScannedAward = false;

    if (isFirstTimeScanForMe) {
      if (!targetLoc.isUnlocked) {
        // This is the FIRST user ever to identify this spot!
        pointsAwarded = 120; // Big bonus points
        firstEverScannedAward = true;
      } else {
        pointsAwarded = 60; // Standard new place scan points
      }
    } else {
      pointsAwarded = 15; // Re-scan points
    }

    // 4. Update Quest progress (Freshers Scavenger Hunt)
    updatedQuests = quests.map(q => {
      if (q.isActive && q.targetLocationIds.includes(locationId)) {
        const completed = q.completedLocationIds.includes(locationId)
          ? q.completedLocationIds
          : [...q.completedLocationIds, locationId];
        
        // Check if quest completed
        const isQuestDone = q.targetLocationIds.every(id => completed.includes(id) || id === locationId);
        if (isQuestDone && !q.completedLocationIds.every(id => completed.includes(id))) {
          // Award quest badge
          const badgeIndex = updatedBadges.findIndex(b => b.id === q.rewardBadgeId);
          if (badgeIndex !== -1 && !updatedBadges[badgeIndex].unlockedAt) {
            updatedBadges[badgeIndex] = {
              ...updatedBadges[badgeIndex],
              unlockedAt: new Date().toLocaleDateString()
            };
            setTimeout(() => {
              showToast(`🏆 Scavenger Hunt Complete! Unlocked: ${updatedBadges[badgeIndex].name}`);
            }, 1000);
            pointsAwarded += 100; // Quest completion XP bonus
          }
        }

        return { ...q, completedLocationIds: completed };
      }
      return q;
    });

    // 5. Update Daily Explore Streak
    let newStreak = currentUser.exploreStreak;
    const todayStr = new Date().toDateString();
    
    if (currentUser.lastExploredDate) {
      const lastDate = new Date(currentUser.lastExploredDate);
      const todayDate = new Date(todayStr);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        newStreak += 1;
        pointsAwarded += 25; // streak bonus!
        setTimeout(() => showToast(`🔥 Daily Streak! ${newStreak} Days (+25 XP Streak Bonus)`), 500);
      } else if (diffDays > 1) {
        newStreak = 1;
        setTimeout(() => showToast(`🔥 Explore Streak started! Day 1`), 500);
      }
    } else {
      newStreak = 1;
      setTimeout(() => showToast(`🔥 Explore Streak started! Day 1`), 500);
    }

    // 6. Check full Passport Completion
    if (updatedPassportStamps.length >= locations.length) {
      const travIndex = updatedBadges.findIndex(b => b.id === "badge_passport_full");
      if (travIndex !== -1 && !updatedBadges[travIndex].unlockedAt) {
        updatedBadges[travIndex] = {
          ...updatedBadges[travIndex],
          unlockedAt: new Date().toLocaleDateString()
        };
        setTimeout(() => showToast(`🏆 Passport Completed! Unlocked: World Traveler`), 1500);
        pointsAwarded += 100;
      }
    }

    // 7. Check "First to Document" badge
    if (firstEverScannedAward) {
      const docIndex = updatedBadges.findIndex(b => b.id === "badge_first_doc");
      if (docIndex !== -1 && !updatedBadges[docIndex].unlockedAt) {
        updatedBadges[docIndex] = {
          ...updatedBadges[docIndex],
          unlockedAt: new Date().toLocaleDateString()
        };
        setTimeout(() => showToast(`🏆 Unlocked: Pioneer Documenter badge!`), 2000);
      }
    }

    // Level check
    const userXP = currentUser.xp + pointsAwarded;
    const oldLevel = currentUser.level;
    const newLevel = getLevelForXP(userXP);
    const leveledUp = newLevel > oldLevel;

    const updatedUser = {
      ...currentUser,
      xp: userXP,
      level: newLevel,
      exploreStreak: newStreak,
      lastExploredDate: todayStr,
      passportStamps: updatedPassportStamps,
      unlockedMapTiles: updatedUnlockedMapTiles
    };

    if (leveledUp) {
      setLevelUpOverlay({ show: true, oldLevel, newLevel });
    }

    // Unlock First Scan Badge
    const badgeIdx = updatedBadges.findIndex(b => b.id === "badge_first_scan");
    if (badgeIdx !== -1 && !updatedBadges[badgeIdx].unlockedAt) {
      updatedBadges[badgeIdx] = { ...updatedBadges[badgeIdx], unlockedAt: new Date().toLocaleDateString() };
      showToast(`🏆 Badge Unlocked: ${updatedBadges[badgeIdx].name}!`);
    }

    showToast(`📸 Location Identified! (${targetLoc.rarity}) +${pointsAwarded} XP`);
    
    saveState(
      updatedUser,
      users,
      updatedLocations,
      discussions,
      messages,
      updatedBadges,
      genieCount,
      updatedQuests,
      updatedMapTiles
    );
    
    // Auto set as active scanned location in UI
    setSelectedLocationIdForExplorer(locationId);
  };

  const uploadCustomLocationImage = (locationId: string, base64Image: string) => {
    const updatedLocations = locations.map(loc => {
      if (loc.id === locationId) {
        return {
          ...loc,
          photos: [base64Image, ...loc.photos]
        };
      }
      return loc;
    });
    
    showToast("📸 Image uploaded successfully! +20 XP");
    
    // Award 20 XP for uploading photo
    const userXP = currentUser.xp + 20;
    const oldLevel = currentUser.level;
    const newLevel = getLevelForXP(userXP);
    const updatedUser = {
      ...currentUser,
      xp: userXP,
      level: newLevel
    };
    
    if (newLevel > oldLevel) {
      setLevelUpOverlay({ show: true, oldLevel, newLevel });
    }

    saveState(updatedUser, users, updatedLocations);
  };

  // Add Experiences
  const addExperience = (locationId: string, text: string) => {
    const newExp: Experience = {
      id: `exp_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text,
      timestamp: "Just now",
      likes: 0
    };

    const updatedLocations = locations.map(loc => {
      if (loc.id === locationId) {
        return {
          ...loc,
          experiences: [newExp, ...loc.experiences]
        };
      }
      return loc;
    });

    // XP
    const userXP = currentUser.xp + 30;
    const oldLevel = currentUser.level;
    const newLevel = getLevelForXP(userXP);
    const updatedUser = { ...currentUser, xp: userXP, level: newLevel };
    if (newLevel > oldLevel) setLevelUpOverlay({ show: true, oldLevel, newLevel });

    let updatedBadges = [...badges];
    const badgeIdx = badges.findIndex(b => b.id === "badge_community_voice");
    if (badgeIdx !== -1 && !updatedBadges[badgeIdx].unlockedAt) {
      updatedBadges[badgeIdx] = { ...updatedBadges[badgeIdx], unlockedAt: new Date().toLocaleDateString() };
      showToast(`🏆 Badge Unlocked: ${updatedBadges[badgeIdx].name}!`);
    }

    showToast("✍️ Experience shared! +30 XP");
    saveState(updatedUser, users, updatedLocations, discussions, messages, updatedBadges);
  };

  // Add Comment to Location Details
  const addCommentToLocation = (locationId: string, text: string) => {
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text,
      timestamp: "Just now"
    };

    const updatedLocations = locations.map(loc => {
      if (loc.id === locationId) {
        return {
          ...loc,
          comments: [...loc.comments, newComment]
        };
      }
      return loc;
    });

    // XP
    const userXP = currentUser.xp + 10;
    const oldLevel = currentUser.level;
    const newLevel = getLevelForXP(userXP);
    const updatedUser = { ...currentUser, xp: userXP, level: newLevel };
    if (newLevel > oldLevel) setLevelUpOverlay({ show: true, oldLevel, newLevel });

    showToast("💬 Comment posted! +10 XP");
    saveState(updatedUser, users, updatedLocations);
  };

  // Add Comment to Discussion Post
  const addCommentToPost = (postId: string, text: string) => {
    const newComment: Comment = {
      id: `c_d_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text,
      timestamp: "Just now"
    };

    const updatedDiscussions = discussions.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    });

    // XP
    const userXP = currentUser.xp + 10;
    const oldLevel = currentUser.level;
    const newLevel = getLevelForXP(userXP);
    const updatedUser = { ...currentUser, xp: userXP, level: newLevel };
    if (newLevel > oldLevel) setLevelUpOverlay({ show: true, oldLevel, newLevel });

    showToast("💬 Reply added! +10 XP");
    saveState(updatedUser, users, locations, updatedDiscussions);
  };

  // Create discussion post
  const createPost = (title: string, content: string, tag: string) => {
    const newPost: DiscussionPost = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      title,
      content,
      tag,
      likes: 0,
      comments: [],
      timestamp: "Just now"
    };

    const updatedDiscussions = [newPost, ...discussions];

    // XP & Badge
    const userXP = currentUser.xp + 30;
    const oldLevel = currentUser.level;
    const newLevel = getLevelForXP(userXP);
    const updatedUser = { ...currentUser, xp: userXP, level: newLevel };
    if (newLevel > oldLevel) setLevelUpOverlay({ show: true, oldLevel, newLevel });

    let updatedBadges = [...badges];
    const badgeIdx = badges.findIndex(b => b.id === "badge_community_voice");
    if (badgeIdx !== -1 && !updatedBadges[badgeIdx].unlockedAt) {
      updatedBadges[badgeIdx] = { ...updatedBadges[badgeIdx], unlockedAt: new Date().toLocaleDateString() };
      showToast(`🏆 Badge Unlocked: ${updatedBadges[badgeIdx].name}!`);
    }

    showToast("🗣️ Discussion started! +30 XP");
    saveState(updatedUser, users, locations, updatedDiscussions, messages, updatedBadges);
  };

  // Connect request with user
  const connectWithUser = (userId: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          isConnected: true
        };
      }
      return u;
    });

    // Create DM thread immediately
    const updatedMessages = { ...messages };
    if (!updatedMessages[userId]) {
      updatedMessages[userId] = [
        {
          id: `msg_c_${Date.now()}`,
          senderId: userId,
          text: `Hey, I accepted your connect request! We share interests in ${users.find(u => u.id === userId)?.interests.join(", ")}. Let's chat!`,
          timestamp: "Just now"
        }
      ];
    }

    // Award XP
    const userXP = currentUser.xp + 20;
    const oldLevel = currentUser.level;
    const newLevel = getLevelForXP(userXP);
    const updatedUser = { ...currentUser, xp: userXP, level: newLevel };
    if (newLevel > oldLevel) setLevelUpOverlay({ show: true, oldLevel, newLevel });

    showToast(`👥 Connected with ${users.find(u => u.id === userId)?.name}! +20 XP`);
    saveState(updatedUser, updatedUsers, locations, discussions, updatedMessages);
  };

  // Send Direct Message
  const sendMessage = (userId: string, text: string, imageUrl?: string, sharedLocationId?: string) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: "me",
      text,
      imageUrl,
      sharedLocationId,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const thread = messages[userId] ? [...messages[userId]] : [];
    const updatedMessages = {
      ...messages,
      [userId]: [...thread, newMsg]
    };

    // XP
    const userXP = currentUser.xp + 5;
    const oldLevel = currentUser.level;
    const newLevel = getLevelForXP(userXP);
    const updatedUser = { ...currentUser, xp: userXP, level: newLevel };
    if (newLevel > oldLevel) setLevelUpOverlay({ show: true, oldLevel, newLevel });

    // Badge Check: "Social Butterfly"
    let activeThreadsCount = 0;
    Object.keys(updatedMessages).forEach(key => {
      const activeThread = updatedMessages[key];
      const hasMeSent = activeThread.some(m => m.senderId === "me");
      if (hasMeSent) activeThreadsCount++;
    });

    let updatedBadges = [...badges];
    if (activeThreadsCount >= 2) {
      const badgeIdx = badges.findIndex(b => b.id === "badge_social_butterfly");
      if (badgeIdx !== -1 && !updatedBadges[badgeIdx].unlockedAt) {
        updatedBadges[badgeIdx] = { ...updatedBadges[badgeIdx], unlockedAt: new Date().toLocaleDateString() };
        showToast(`🏆 Badge Unlocked: ${updatedBadges[badgeIdx].name}!`);
      }
    }

    saveState(updatedUser, users, locations, discussions, updatedMessages, updatedBadges);

    // Mock auto reply
    setTimeout(() => {
      const peerReply: Message = {
        id: `msg_reply_${Date.now()}`,
        senderId: userId,
        text: `Thanks for messaging! Let's catch up sometime at the canteen or lab.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => {
        const currentThread = prev[userId] ? [...prev[userId]] : [];
        const finalMessages = {
          ...prev,
          [userId]: [...currentThread, peerReply]
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("campus_messages", JSON.stringify(finalMessages));
        }
        return finalMessages;
      });
    }, 1500);
  };

  // Genie Bot Question Counter
  const incrementGenieCount = () => {
    const nextCount = genieCount + 1;
    let updatedBadges = [...badges];
    
    if (nextCount >= 3) {
      const badgeIdx = badges.findIndex(b => b.id === "badge_genie_bff");
      if (badgeIdx !== -1 && !updatedBadges[badgeIdx].unlockedAt) {
        updatedBadges[badgeIdx] = { ...updatedBadges[badgeIdx], unlockedAt: new Date().toLocaleDateString() };
        showToast(`🏆 Badge Unlocked: ${updatedBadges[badgeIdx].name}!`);
      }
    }

    // Award 10 XP
    const userXP = currentUser.xp + 10;
    const oldLevel = currentUser.level;
    const newLevel = getLevelForXP(userXP);
    const updatedUser = { ...currentUser, xp: userXP, level: newLevel };
    if (newLevel > oldLevel) setLevelUpOverlay({ show: true, oldLevel, newLevel });

    saveState(updatedUser, users, locations, discussions, messages, updatedBadges, nextCount);
  };

  // Modify User Profile Details
  const updateUserProfile = (name: string, bio: string, interests: string[], avatar: string) => {
    const updatedUser = {
      ...currentUser,
      name,
      bio,
      interests,
      avatar
    };

    saveState(updatedUser);
    showToast("👤 Profile updated successfully!");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        locations,
        discussions,
        messages,
        badges,
        quests,
        mapTiles,
        activeTab,
        setActiveTab,
        selectedUserForModal,
        setSelectedUserForModal,
        selectedLocationIdForExplorer,
        setSelectedLocationIdForExplorer,
        addXP,
        levelUpOverlay,
        closeLevelUpOverlay,
        toastNotification,
        showToast,
        scanLocation,
        uploadCustomLocationImage,
        addExperience,
        addCommentToLocation,
        addCommentToPost,
        createPost,
        connectWithUser,
        sendMessage,
        incrementGenieCount,
        unlockBadge,
        updateUserProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
