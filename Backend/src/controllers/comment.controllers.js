import Comment from "../models/comment.model.js";
import { validationResult } from "express-validator";

export const createComment = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.user.id;
    const commenter = req.user.name;
    const {comment} = req.body;
    const postId = req.params.postId;
    const newComment = new Comment({userId, commenter, comment, postId});
    try {
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCommentsForPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({postId})
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        await comment.remove();
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

