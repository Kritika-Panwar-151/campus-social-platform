# 🛠️ Campus Social & Intelligence Platform - Tech Stack

This document outlines the architecture, frameworks, state persistence, styling guidelines, and core engines that power the **Campus Social & Intelligence Platform**.

---

## 🏗️ Core Technologies

### 1. Framework & Core Library
*   **Next.js (v14.2.3)**: Leveraging Next.js App Router for optimized static generation, route structures, and overall build performance.
*   **React (v18)**: Component-driven architecture using React Hooks (`useState`, `useEffect`, `useContext`, `useRef`) for local UI states and life-cycle events.
*   **TypeScript (v5)**: Fully typed codebase enforcing compile-time safety and clear data model contracts for users, chats, posts, and map tiles.

### 2. Styling & Layout Engine
*   **Tailwind CSS (v3.4.1)**: Utility-first CSS classes for layout layouts, flexboxes, margins, and mobile-first responsiveness.
*   **PostCSS (v8)**: CSS post-processing pipeline configured for Tailwind compiling.
*   **Lucide React (v1.35.0)**: Crisp vector icon packages matching the game layout style (e.g., `Compass`, `Bot`, `Award`, `Sparkles`, `MapPin`).

---

## 🎨 Game Theme & UI Palette

The application implements a premium, high-fidelity light-theme mobile game color scheme based on user-supplied specs:

| Palette Name | Hex Color | Usage in UI |
| :--- | :--- | :--- |
| **Ermine White** | `#f8f7ff` / `#ffffff` | Clean background grids, cards, and modal sheets. |
| **Candied Yam** | `#f28f5f` / `#e07f4f` (hover) | Core action buttons, level progress fill, active tabs, and explore streaks. |
| **Purple Illusionist** | `#a27cf8` / `#c5bae8` | Active accent headings, badges indicators, and stamps. |
| **Luscious Purple** | `#635d73` | Grayish dark-purple subtext and secondary labels. |
| **Stiletto** | `#333136` | Charcoal dark main title text. |

### Layout Constraint Rules
*   **Smartphone Mockup Wrapper**: The viewport frame (`PhoneWrapper.tsx`) uses `fixed inset-0` on mobile viewports to prevent layout cutoffs, with a realistic border frame wrapper for desktop devices.
*   **Breathing Margins**: Core grids use horizontal padding `px-5.5` (22px) and bottom padding `pb-6` on mobile to lift navigation clear of system indicators.

---

## ⚙️ Core Engines & Architecture

### 1. State Management & Offline Sync
*   **React Context (`AppContext.tsx`)**: Central state processor distributing actions such as location scans, messages, connects, comments, and posts.
*   **HTML5 LocalStorage Sync**: State updates are written instantly to browser storage, enabling user progress (XP, streaking dates, passport stamps, map grids, DMs) to persist across sessions and page reloads.

### 2. Gamified Engines
*   **Fog-of-War Grid**: Tracks `unlockedMapTiles`. Clearing map tiles dynamically updates coordinates, icons (`Cpu`, `BookOpen`, `Coffee`, `Music`), and highlights sector routes.
*   **Campus Passport**: Matches scanned locations to generate circular ink-style stamps showing location initials and unlock dates.
*   **Streak Calculator**: Compares dates using `.toDateString()`. Consecutive 24h actions increment streaks, awarding +25 XP streak bonuses.
*   **XP & Level-Up Promotor**: Monitors XP boundaries (`100/250/500/900/1500 XP`). Surpassing a threshold triggers the full-screen `LevelUpOverlay` celebrating rank promotion.
*   **Event Quests**: Scans target checkpoints in real-time. Completing the "Freshers' Week Scavenger Hunt" list unlocks a Master Badge and +100 XP.

---

## 📂 Source Code Layout

```bash
c:\LOCAL DISK-D\Projects\test1
├── src/
│   ├── app/
│   │   ├── globals.css         # Custom animations & Tailwind base configs
│   │   ├── layout.tsx          # HTML headers
│   │   └── page.tsx            # Tab navigation, dynamic toasts & modals controller
│   ├── components/
│   │   ├── CommunityTab.tsx    # Peer recommendations, match index % & Q&A forum
│   │   ├── ExplorerTab.tsx     # Fog Map, camera scan, photo attachments & Passport
│   │   ├── GenieTab.tsx        # AI Genie chatbot with pre-seeded questions
│   │   ├── InboxTab.tsx        # DM chat, images, & map coordinates sharing
│   │   ├── LevelUpOverlay.tsx  # Celebratory promotion modal overlay
│   │   ├── PhoneWrapper.tsx    # Mobile viewport viewport framing
│   │   ├── ProfileModal.tsx    # Slide-up card for peer statistics
│   │   └── ProfileTab.tsx      # Avatar, interest selectors & badge progress
│   ├── context/
│   │   └── AppContext.tsx      # Core state reducer, XP calculator & LocalStorage sync
│   └── types/
│       └── index.ts            # TypeScript data models
└── TECH_STACK.md               # Tech stack documentation file
```
