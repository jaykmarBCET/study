import {
  getSubtitles,
  getVideoDetails
} from 'youtube-caption-extractor';

// Fetching Subtitles
const fetchSubtitles = async (videoID, lang = 'en') => {
  try {
    let subtitles = await getSubtitles({ videoID, lang });

    // ✅ Retry up to 3 times if empty
    if (!subtitles.length) {
      let retries = 3;
      while (retries > 0 && !subtitles.length) {
        await new Promise(res => setTimeout(res, 500)); // small delay
        subtitles = await getSubtitles({ videoID, lang });
        retries--;
      }
    }

    if (!subtitles.length) return ""; // No subtitles found

    const subtitle_prompt = subtitles.reduce(
      (acc, curr) => acc + "\n" + curr.text,
      ""
    );
    
    return subtitle_prompt.trim();
  } catch (error) {
    console.error("Error fetching subtitles:", error);
    return "";
  }
};

// Fetching Video Details
const fetchVideoDetails = async (videoID, lang = 'en') => {
  try {
    const videoDetails = await getVideoDetails({ videoID, lang });
    
    return videoDetails.description;
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
};

export {
    fetchSubtitles,
    fetchVideoDetails
}