export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  interests: string[];
  skills: string[];
  hobbies: string[];
  bio: string;
  joinedDate: string;
  isConnected?: boolean;
  isPending?: boolean;
  exploreStreak: number;
  lastExploredDate?: string;
  passportStamps: string[]; // List of location IDs stamped
  unlockedMapTiles: string[]; // List of MapTile IDs revealed
}

export interface Experience {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  photos?: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface Location {
  id: string;
  name: string;
  building: string;
  floor: string;
  description: string;
  facilities: string[];
  experiences: Experience[];
  comments: Comment[];
  photos: string[];
  tips: string[];
  isUnlocked: boolean;
  coordinates: string;
  rarity: "Common Hotspot" | "First to Document" | "Hidden Gem" | "Secret Sanctuary";
  isFirstEverScanned: boolean; // True if scanned first time ever by this user
  zoneId: string; // matches MapTile id
}

export interface DiscussionPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  tag: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  sharedLocationId?: string; // Links to a Location object
  timestamp: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface MapTile {
  id: string;
  name: string;
  coordinates: string;
  isRevealed: boolean;
  associatedLocationId: string;
  icon: string;
}

export interface ScavengerQuest {
  id: string;
  title: string;
  targetLocationIds: string[];
  completedLocationIds: string[];
  isActive: boolean;
  rewardBadgeId: string;
}
