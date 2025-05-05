import React from 'react';

function YouTubeEmbed({ videoId }:{videoId:string}) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?authplay=1`;

  return (
    <div className='w-full rounded-2xl object-cover h-full'>
      <iframe
        width="100%"
        height="100%"
        className='rounded-xl'
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default YouTubeEmbed;