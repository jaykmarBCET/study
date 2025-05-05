import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
    listId: {
        type: String,
        required: true,
    },
    items: [
        {
            title: { type: String, required: true },
            shortUrl: { type: String, required: true },
            index: { type: Number, required: true },
            id:{type:String,required:true}
        }
    ]
});

const Videos = mongoose.models.Video || mongoose.model("Video", VideoSchema);

export {Videos}
