import axios from 'axios';
import { create } from 'zustand';

interface WatchStore {
  watch: string | null;
  setWatch: (id: string) => Promise<void>;
}

const useWatchStore = create<WatchStore>((set) => ({
  watch: null,
  setWatch: async (id) => set({watch:id})
}));

export { useWatchStore };
