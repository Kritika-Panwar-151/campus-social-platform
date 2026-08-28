import { User, Location, DiscussionPost, Badge } from "../types";

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
    isConnected: true
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
    isConnected: false
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
    isConnected: false
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
    isConnected: true
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
    isConnected: false
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
    coordinates: "Room C-302"
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
    coordinates: "East Wing, Level 2"
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
    coordinates: "Hub Area A"
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
        text: "The annual Battle of the Bands happens here! On clear autumn days, reading here is therapeutic. Keep an eye out for squirrels, they steal bagels.",
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
    coordinates: "Plaza Center"
  }
];

export const MOCK_DISCUSSIONS: DiscussionPost[] = [
  {
    id: "post_1",
    authorId: "user_alice",
    authorName: "Alice Carter",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    title: "Looking for teammates for the upcoming Campus Fintech Hackathon!",
    content: "Hey everyone! The Fintech Hackathon is next weekend (Sep 5-7). I'm planning to build a micro-credit platform for campus club budgets using Next.js and Flask. Looking for a UI/UX designer (familiar with Figma) and someone comfortable with database design/APIs. We'll have free pizza and coffee supplied by the sponsors! Let me know if you are interested or drop your interests below.",
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
    content: "The Campus Robotics club is hosting a hands-on intro to microcontrollers. We'll be supplying Arduino Unos, breadboards, and basic sensors. No coding background required, we'll teach you how to blink LEDs, read temperature sensors, and write simple loops. Space is limited to 25 people so RSVP. It starts at 6:30 PM.",
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
  },
  {
    id: "post_3",
    authorId: "user_elena",
    authorName: "Elena Rostova",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
    title: "Best study spots on campus with high-speed Wi-Fi?",
    content: "Hi all! I'm a freshman and I find the library quiet zone a bit too tense. I need places where I can download large PyTorch models while enjoying a hot drink. Where do you all recommend that doesn't have horrible connection speeds?",
    tag: "Q&A",
    likes: 5,
    comments: [
      {
        id: "c_d5",
        userId: "user_alice",
        userName: "Alice Carter",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
        text: "The AI Lab is exactly what you need. Very fast ethernet and Wi-Fi, beanbags, and coffee. Plus you'll find lots of ML students there.",
        timestamp: "5 hours ago"
      }
    ],
    timestamp: "12 hours ago"
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
    id: "badge_community_voice",
    name: "Campus Voice",
    description: "Share an experience or post a community discussion.",
    icon: "MessageSquare"
  },
  {
    id: "badge_genie_bff",
    name: "Genie Whisperer",
    description: "Ask the Genie chatbot 3 or more campus questions.",
    icon: "Sparkles"
  },
  {
    id: "badge_social_butterfly",
    name: "Networker",
    description: "Connect and start direct messaging with a peer.",
    icon: "Users"
  },
  {
    id: "badge_level_3",
    name: "Campus Guide",
    description: "Reach level 3 by accumulating 250 XP.",
    icon: "Award"
  }
];

export const GENIE_RESPONSES: Record<string, string> = {
  "where is the ai lab?": "The **Robotics & AI Research Lab** is located in **Engineering Block C, 3rd Floor (Room C-302)**. It features heavy GPU clusters and robotic arms. Scan its image on the Explorer tab to unlock student experiences!",
  "who teaches database management?": "Database Management (CS302) is taught by **Dr. Evelyn Ross** on Mon/Wed from 10:00 AM - 11:30 AM in **IT Hall, Room 102**. Her office hours are Tue/Thu 2:00 PM - 4:00 PM in IT Hall 304.",
  "what clubs can i join if i'm interested in robotics?": "You should definitely connect with the **Campus Robotics & Maker Club**! They are hosted in Engineering Block C. David Kim is the Vice President. You can find David on the People tab and shoot him a DM!",
  "where can i print documents on campus?": "High-volume printing is available at the **Central Library (1st Floor)** and the **Student Union Lounge**. Both use student card login and charge \$0.05 per B&W page and \$0.20 per color page.",
  "how do i book a study room?": "Go to the library website or scan the QR code located next to the doors of the study pods on the **2nd Floor Central Library**. Bookings are free, but limited to 3 hours per student per day.",
  "what is the wi-fi password?": "Select the SSID **'Campus_Student_Secure'**. Log in using your campus email credentials (e.g. your student ID/alias and portal password). Guests can connect to 'Campus_Guest' after a quick SMS sign-in.",
  "where is the gym?": "The **Campus Recreation Center (Gym)** is located at the South Wing of the Student Hub. It is free for all enrolled students. Opening hours: 6:00 AM - 10:00 PM.",
  "what events are happening this week?": "1. **Fintech Hackathon** starting next Friday (Sept 5) at the Plaza.\n2. **Intro to Arduino** by Robotics Club on Tuesday at 6:30 PM (Block C Lounge).\n3. **Open Mic Night** on Friday at 7:00 PM at the Campus Amphitheater."
};
export const DEFAULT_GENIE_RESPONSE = "I'm not sure about that specific detail, but I can tell you about: buildings, classrooms, teacher office hours, clubs, printing facilities, or events! Try picking one of the quick questions below.";
export const GENIE_QUESTIONS = [
  "Where is the AI lab?",
  "Who teaches Database Management?",
  "What clubs can I join if I'm interested in robotics?",
  "Where can I print documents on campus?",
  "How do I book a study room?",
  "What is the Wi-Fi password?"
];
