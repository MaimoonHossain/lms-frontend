import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  name: string; // optional, since not in login response
  email: string;
  role: string;
  token: string; // ✅ Add token to store
};

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "lms-user",
    }
  )
);
