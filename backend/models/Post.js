import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: [true, 'Post content cannot be empty']
    },
    mediaUrl: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      enum: [
        'General',
        'Career Advice',
        'Job Referral',
        'Internship Opportunity',
        'Campus News',
        'Project Showcase',
        'Alumni Spotlight'
      ],
      default: 'General'
    },
    tags: {
      type: [String],
      default: []
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        content: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    isPinned: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
