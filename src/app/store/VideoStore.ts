import { create } from 'zustand';
import axios from 'axios';

interface AuthorInfo {
  name: string;
  url: string;
}

interface PlaylistInfo {
  type: string;
  listId: string;
  url: string;
  image: string;
  title: string;
  thumbnail: string;
  videoCount: number;
  author: AuthorInfo;
}

export interface VideoInfo {
  type: string;
  videoId: string;
  url: string;
  title: string;
  description: string;
  image: string;
  thumbnail: string;
  seconds: number;
  timestamp: string;
  duration: Record<string, any>; 
  age: string;
  views: string;
  author: AuthorInfo;
}

interface UseSearchInfo {
  videos: VideoInfo[];
  playlists: PlaylistInfo[];
  search: (query: string) => Promise<void>;
}

const useSearch = create<UseSearchInfo>((set, get) => ({
  videos: [],
  playlists: [],
  search: async (query) => {
    try {
     
      const response = await axios.get('/api/search', {
        params: { query },
        withCredentials:true
      });

      const { videos, playlists } = response.data;

      // Update state with videos and playlists or empty arrays if undefined
      set({
        videos: videos || [],
        playlists: playlists || [],
      });
    } catch (error) {
      // Improved error logging
      console.error('Error fetching YouTube data:', error);
      set({ videos: [], playlists: [] }); // Set empty arrays on error
    }
  },
}));

export default useSearch;
