'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../../store/AuthStore';
import { useWatchStore } from '../../store/watchStore';
import YouTubeEmbed from '../../../components/YoutubeEmbed';
import ReactMark from 'react-markdown';
import "./notes.css"

function Page() {
  const searchParam = useSearchParams();
  const listId = String(searchParam.get('id'));

  const [isLoading, setIsLoading] = useState(false);
  const { getVideoByPlayListId, videos, playlist, getData, generateNotes, notes } = useAuthStore();
  const [query, setQuery] = useState('');
  const items = videos?.items;
  const currentPlayList = playlist.find((item) => item.listId === listId);
  const { watch, setWatch } = useWatchStore();
  const notesRef = useRef<HTMLDivElement | null>(null); // ✅ Properly typed
  const {currentUser,user}  = useAuthStore()
  const router = useRouter()

  const handelWatch = useCallback((id: string) => {
    setWatch(id);
  }, [setWatch]);

  const handelGenerateNote = useCallback(async () => {
    try {
      setIsLoading(true);
      await generateNotes({
        query,
        videoUrl: String(watch),
      });
      setQuery("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [generateNotes, query, videos?.items, watch]);

  useEffect(() => {
    getData();
    getVideoByPlayListId(listId);
  }, [getData, getVideoByPlayListId, listId]);

  useEffect(() => {
    if (notesRef.current) {
      notesRef.current.scrollTop = notesRef.current.scrollHeight;
    }
  }, [notes]);
  useEffect(()=>{
    if(!user){
      currentUser()
    }
    if(!user){
      router.replace("/login")
    }
  },[])

  return (
    <div className='flex flex-col pt-2 gap-y-3 w-full min-h-screen bg-gray-900 text-white'>
      <div className='grid gap-2 grid-cols-[10fr_4fr]'>
        {/* Video Section */}
        <div className='border flex justify-center items-center border-gray-700 rounded-xl h-full'>
          {watch ? (
            <div className='w-full h-full object-cover'>
              <YouTubeEmbed videoId={watch} />
            </div>
          ) : (
            "No selected video yet"
          )}
        </div>

        {/* Notes & Input Section */}
        <div className='flex  min-w-96 max-w-96 flex-col justify-between border border-gray-700 rounded-xl p-2 min-h-[24rem] max-h-[24rem]'>
          <main
            ref={notesRef}
            className='overflow-auto text-sm flex-1 mb-2 pr-1 prose prose-invert'
          >
            {
              notes.map((item, idx) => (
                <div className='border border-gray-900 px-1 py-2 notes' key={idx}>
                  <ReactMark>{item}</ReactMark>

                </div>
              ))
            }
          </main>
          <div className='flex gap-2 border rounded border-gray-700 justify-between items-center p-2'>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type='text'
              className='px-2 py-1 outline-0 text-sm flex-1 bg-transparent text-white'
              placeholder='Ask any problem related to this course'
            />
            <button
              disabled={isLoading}
              onClick={handelGenerateNote}
              className='btn bg-blue-500 rounded hover:bg-blue-600 px-2 py-1'
            >
              {isLoading ? "Wait..." : "Generate"}
            </button>
          </div>
        </div>
      </div>

      {/* Video List */}
      <div className='flex max-h-96 overflow-auto justify-center gap-2 border border-gray-800 flex-wrap p-4'>
        {items && items.length > 0 &&
          items.map((video, idx) => (
            <button
              onClick={() => handelWatch(video.id)}
              className='w-60 border px-2 py-2 rounded-2xl hover:shadow-sm shadow-gray-600 border-gray-700 cursor-pointer hover:bg-gray-700 hover:scale-105 transition-all duration-300'
              key={idx}
            >
              <p className='text-[12px]'> {idx} {video.title}</p>
            </button>
          ))}
      </div>
    </div>
  );
}

export default Page;
