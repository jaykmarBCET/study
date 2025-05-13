'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ListVideoCard from '../../components/ListVideoCard'
import useVideo from '../store/VideoStore'
import type { Item } from '../store/VideoStore'

interface Playlist {
    items: Item[];
}

function Page() {
    const searchParams = useSearchParams()
    const listId = searchParams.get("id")

    const { playlist, getPlaylistData } = useVideo()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedVideo, setSelectedVideo] = useState<Item | null>(null)


    useEffect(() => {
        if (!listId) return

        const fetchPlaylistData = async () => {
            try {
                setLoading(true)
                setError(null)
                await getPlaylistData(listId);
            } catch (e: any) {
                setError(e.message || 'Failed to fetch playlist');
            } finally {
                setLoading(false)
            }
        }

        fetchPlaylistData()
    }, [listId, getPlaylistData])

    useEffect(() => {
        if (playlist && Array.isArray(playlist?.items) && playlist.items.length > 0 && !selectedVideo) {
            setSelectedVideo(playlist.items[0]);
        }
    }, [playlist, selectedVideo])

    const getYoutubeEmbedUrl = (videoId: string) => {
        return `https://www.youtube.com/embed/${videoId}`;
    };

    return (
        <div className="min-h-screen bg-gray-900 overflow-hidden">
            <div className="flex flex-col md:flex-row">
                {/* Left: Video Player */}
                <div className="w-full md:w-2/3 p-4 sticky md:top-0 self-start md:h-[55vh] lg:h-[75vh] xl:h-[85vh] overflow-y-auto">
                    <h1 className="text-2xl font-bold mb-4 text-white">Now Playing</h1>
                    {selectedVideo ? (
                        <div className="aspect-w-16 aspect-h-9 w-full rounded-lg overflow-hidden shadow-xl">
                            <iframe
                                className="w-full h-full min-h-96"
                                src={getYoutubeEmbedUrl(selectedVideo.id)}
                                title={selectedVideo.title}
                                allowFullScreen
                                height={360}
                                width={400}
                            />
                        </div>
                    ) : (
                        <p className="text-white">Select a video to play</p>
                    )}
                    {selectedVideo && (
                        <div className="mt-4 text-white">
                            <h2 className="text-lg font-semibold">{selectedVideo.title}</h2>
                            <p className="text-sm text-gray-400">{selectedVideo.author.name}</p>
                        </div>
                    )}
                </div>

                {/* Right: Playlist */}
                <div className="w-full md:w-1/3 p-4 border-t md:border-t-0 md:border-l border-gray-700 flex flex-col">
                    <h3 className="text-lg font-semibold mb-4 text-white">Playlist Videos</h3>
                    {loading ? (
                        <p className="text-white">Loading playlist...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : playlist ? (
                        <div className="space-y-4 max-h-[45vh] md:max-h-[55vh] lg:max-h-[65vh] xl:max-h-[75vh] overflow-y-auto flex-grow">
                            {playlist?.items&&playlist.items.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedVideo(item)}
                                    className={`cursor-pointer rounded-lg border p-2 hover:shadow-md transition-shadow duration-200 ${selectedVideo?.id === item.id
                                        ? 'border-gray-700 bg-gray-800'
                                        : 'border-gray-700'
                                        }`}
                                >
                                    <ListVideoCard item={item} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && <p className="text-white">No playlist data available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Page;

