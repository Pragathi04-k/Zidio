import Like from '../models/like.model.js';
import Post from '../models/post.model.js';

export const toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const existingLike = await Like.findOne({ userId, postId });

        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);
            await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
            return res.status(200).json({ message: 'Post unliked', liked: false });
        } else {
            const newLike = new Like({ userId, postId });
            await newLike.save();
            await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
            return res.status(200).json({ message: 'Post liked', liked: true });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLikesForPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const likes = await Like.find({ postId })
            .populate('userId', 'username')
            .select('userId createdAt');
        res.status(200).json({ count: likes.length, likes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const checkUserLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const like = await Like.findOne({ userId: req.user.id, postId });
        res.status(200).json({ liked: !!like, likeId: like?._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserLikedPosts = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.id;
        const likes = await Like.find({ userId })
            .populate({
                path: 'postId',
                populate: { path: 'userId', select: 'username' }
            });
            
        const likedPosts = likes.map(like => ({
            ...like.postId.toObject(),
            likedAt: like.createdAt
        }));
        
        res.status(200).json(likedPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};