import ytpl, { Result } from 'ytpl';

const grabVideo = async (playlistId: string): Promise<Result | { message: string; error: string }> => {
  try {
    const response = await ytpl(playlistId, { limit: Infinity });
    return response;
  } catch (error: any) {
    console.error('Error fetching playlist:', error);
    return { message: 'Error fetching playlist', error: error.message };
  }
};

export { grabVideo };
