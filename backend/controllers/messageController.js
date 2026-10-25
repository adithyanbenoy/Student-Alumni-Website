import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Get all conversations for the user
// @route   GET /api/messages/conversations
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all distinct users that have exchanged messages with current user
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name avatar role company designation department isVerifiedAlumni')
      .populate('recipient', 'name avatar role company designation department isVerifiedAlumni');

    const conversationMap = new Map();

    messages.forEach((msg) => {
      const otherUser =
        msg.sender._id.toString() === userId.toString() ? msg.recipient : msg.sender;

      if (!conversationMap.has(otherUser._id.toString())) {
        conversationMap.set(otherUser._id.toString(), {
          user: otherUser,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount:
            msg.recipient._id.toString() === userId.toString() && !msg.isRead ? 1 : 0
        });
      } else {
        const existing = conversationMap.get(otherUser._id.toString());
        if (msg.recipient._id.toString() === userId.toString() && !msg.isRead) {
          existing.unreadCount += 1;
        }
      }
    });

    const conversations = Array.from(conversationMap.values());
    res.json({ success: true, count: conversations.length, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
  }
};

// @desc    Get message history between current user and another user
// @route   GET /api/messages/:otherUserId
export const getMessagesWithUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name avatar role')
      .populate('recipient', 'name avatar role');

    // Mark messages received by current user as read
    await Message.updateMany(
      { sender: otherUserId, recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};

// @desc    Send a message
// @route   POST /api/messages
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content, mentorshipRequestId } = req.body;

    if (!recipientId || !content) {
      return res.status(400).json({ success: false, message: 'Recipient and content are required' });
    }

    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      content,
      mentorshipRequest: mentorshipRequestId || null
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name avatar role company designation department isVerifiedAlumni')
      .populate('recipient', 'name avatar role company designation department isVerifiedAlumni');

    res.status(201).json({ success: true, message: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};
