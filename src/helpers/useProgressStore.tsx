import { create } from "zustand";

export type ProgressState = {
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
};

export const useProgressStore = create<ProgressState>((set) => ({
  isAnimating: false,
  setIsAnimating: (isAnimating: boolean) => set(() => ({ isAnimating })),
}));
