import ytpl from "ytpl";

const grabVideo = async (playlistId) => {
  try {
    
    const response = await ytpl(playlistId,{limit:Infinity});
    return response;
  } catch (error) {
    
    console.error("Error fetching playlist:", error);
    return { message: "Error fetching playlist", error: error.message };
  }
};

export { grabVideo };
