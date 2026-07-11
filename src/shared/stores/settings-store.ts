import { create } from "zustand";
import { persist } from "zustand/middleware";

export const SETTINGS_STORAGE_KEY = "dashboard-settings";

export type Theme = "light" | "dark" | "system";
export type Locale = "en" | "ru";

export type UserProfile = {
  name: string;
  email: string;
  role: string;
};

interface SettingsState {
  theme: Theme;
  locale: Locale;
  profile: UserProfile;
  emailNotifications: boolean;
  pushNotifications: boolean;
  orderAlerts: boolean;
  marketingEmails: boolean;
  sidebarCollapsed: boolean;
  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
  setProfile: (profile: UserProfile) => void;
  setEmailNotifications: (value: boolean) => void;
  setPushNotifications: (value: boolean) => void;
  setOrderAlerts: (value: boolean) => void;
  setMarketingEmails: (value: boolean) => void;
  setSidebarCollapsed: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      locale: "en",
      profile: {
        name: "Admin User",
        email: "admin@dashboard.com",
        role: "Administrator",
      },
      emailNotifications: true,
      pushNotifications: true,
      orderAlerts: true,
      marketingEmails: false,
      sidebarCollapsed: false,
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
      setProfile: (profile) => set({ profile }),
      setEmailNotifications: (value) => set({ emailNotifications: value }),
      setPushNotifications: (value) => set({ pushNotifications: value }),
      setOrderAlerts: (value) => set({ orderAlerts: value }),
      setMarketingEmails: (value) => set({ marketingEmails: value }),
      setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
    }
  )
);
