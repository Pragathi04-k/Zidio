import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    commenter:{
        type: String,
        required:true
    },
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    comment:{
        type: String,
        required:true
    },
    
},{timestamps:true})

const Comment = mongoose.model("Comment", commentSchema)

export default Comment
