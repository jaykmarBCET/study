'use client'

import React from 'react'
import Image from 'next/image'

interface ImageData {
  url: string | null
  width: number
  height: number
}

interface Item {
  title: string
  index: number
  id: string
  shortUrl: string
  url: string
  author: {
    name: string
    url: string
    channelID: string
  }
  thumbnails: ImageData[]
  bestThumbnail: ImageData
  isLive: boolean
  duration: string | null
  durationSec: number | null
}

interface Props {
  item: Item
}

const ListVideoCard: React.FC<Props> = ({ item }) => {
  return (
    <div className="flex gap-3 rounded-md w-full p-2 hover:bg-gray-800 transition-all">
      <div className="w-32 md:w-36 lg:w-40 relative aspect-video shrink-0">
        {item.bestThumbnail.url && (
          <Image
            src={item.bestThumbnail.url}
            alt={item.title}
            fill
            className="object-cover rounded"
            sizes="(max-width: 768px) 100vw, 160px"
          />
        )}
      </div>
      <div className="flex flex-col justify-between flex-grow overflow-hidden">
        <div>
          <h3 className="text-sm md:text-base font-semibold text-gray-200 line-clamp-2">
            {item.title}
          </h3>
          <p className="text-xs md:text-sm text-gray-400 mt-1 truncate">{item.author.name}</p>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {item.duration ? item.duration : item.isLive ? '🔴 Live' : 'Unknown duration'}
        </div>
      </div>
    </div>
  )
}

export default ListVideoCard
