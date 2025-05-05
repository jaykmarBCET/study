'use client'

import { useAuthStore } from "./store/AuthStore"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import useSearch from "./store/VideoStore"
import SearchPlaylistCard from "../components/SearchPlayListCard"
import SearchVideoCard from "../components/SearchVideoCard"

export default function Home() {
  const router = useRouter()
  const [query, setQuery] = useState("") 
  const [isLoading,setIsLoading] = useState(false); 
  const { currentUser, user } = useAuthStore()
  const { search, videos, playlists } = useSearch()

  const handleSearch = useCallback(async () => {
    setIsLoading(true)
    if (query.trim()) {
      await search(query)
    }
    setIsLoading(false)
  }, [search, query,setIsLoading])

  useEffect(() => {
    if (!user) {
      currentUser()
    }
  }, [user, currentUser])

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white px-4 py-6">
      {/* Search Box */}
      <div className="flex items-center gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search video or playlist"
          type="text"
          className="flex-1 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <button
          onClick={handleSearch}
          type="button"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          {isLoading?"Loading.....":"Search"}
        </button>
      </div>

     
      <div className="flex flex-wrap gap-2 justify-center">
        {videos.map((video, idx) => (
          <SearchVideoCard key={idx} video={video} />
        ))}
        {playlists.map((playlist, idx) => (
          <SearchPlaylistCard key={idx} playlist={playlist} />
        ))}
      </div>
    </div>
  )
}
