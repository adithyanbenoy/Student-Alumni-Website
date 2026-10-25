import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  Image as ImageIcon,
  Tag,
  CheckCircle2,
  Trash2,
  Sparkles,
  Megaphone,
  Briefcase,
  GraduationCap,
  Filter,
  Search
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Career Advice',
  'Job Referral',
  'Internship Opportunity',
  'Project Showcase',
  'Campus News',
  'General'
];

const FeedPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // New post state
  const [showPostModal, setShowPostModal] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Career Advice');
  const [newTags, setNewTags] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [submittingPost, setSubmittingPost] = useState(false);

  // Comment state keyed by postId
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    fetchFeedData();
  }, [selectedCategory]);

  const fetchFeedData = async () => {
    setLoading(true);
    try {
      const categoryParam = selectedCategory !== 'All' ? `?category=${encodeURIComponent(selectedCategory)}` : '';
      const [postsRes, annRes] = await Promise.all([
        API.get(`/posts${categoryParam}`),
        API.get('/admin/announcements')
      ]);

      if (postsRes.data.success) {
        setPosts(postsRes.data.posts);
      }
      if (annRes.data.success) {
        setAnnouncements(annRes.data.announcements);
      }
    } catch (err) {
      console.error('Error fetching feed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setSubmittingPost(true);
    try {
      const res = await API.post('/posts', {
        content: newContent,
        category: newCategory,
        tags: newTags,
        mediaUrl: newMediaUrl
      });

      if (res.data.success) {
        setPosts([res.data.post, ...posts]);
        setNewContent('');
        setNewTags('');
        setNewMediaUrl('');
        setShowPostModal(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit post');
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      const res = await API.put(`/posts/${postId}/like`);
      if (res.data.success) {
        setPosts(
          posts.map((p) => {
            if (p._id === postId) {
              return { ...p, likes: res.data.likes };
            }
            return p;
          })
        );
      }
    } catch (err) {
      console.error('Error liking post', err);
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentText[postId];
    if (!text || !text.trim()) return;

    try {
      const res = await API.post(`/posts/${postId}/comments`, { content: text });
      if (res.data.success) {
        setPosts(
          posts.map((p) => {
            if (p._id === postId) {
              return { ...p, comments: res.data.comments };
            }
            return p;
          })
        );
        setCommentText({ ...commentText, [postId]: '' });
      }
    } catch (err) {
      console.error('Error adding comment', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await API.delete(`/posts/${postId}`);
      if (res.data.success) {
        setPosts(posts.filter((p) => p._id !== postId));
      }
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.content?.toLowerCase().includes(q) ||
      p.author?.name?.toLowerCase().includes(q) ||
      p.author?.company?.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Profile Summary Sidebar */}
        <LeftSidebar />

        {/* Center Main Feed */}
        <main className="flex-1 space-y-4 max-w-3xl">
          {/* Institutional Pinned Announcements Banner */}
          {announcements.length > 0 && (
            <div className="bg-gradient-to-r from-brand-900 to-brand-800 text-white rounded-xl p-4 shadow-sm border border-brand-700">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-accent-gold text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <Megaphone className="w-3 h-3" /> Official Bulletin
                </span>
                <span className="text-xs text-brand-200">Student Alumni Portal</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                {announcements[0].title}
              </h3>
              <p className="text-xs text-brand-100 leading-relaxed">
                {announcements[0].content}
              </p>
            </div>
          )}

          {/* Create Post Card (LinkedIn-style box) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                alt={user?.name}
                className="w-10 h-10 rounded-full border border-slate-200 object-cover"
              />
              <button
                onClick={() => setShowPostModal(true)}
                className="flex-1 text-left bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full transition-colors border border-slate-200"
              >
                Start a post to share advice, opportunities, or updates...
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => {
                  setNewCategory('Career Advice');
                  setShowPostModal(true);
                }}
                className="flex items-center space-x-1.5 text-slate-600 hover:text-brand-800 font-semibold p-1.5 rounded-lg hover:bg-slate-50"
              >
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Career Advice</span>
              </button>

              <button
                onClick={() => {
                  setNewCategory('Job Referral');
                  setShowPostModal(true);
                }}
                className="flex items-center space-x-1.5 text-slate-600 hover:text-brand-800 font-semibold p-1.5 rounded-lg hover:bg-slate-50"
              >
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>Job Referral</span>
              </button>

              <button
                onClick={() => {
                  setNewCategory('Project Showcase');
                  setShowPostModal(true);
                }}
                className="flex items-center space-x-1.5 text-slate-600 hover:text-brand-800 font-semibold p-1.5 rounded-lg hover:bg-slate-50"
              >
                <Sparkles className="w-4 h-4 text-accent-gold" />
                <span>Project Showcase</span>
              </button>

              <button
                onClick={() => setShowPostModal(true)}
                className="hidden sm:flex items-center space-x-1.5 text-slate-600 hover:text-brand-800 font-semibold p-1.5 rounded-lg hover:bg-slate-50"
              >
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <span>Media</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter Pills */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search posts by company, domain, skills, author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-700"
                />
              </div>
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-brand-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Stream */}
          {loading ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
              <div className="animate-spin w-8 h-8 border-4 border-brand-800 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-xs text-slate-500 font-medium">Loading AlmaLink feed updates...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-slate-500">
              <p className="text-sm font-semibold">No posts found in this category</p>
              <p className="text-xs text-slate-400 mt-1">Be the first to share an update or opportunity!</p>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isLiked = post.likes?.some(
                (id) => (typeof id === 'object' ? id._id : id) === user?._id
              );
              const isAuthorOrAdmin =
                user?._id === (post.author?._id || post.author) || user?.role === 'admin';

              return (
                <article
                  key={post._id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-4 pb-2 flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <img
                        src={post.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.name}`}
                        alt={post.author?.name}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900">{post.author?.name}</h4>
                          {post.author?.isVerifiedAlumni && post.author?.role === 'alumni' && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-blue-600" />
                              Verified Alumnus
                            </span>
                          )}
                          <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            {post.author?.role}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500">
                          {post.author?.role === 'alumni'
                            ? `${post.author?.designation} @ ${post.author?.company}`
                            : `${post.author?.department} • Batch ${post.author?.batchYear}`}
                        </p>

                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="font-semibold text-brand-800 bg-brand-50 px-1.5 py-0.2 rounded">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isAuthorOrAdmin && (
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="px-4 py-2">
                    <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                      {post.content}
                    </p>

                    {/* Hashtags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-semibold text-brand-800 hover:underline cursor-pointer"
                          >
                            #{tag.replace(/^#/, '')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Post Media Attachment if any */}
                  {post.mediaUrl && (
                    <div className="mt-2 bg-slate-100 max-h-96 overflow-hidden flex items-center justify-center">
                      <img
                        src={post.mediaUrl}
                        alt="Post media"
                        className="w-full object-cover max-h-96"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    </div>
                  )}

                  {/* Social Counters */}
                  <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 mt-2">
                    <div className="flex items-center space-x-1">
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px]">
                        ❤️
                      </span>
                      <span>{post.likes?.length || 0} likes</span>
                    </div>
                    <span>{post.comments?.length || 0} comments</span>
                  </div>

                  {/* Action Bar (Like, Comment, Share) */}
                  <div className="px-4 py-1.5 flex items-center justify-around text-xs font-semibold text-slate-600">
                    <button
                      onClick={() => handleToggleLike(post._id)}
                      className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                        isLiked ? 'text-rose-600 font-bold' : ''
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                      <span>{isLiked ? 'Liked' : 'Like'}</span>
                    </button>

                    <button
                      onClick={() =>
                        setActiveCommentPostId(
                          activeCommentPostId === post._id ? null : post._id
                        )
                      }
                      className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Comment</span>
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {activeCommentPostId === post._id && (
                    <div className="bg-slate-50 p-4 border-t border-slate-100 space-y-3">
                      {/* Comment Input */}
                      <div className="flex items-start space-x-2">
                        <img
                          src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                          alt={user?.name}
                          className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                        />
                        <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
                          <input
                            type="text"
                            placeholder="Add a constructive thought or question..."
                            value={commentText[post._id] || ''}
                            onChange={(e) =>
                              setCommentText({ ...commentText, [post._id]: e.target.value })
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(post._id);
                            }}
                            className="w-full text-xs bg-transparent focus:outline-none text-slate-800"
                          />
                          <button
                            onClick={() => handleAddComment(post._id)}
                            className="text-brand-800 hover:text-brand-900 p-1 font-bold"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Comment List */}
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-2 pt-2">
                          {post.comments.map((comment, cIdx) => (
                            <div key={cIdx} className="flex items-start space-x-2 text-xs">
                              <img
                                src={comment.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.name}`}
                                alt={comment.user?.name}
                                className="w-7 h-7 rounded-full object-cover border border-slate-200 flex-shrink-0"
                              />
                              <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <span className="font-bold text-slate-900">
                                      {comment.user?.name}
                                    </span>
                                    {comment.user?.isVerifiedAlumni && (
                                      <CheckCircle2 className="w-3 h-3 text-blue-600 inline" />
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-400">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 mb-1">
                                  {comment.user?.role === 'alumni'
                                    ? `@${comment.user?.company}`
                                    : comment.user?.department}
                                </p>
                                <p className="text-slate-800 text-xs">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </main>

        {/* Right Recommended Widgets Sidebar */}
        <RightSidebar />
      </div>

      {/* Create Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full border border-slate-200"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{user?.name}</h3>
                  <p className="text-xs text-slate-500 capitalize">{user?.role} • Student Alumni Portal</p>
                </div>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-1 focus:ring-brand-700"
                >
                  <option value="Career Advice">Career Advice</option>
                  <option value="Job Referral">Job Referral</option>
                  <option value="Internship Opportunity">Internship Opportunity</option>
                  <option value="Project Showcase">Project Showcase</option>
                  <option value="Campus News">Campus News</option>
                  <option value="General">General Discussion</option>
                </select>
              </div>

              <div>
                <textarea
                  rows="4"
                  placeholder="What would you like to share with students and alumni?"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-700"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hashtags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CyberSecurity, Placement2026, MERNStack"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attachment / Image URL (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/project-screenshot.jpg"
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="text-xs font-semibold text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPost}
                  className="text-xs font-bold bg-brand-800 hover:bg-brand-900 text-white px-5 py-2 rounded-lg shadow-sm"
                >
                  {submittingPost ? 'Publishing...' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedPage;
