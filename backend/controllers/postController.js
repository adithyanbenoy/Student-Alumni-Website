import Post from '../models/Post.js';
import Notification from '../models/Notification.js';

// @desc    Get all feed posts
// @route   GET /api/posts
export const getPosts = async (req, res) => {
  try {
    const { category, search, authorId } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }
    if (authorId) {
      query.author = authorId;
    }
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'name avatar role company designation department batchYear isVerifiedAlumni')
      .populate('comments.user', 'name avatar role company designation department isVerifiedAlumni')
      .sort({ isPinned: -1, createdAt: -1 });

    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
};

// @desc    Create new post
// @route   POST /api/posts
export const createPost = async (req, res) => {
  try {
    const { content, mediaUrl, category, tags } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const post = await Post.create({
      author: req.user._id,
      content,
      mediaUrl: mediaUrl || '',
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim().replace(/^#/, '')) : [])
    });

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'name avatar role company designation department batchYear isVerifiedAlumni'
    );

    res.status(201).json({ success: true, post: populatedPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error creating post' });
  }
};

// @desc    Like or Unlike post
// @route   PUT /api/posts/:id/like
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userIdStr = req.user._id.toString();
    const alreadyLikedIndex = post.likes.findIndex((id) => id.toString() === userIdStr);

    let isLiked = false;
    if (alreadyLikedIndex !== -1) {
      // Unlike
      post.likes.splice(alreadyLikedIndex, 1);
    } else {
      // Like
      post.likes.push(req.user._id);
      isLiked = true;

      // Create notification for author if not liking own post
      if (post.author.toString() !== userIdStr) {
        await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: 'post_like',
          title: 'New Like on your post',
          message: `${req.user.name} liked your post.`,
          link: `/feed`
        });
      }
    }

    await post.save();
    res.json({ success: true, likes: post.likes, isLiked });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update like status' });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment content cannot be empty' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.comments.push({
      user: req.user._id,
      content: content.trim(),
      createdAt: new Date()
    });

    await post.save();

    // Create notification for author if not commenting on own post
    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'post_comment',
        title: 'New Comment on your post',
        message: `${req.user.name} commented: "${content.substring(0, 40)}..."`,
        link: `/feed`
      });
    }

    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'name avatar role company designation department batchYear isVerifiedAlumni')
      .populate('comments.user', 'name avatar role company designation department isVerifiedAlumni');

    res.json({ success: true, comments: updatedPost.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Only post author or admin can delete
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ success: true, message: 'Post removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete post' });
  }
};
