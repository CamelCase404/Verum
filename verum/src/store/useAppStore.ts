import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Profile, Notification } from "@/types";
import { defaultNotifications } from "@/data/notifications";

interface AppState {
  theme: "light" | "dark";
  drawerOpen: boolean;
  notifOpen: boolean;
  chatOpen: boolean;
  paletteOpen: boolean;
  user: User | null;
  profile: Profile;
  notifications: Notification[];
  setTheme: (t: "light" | "dark") => void;
  toggleDrawer: () => void;
  toggleNotif: () => void;
  toggleChat: () => void;
  togglePalette: () => void;
  setUser: (u: User | null) => void;
  updateProfile: (p: Partial<Profile>) => void;
  addProject: (project: any) => void;
  removeProject: (id: string) => void;
  markAllRead: () => void;
  reset: () => void;
}

const defaultProfile: Profile = {
  github: "mkovaleva",
  comment: "",
  tested: true,
  bio: "Frontend-разработчик с 5-летним опытом. Специализируюсь на React, TypeScript и создании высоконагруженных интерфейсов.",
  avatarColor: "accent",
  avatarImage: "",
  githubData: null, // Поле для данных из GitHub
  projects: [],
  scores: { arch: 82, code: 86, ai: 78, adapt: 74 },
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "light",
      drawerOpen: false,
      notifOpen: false,
      chatOpen: false,
      paletteOpen: false,
      user: null,
      profile: defaultProfile,
      notifications: defaultNotifications(),
      setTheme: (t) => {
        set({ theme: t });
        document.documentElement.setAttribute("data-theme", t);
      },
      toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
      toggleNotif: () => set((s) => ({ notifOpen: !s.notifOpen })),
      toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),
      togglePalette: () => set((s) => ({ paletteOpen: !s.paletteOpen })),
      setUser: (u) => set({ user: u }),
      updateProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      addProject: (project) => set((s) => ({ profile: { ...s.profile, projects: [project, ...s.profile.projects] } })),
      removeProject: (id) => set((s) => ({ profile: { ...s.profile, projects: s.profile.projects.filter(p => p.id !== id) } })),
      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, unread: false })) })),
      reset: () => set({ user: null, profile: defaultProfile, drawerOpen: false, notifOpen: false, chatOpen: false, paletteOpen: false }),
    }),
    { name: "verum_state_v9" }
  )
);
