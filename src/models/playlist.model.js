import mongoose from "mongoose";


const PlayListSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    listId:{
        type:String,
        required:true,
        trim:true,
    },
    title:{
        type:String,
        required:true,
        trim:true,
    },
    TotalItems:{
        type:Number,
    },
    thumbnails:{
        type:String,
    },
    author:{
        type:String,
    }
})

const PlayList = mongoose.models.Playlist || mongoose.model('Playlist',PlayListSchema)

export {PlayList}