import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    tags:{
        type: Array,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    author:{
        type: String,
        required:true
    },
    
},{timestamps:true})

const Post = mongoose.model("Post", postSchema)

export default Post
