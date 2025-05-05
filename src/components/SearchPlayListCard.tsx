'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from '../app/store/AuthStore';
import { useRouter } from 'next/navigation';
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

const SearchPlaylistCard: React.FC<{ playlist: PlaylistInfo }> = ({ playlist }) => {
  const { addPlayList } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const handleStudy = async () => {
    setIsLoading(true);
    await addPlayList(playlist.url);
    setIsLoading(false);
  };
  const handelNavigate = (list:string)=>{
    router.push(`/watch/${list}`)
  }
  return (
    <div className="w-full sm:w-80 bg-gray-900 hover:scale-105 duration-300 hover:border hover:border-gray-800 rounded-xl p-3 text-white shadow hover:shadow-lg transition">
      {/* Thumbnail */}
      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-3">
        <Image
          src={playlist.thumbnail}
          alt={playlist.title}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {playlist.videoCount} videos
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col mb-3">
        <h3 className="text-sm font-semibold line-clamp-2">{playlist.title}</h3>
        <p className="text-sm text-gray-400">{playlist.author.name}</p>
      </div>

      {/* Action */}
      <button
        type="button"
        className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-medium disabled:opacity-50"
        disabled={isLoading}
        onClick={handleStudy}
      >
        {isLoading ? "Adding..." : "Add to Study"}
      </button>
    </div>
  );
};

export default SearchPlaylistCard;
