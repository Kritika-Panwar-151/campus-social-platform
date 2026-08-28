import { User, Location, DiscussionPost, Badge, MapTile, ScavengerQuest } from "../types";

export const MOCK_USERS: User[] = [
  {
    id: "user_alice",
    name: "Alice Carter",
    username: "alice_codes",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    level: 3,
    xp: 280,
    interests: ["AI", "Hackathons", "Web Dev"],
    skills: ["React", "Python", "TypeScript"],
    hobbies: ["Chess", "Hiking", "Specialty Coffee"],
    bio: "CS sophomore | Passionate about full-stack development and NLP | Let's build something cool!",
    joinedDate: "Sep 2025",
    isConnected: true,
    exploreStreak: 3,
    passportStamps: ["loc_ai_lab", "loc_library"],
    unlockedMapTiles: ["tile_engineering", "tile_library"]
  },
  {
    id: "user_david",
    name: "David Kim",
    username: "maker_dave",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    level: 4,
    xp: 410,
    interests: ["Robotics", "IoT", "3D Printing"],
    skills: ["C++", "ROS", "Soldering", "Fusion 360"],
    hobbies: ["Anime", "Table Tennis", "Drone Flying"],
    bio: "Electrical Engineering Senior | VP of the Campus Robotics & Maker Club | Hardware geek.",
    joinedDate: "Mar 2023",
    isConnected: false,
    exploreStreak: 1,
    passportStamps: ["loc_ai_lab"],
    unlockedMapTiles: ["tile_engineering"]
  },
  {
    id: "user_sophia",
    name: "Sophia Patel",
    username: "sophia_clicks",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
    level: 2,
    xp: 180,
    interests: ["Photography", "UI/UX", "Art"],
    skills: ["Figma", "Photoshop", "Lightroom"],
    hobbies: ["Street Photography", "Sketching", "Acoustic Guitar"],
    bio: "Interaction Design Student | Capturing campus life frame by frame | Always down for cafe hops.",
    joinedDate: "Oct 2025",
    isConnected: false,
    exploreStreak: 0,
    passportStamps: ["loc_library"],
    unlockedMapTiles: ["tile_library"]
  },
  {
    id: "user_jordan",
    name: "Jordan Lee",
    username: "net_jordan",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    level: 5,
    xp: 620,
    interests: ["Cybersecurity", "Linux", "CTFs"],
    skills: ["Bash", "Go", "Docker", "Penetration Testing"],
    hobbies: ["PC Gaming", "Bass Guitar", "Retro Tech"],
    bio: "Cybersecurity Analyst major | CTF team captain | Terminal enthusiast. Emacs > Vim.",
    joinedDate: "Sep 2022",
    isConnected: true,
    exploreStreak: 2,
    passportStamps: ["loc_ai_lab", "loc_library"],
    unlockedMapTiles: ["tile_engineering", "tile_library"]
  },
  {
    id: "user_elena",
    name: "Elena Rostova",
    username: "elena_maths",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
    level: 1,
    xp: 90,
    interests: ["Machine Learning", "Data Science", "Math"],
    skills: ["Python", "R", "SQL", "PyTorch"],
    hobbies: ["Reading Novels", "Rowing", "Gardening"],
    bio: "Data Science Freshman | Keen on statistical learning theory and deep learning. Let's study math!",
    joinedDate: "Jan 2026",
    isConnected: false,
    exploreStreak: 0,
    passportStamps: [],
    unlockedMapTiles: []
  }
];

export const MOCK_LOCATIONS: Location[] = [
  {
    id: "loc_ai_lab",
    name: "Robotics & AI Research Lab",
    building: "Engineering Block C",
    floor: "3rd Floor",
    description: "The main hub for machine learning models research, humanoids testing, and advanced physical computing. Packed with high-end hardware.",
    facilities: [
      "High-Performance GPU Server Rack (RTX 4090s)",
      "Universal Robot UR5 Robotic Arm",
      "Interactive Electronics Bench & Soldering Station",
      "Cozy Beanbag Brainstorming Corner"
    ],
    experiences: [
      {
        id: "exp_1",
        userId: "user_david",
        userName: "David Kim",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
        text: "Spend half my life here. The air conditioning is freezing, so always bring a hoodie. Prof. Ross is chill but will lock the soldering irons after hours if they aren't cleaned!",
        timestamp: "2 hours ago",
        likes: 12
      },
      {
        id: "exp_2",
        userId: "user_alice",
        userName: "Alice Carter",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
        text: "The GPU server is awesome, managed to train an LLM here overnight. Best place for coffee chats, everyone's coding random stuff.",
        timestamp: "Yesterday",
        likes: 8
      }
    ],
    comments: [
      {
        id: "c_1",
        userId: "user_jordan",
        userName: "Jordan Lee",
        userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
        text: "Do you guys have the ssh access config? I'm having trouble logging in remotely.",
        timestamp: "1 day ago"
      },
      {
        id: "c_2",
        userId: "user_david",
        userName: "David Kim",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
        text: "Yeah Jordan, check the internal wiki on block-c server or ping Prof Ross.",
        timestamp: "12 hours ago"
      }
    ],
    photos: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80&w=600"
    ],
    tips: [
      "Prof. Evelyn Ross is the supervisor. If you show interest in robotics, she will give you 24/7 keycard access.",
      "The corner cabinet has free snack reserves on Wednesdays!"
    ],
    isUnlocked: true,
    coordinates: "Room C-302",
    rarity: "First to Document",
    isFirstEverScanned: false,
    zoneId: "tile_engineering"
  },
  {
    id: "loc_library",
    name: "Central Library Quiet Zone",
    building: "Library Main Tower",
    floor: "2nd Floor",
    description: "A strictly monitored pin-drop silent zone featuring private study desks, acoustic isolation dividers, and panoramic glass windows looking over the central gardens.",
    facilities: [
      "24 Ergonomic Individual Study Pods",
      "Dual-screen desktop monitors (USB-C hubs)",
      "Overhead warm white adjustable reading lights",
      "High-speed book scanner & digital archive access"
    ],
    experiences: [
      {
        id: "exp_3",
        userId: "user_elena",
        userName: "Elena Rostova",
        userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
        text: "The quiet is absolute. Do not even think about eating chips here, the librarian has superhuman hearing. Best desks are 14 to 18, facing the park.",
        timestamp: "3 days ago",
        likes: 19
      }
    ],
    comments: [
      {
        id: "c_3",
        userId: "user_sophia",
        userName: "Sophia Patel",
        userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
        text: "Desks 14-18 are booked solid during midterms, you have to reserve at 8:00 AM sharp on the app.",
        timestamp: "2 days ago"
      }
    ],
    photos: [
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=600"
    ],
    tips: [
      "Bring active noise-canceling headphones to block out the occasional ventilation humming.",
      "Power outlets are under the desk flaps; push them down to click open."
    ],
    isUnlocked: true,
    coordinates: "East Wing, Level 2",
    rarity: "Common Hotspot",
    isFirstEverScanned: false,
    zoneId: "tile_library"
  },
  {
    id: "loc_canteen",
    name: "Green Canopy Canteen",
    building: "Student Hub",
    floor: "Ground Floor",
    description: "The primary food court specializing in organic, student-priced, farm-to-table cuisine. Filled with plants, skylights, and active student meetups.",
    facilities: [
      "7 Multi-Cuisine Food Vendors (Vegan, Halal, Asian, Pizza)",
      "Cold-brew coffee bar with quick card payment",
      "Eco-composting disposal and dish wash belts",
      "150+ Seats with indoor garden aesthetics"
    ],
    experiences: [
      {
        id: "exp_4",
        userId: "user_sophia",
        userName: "Sophia Patel",
        userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
        text: "The falafel wrap at Vendor 3 is cheap and delicious! Also, Sophia's Café here has the best cold brew. Around 12:30 PM, it's total chaos, so try eating at 11:45 AM or after 1:30 PM.",
        timestamp: "4 days ago",
        likes: 15
      }
    ],
    comments: [
      {
        id: "c_4",
        userId: "user_alice",
        userName: "Alice Carter",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
        text: "Agreed, cold brew there is life-saving during project crunches.",
        timestamp: "3 days ago"
      }
    ],
    photos: [
      "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600"
    ],
    tips: [
      "Show your student ID card on Thursdays for a 15% discount at the juice bar.",
      "The charging points are only at the round wooden tables in the back."
    ],
    isUnlocked: false,
    coordinates: "Hub Area A",
    rarity: "Hidden Gem",
    isFirstEverScanned: false,
    zoneId: "tile_canteen"
  },
  {
    id: "loc_amphitheater",
    name: "Campus Amphitheater",
    building: "Science Plaza",
    floor: "Outdoor Ground",
    description: "An open-air amphitheater made of cut granite steps under massive oak trees. It serves as a study spot by day and an event stage by night.",
    facilities: [
      "Multi-tiered granite step seating (holds ~300)",
      "Built-in waterproof sockets in the pillars",
      "Ambient smart lighting that activates at sunset",
      "Integrated audio speakers linked to Student Union DJ desk"
    ],
    experiences: [
      {
        id: "exp_5",
        userId: "user_jordan",
        userName: "Jordan Lee",
        userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
        text: "The Battle of the Bands happens here! Reading here is therapeutic. Keep an eye out for squirrels, they steal bagels.",
        timestamp: "5 days ago",
        likes: 22
      }
    ],
    comments: [],
    photos: [
      "https://images.unsplash.com/photo-1503095391755-11200683a43f?auto=format&fit=crop&q=80&w=600"
    ],
    tips: [
      "The Wi-Fi signal gets slightly weak near the top steps, sit closer to the central pillars for 100Mbps.",
      "There are free acoustic guitar plug-in stations for anyone to use!"
    ],
    isUnlocked: false,
    coordinates: "Plaza Center",
    rarity: "Secret Sanctuary",
    isFirstEverScanned: false,
    zoneId: "tile_amphitheater"
  }
];

export const MOCK_DISCUSSIONS: DiscussionPost[] = [
  {
    id: "post_1",
    authorId: "user_alice",
    authorName: "Alice Carter",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    title: "Teammates for the upcoming Campus Fintech Hackathon!",
    content: "Hey everyone! The Fintech Hackathon is next weekend (Sep 5-7). I'm planning to build a micro-credit platform for campus club budgets using Next.js and Flask. Looking for a UI/UX designer and someone comfortable with database APIs.",
    tag: "Hackathons",
    likes: 8,
    comments: [
      {
        id: "c_d1",
        userId: "user_sophia",
        userName: "Sophia Patel",
        userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
        text: "I'd love to help with UI/UX! I've been wanting to test some dashboard designs. DMing you!",
        timestamp: "Yesterday"
      },
      {
        id: "c_d2",
        userId: "user_jordan",
        userName: "Jordan Lee",
        userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
        text: "If you need someone to set up the DB, containerize it in Docker and check basic security, hit me up.",
        timestamp: "10 hours ago"
      }
    ],
    timestamp: "1 day ago"
  },
  {
    id: "post_2",
    authorId: "user_david",
    authorName: "David Kim",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    title: "Intro to Arduino Workshop on Tuesday - Engineering Block C Lounge",
    content: "Robotics club is hosting a microcontrollers workshop. We'll be supplying Arduino Unos and basic sensors. No coding background required!",
    tag: "Workshops",
    likes: 14,
    comments: [
      {
        id: "c_d3",
        userId: "user_elena",
        userName: "Elena Rostova",
        userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
        text: "Are we allowed to keep the starter kit components after the workshop?",
        timestamp: "Yesterday"
      },
      {
        id: "c_d4",
        userId: "user_david",
        userName: "David Kim",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
        text: "The kits are borrowed, but we do have some spare sensors and resistors you can take home!",
        timestamp: "12 hours ago"
      }
    ],
    timestamp: "2 days ago"
  }
];

export const MOCK_BADGES: Badge[] = [
  {
    id: "badge_first_scan",
    name: "Shutter Explorer",
    description: "Scan your first campus location to reveal its secrets.",
    icon: "Camera"
  },
  {
    id: "badge_passport_full",
    name: "World Traveler",
    description: "Collect all unique stamps in your Campus Passport.",
    icon: "Map"
  },
  {
    id: "badge_first_doc",
    name: "Pioneer Documenter",
    description: "Be the first to scan and document a legendary hidden spot.",
    icon: "Award"
  },
  {
    id: "badge_freshers_hunt",
    name: "Scavenger Master",
    description: "Complete the Freshers' Week Scavenger Hunt.",
    icon: "Sparkles"
  }
];

export const MOCK_MAP_TILES: MapTile[] = [
  { id: "tile_engineering", name: "Engineering Sector", coordinates: "C-302", isRevealed: true, associatedLocationId: "loc_ai_lab", icon: "Cpu" },
  { id: "tile_library", name: "Library Hub", coordinates: "L-201", isRevealed: true, associatedLocationId: "loc_library", icon: "BookOpen" },
  { id: "tile_canteen", name: "Canteen Area", coordinates: "H-101", isRevealed: false, associatedLocationId: "loc_canteen", icon: "Coffee" },
  { id: "tile_amphitheater", name: "Outdoor Amp", coordinates: "P-502", isRevealed: false, associatedLocationId: "loc_amphitheater", icon: "Music" }
];

export const MOCK_QUESTS: ScavengerQuest[] = [
  {
    id: "quest_freshers",
    title: "Freshers' Week Hunt",
    targetLocationIds: ["loc_ai_lab", "loc_library", "loc_canteen"],
    completedLocationIds: [],
    isActive: true,
    rewardBadgeId: "badge_freshers_hunt"
  }
];

export const GENIE_RESPONSES: Record<string, string> = {
  "where is the ai lab?": "The Robotics & AI Lab is located in Engineering Block C, 3rd Floor (Room C-302). It features GPU clusters and robot arms.",
  "who teaches database management?": "Database Management (CS302) is taught by Dr. Evelyn Ross in IT Hall, Room 102.",
  "what is the gym hours?": "Recreation Center Gym is open from 6:00 AM - 10:00 PM at the Student Hub.",
  "where can i print documents on campus?": "Printing is available at the Central Library (1st Floor) and the Student Union Lounge."
};

export const DEFAULT_GENIE_RESPONSE = "I'm not sure about that, but I can tell you about: buildings, classrooms, teacher hours, printing, or gym! Try asking one of the suggested questions below.";
export const GENIE_QUESTIONS = [
  "Where is the AI lab?",
  "Who teaches Database Management?",
  "What is the gym hours?",
  "Where can I print documents on campus?"
];
