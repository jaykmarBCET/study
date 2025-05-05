'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { VideoInfo } from '../app/store/VideoStore';


const SearchVideoCard: React.FC<{ video: VideoInfo }> = ({ video }) => {
  const router = useRouter();

  const handleOpenWatch = useCallback((id: string) => {
    router.push(`/watch/${id}`);
  }, [router]);

  return (
    <div
      className="w-full sm:w-80 cursor-pointer hover:scale-105 transition-transform duration-300"
      onClick={() => handleOpenWatch(video.videoId)}
    >
      <div className="flex flex-col">
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
