import mongoose from "mongoose";

const VideoUrlSchema = new mongoose.Schema({
    videoId: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true,
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 86400 
    }
}, { timestamps: true });

const VideoUrl = mongoose.models.VideoUrl || mongoose.model("VideoUrl", VideoUrlSchema);
export {VideoUrl}
