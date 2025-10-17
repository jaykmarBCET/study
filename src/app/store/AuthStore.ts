import { create } from "zustand";
import axios from "axios";

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  createAt: string;
  updatedAt: string;
}

export interface PlaylistInfo {
  _id: string;
  userId: string;
  listId: string;
  title: string;
  TotalItems: number;
  thumbnails: string;
  author: string;
}

export interface VideoItemInfo {
  title: string;
  index: number;
  id: string;
  _id: string;
  shortUrl: string;
}

export interface VideoInfo {
  _id: string;
  listId: string;
  items: VideoItemInfo[] | [];
}

export interface AuthStoreInfo {
  user: UserInfo | null;
  playlist: PlaylistInfo[];
  videos: VideoInfo | null;
  notes: string[];
  register: (data: { email: string; name: string; password: string }) => Promise<void>;
  currentUser: () => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  getData: () => Promise<void>;
  addPlayList: (playlistUrl: string) => Promise<void>;
  getVideoByPlayListId: (listId: string) => Promise<void>;
  generateNotes: ({ query, videoUrl }: { query: string; videoUrl: string }) => Promise<void>;
}

const useAuthStore = create<AuthStoreInfo>((set, get) => ({
  user: null,
  playlist: [],
  notes: [],
  videos: null,

  register: async (data) => {
    try {
      const response = await axios.post("/api/register", data, { withCredentials: true });
      set({ user: response.data.user });
    } catch (error) {
      console.error("Register Error:", error);
    }
  },

  currentUser: async () => {
    try {
      const response = await axios.get('/api/current', { withCredentials: true });
      set({ user: response.data });
    } catch (error) {
      console.error("Current user fetching issue:", error); // Improved error message
    }
  },

  login: async (data) => {
    try {
      const response = await axios.post("/api/login", data, { withCredentials: true });
      set({ user: response.data.user });
    } catch (error) {
      console.error("Login Error:", error);
    }
  },

  logout: async () => {
    try {
      await axios.get("/api/logout", { withCredentials: true });
      set({ user: null });
    } catch (error) {
      console.error("Logout Error:", error);
    }
  },

  getData: async () => {
    try {
      const response = await axios.get("/api/playlist", { withCredentials: true });
      set({ playlist: response.data.playlist });
    } catch (error) {
      console.error("Get Playlist Error:", error);
    }
  },

  addPlayList: async (playlistUrl) => {
    try {
      const response = await axios.post("/api/playlist", { playlistUrl }, { withCredentials: true });
      const oldPlaylist = get().playlist || [];
      set({ playlist: [...oldPlaylist, response.data.playlist] });
    } catch (error) {
      console.error("Add Playlist Error:", error);
    }
  },

  getVideoByPlayListId: async (listId) => {
    try {
      const response = await axios.get("/api/playlist/get-video", {
        withCredentials: true,
        params: { listId },
      });

      set({ videos: response.data.videos });
      console.log("Fetched videos:", get().videos); // Improved log message
    } catch (error) {
      console.error("Get Videos Error:", error);
    }
  },
  generateNotes: async (data) => {
    const response = await axios.post("/api/generate-note", data, { withCredentials: true });

    const notes = get().notes;

    notes.push(`
     ${data.query}
     \n
    ${response.data.text}
    `);

    set({ notes });
  }
}));

export { useAuthStore };