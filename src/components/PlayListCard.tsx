'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface PlayListCardProps {
  playlist: {
    userId: string
    listId: string
    title: string
    TotalItems: number
    thumbnails: string
    author: string
  }
}

const PlayListCard: React.FC<PlayListCardProps> = ({ playlist }) => {
  const { thumbnails, title, author, TotalItems, listId } = playlist

  // Fallback image URL (can be a placeholder or a default image)
  const fallbackImage = '/images/placeholder.png'

  return (
    <Link href={`/dashboard/${listId}?id=${listId}`} className="bg-white shadow-md rounded-lg overflow-hidden w-64 mb-4">
      <div className="relative w-full h-48">
        <Image
          src={thumbnails || fallbackImage} 
          alt={title}
          layout="fill"
          objectFit="cover"
          priority 
          className='hover:scale-105 transition-all duration-300' 
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-black truncate">{title}</h3>
        <p className="text-sm text-gray-500 truncate">{author}</p>
        <p className="text-sm text-gray-500">Items: {TotalItems}</p>
        <p className="text-sm text-gray-400">List ID: {listId}</p>
      </div>
    </Link>
  )
}

export default PlayListCard
