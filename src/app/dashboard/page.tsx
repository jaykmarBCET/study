'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../store/AuthStore';
import PlayListCard from '../../components/PlayListCard';
import { useRouter } from 'next/navigation';

function Dashboard() {
  const { user, playlist, addPlayList, getData } = useAuthStore();
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(() => {
    if (user) getData();
  }, [user, getData]);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    } else {
      fetchData();
    }
  }, [user, fetchData, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a valid playlist URL');
      return;
    }

    try {
      setLoading(true);
      await addPlayList(url.trim());
      setUrl('');
      setError('');
    } catch (err) {
      console.error('Error adding playlist:', err);
      setError('Failed to add playlist. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900">
      <h1 className="text-2xl font-semibold">{user?.name || 'User'} Dashboard</h1>

      <div className="mt-6">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            name="url"
            placeholder="Enter playlist URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-2/3 outline-none"
            aria-label="Playlist URL"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-2 hover:scale-110 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Fetching...' : 'Fetch'}
          </button>
        </form>
        {error && (
          <p className="text-red-500 mt-2" aria-live="polite">
            {error}
          </p>
        )}
      </div>

      {/* Display playlist cards */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        {playlist?.length > 0 ? (
          playlist.map((item, index) => (
            <PlayListCard key={index} playlist={item} />
          ))
        ) : (
          <p className="text-gray-500">No playlists found</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;