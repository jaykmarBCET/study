'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSearch from '../../store/VideoStore';
import Image from 'next/image';

const WatchPage = () => {
  const { id } = useParams();
  const { videos } = useSearch();
  const router = useRouter();

  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  // Update current video ID on route change
  useEffect(() => {
    if (typeof id === 'string') {
      setCurrentVideoId(id);
    }
  }, [id]);

  const video = videos.find(v => v.videoId === currentVideoId);
  const relatedVideos = videos.filter(v => v.videoId !== currentVideoId);

  if (!video) return <div className="text-white p-4">Video not found</div>;

  const handleVideoClick = (videoId: string) => {
    // Change URL and state
    router.push(`/watch/${videoId}`);
    setCurrentVideoId(videoId);
  };

  return (
    <div className="p-4 text-white flex bg-gray-900 flex-col lg:flex-row gap-8">
     
      <div className="lg:w-2/3 w-full">
        <h1 className="text-xl font-bold mb-2 text-center max-w-4xl">{video.title}</h1>

        <div className="w-full max-w-4xl aspect-video mb-4">
          <iframe
            key={video.videoId} 
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-xl"
          ></iframe>
        </div>

        <p className="mt-4 text-sm text-gray-400 max-w-4xl text-center">{video.description}</p>
      </div>

      
      <div className="lg:w-1/3 w-full max-w-xs flex flex-col gap-4">
        <h2 className="text-lg font-semibold mb-4">Related Videos</h2>
        <div className="flex flex-col gap-4  border rounded-2xl p-2 h-screen overflow-y-auto overflow-x-hidden   border-gray-800">
          {relatedVideos.map(v => (
            <div
              key={v.videoId}
              onClick={() => handleVideoClick(v.videoId)}
              className="flex hover:scale-105 border  border-gray-800  duration-300 items-center gap-4 cursor-pointer hover:bg-gray-800 p-2 rounded transition"
            >
              <div className="relative w-32 h-20 flex-shrink-0">
                <Image
                  src={v.thumbnail}
                  alt={v.title}
                  fill
                  className="rounded object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-medium line-clamp-2">{v.title}</h3>
                <span className="text-xs text-gray-400">{v.author.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
