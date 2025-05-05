'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface AuthorInfo {
  name: string;
  url: string;
}

interface VideoInfo {
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

const SearchVideoCard: React.FC<{ video: VideoInfo }> = ({ video }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Ensures component only renders after client hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenWatch = useCallback(() => {
    router.push(`/watch/${video.videoId}`);
  }, [router, video.videoId]);

  if (!mounted) return null; // Prevents mismatch during SSR

  return (
    <div
      className="w-full sm:w-80 cursor-pointer hover:scale-105 transition-transform duration-300"
      onClick={handleOpenWatch}
    >
      <div className="flex flex-col">
        {/* Thumbnail */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover"
          />
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded">
            {video.timestamp}
          </span>
        </div>

        {/* Info */}
        <div className="flex mt-3 gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-sm font-bold text-white">
              {video.author.name.charAt(0)}
            </div>
          </div>

          <div className="flex flex-col text-white">
            <h3 className="text-sm font-semibold line-clamp-2">{video.title}</h3>
            <span className="text-sm text-gray-300">{video.author.name}</span>
            <span className="text-xs text-gray-400">
              {video.views} views • {video.age}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchVideoCard;
