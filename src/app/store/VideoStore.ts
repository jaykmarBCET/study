import { create } from 'zustand';
import axios from 'axios';


interface ContinueResult {
  continuation: Continuation | null;
  items: Item[];
}

interface Continuation { }

interface Image {
  url: string | null;
  width: number;
  height: number;
}
export interface Item {
  title: string;
  index: number;
  id: string;
  shortUrl: string;
  url: string;
  author: {
    name: string;
    url: string;
    channelID: string;
  };
  thumbnails: Image[];
  bestThumbnail: Image;
  isLive: boolean;
  duration: string | null;
  durationSec: number | null;
}

interface Result {
  id: string;
  url: string;
  title: string;
  estimatedItemCount: number;
  views: number;
  thumbnails: Image[];
  bestThumbnail: Image;
  lastUpdated: string;
  description: string | null;
  visibility: 'unlisted' | 'everyone';
  author: {
    name: string;
    url: string;
    avatars: Image[];
    bestAvatar: Image;
    channelID: string;
  };
  items: Item[];
  continuation: Continuation | null;
}
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
  ago: string;
  age: string;
  views: string;
  author: AuthorInfo;
}

interface UseSearchInfo {
  videos: VideoInfo[];
  playlists: PlaylistInfo[];
  playlist: Result | null ;
  search: (query: string) => Promise<void>;
  getPlaylistData:(listId:string)=>Promise<void>
}

const useSearch = create<UseSearchInfo>((set, get) => ({
  videos: [],
  playlists: [],
  playlist: null,
  search: async (query) => {
    try {

      const response = await axios.get('/api/search', {
        params: { query },
        withCredentials: true
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
  getPlaylistData:async(listId)=>{
    const response = await axios.post("/api/search-playlist",{listId})
    if(response.status===200){
      set({playlist:response.data})
    }
  }
}));

export default useSearch;
