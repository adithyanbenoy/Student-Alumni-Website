import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route imports
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import mentorshipRoutes from './routes/mentorshipRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io Real-time connection handler
io.on('connection', (socket) => {
  // User joins their personal room based on user._id
  socket.on('join_user', (userId) => {
    socket.join(userId);
  });

  // Real-time direct chat messaging
  socket.on('send_message', (data) => {
    // data contains { recipientId, message }
    if (data.recipientId) {
      io.to(data.recipientId).emit('receive_message', data);
    }
  });

  // Typing indicators
  socket.on('typing', ({ senderId, recipientId }) => {
    io.to(recipientId).emit('user_typing', { senderId });
  });

  socket.on('stop_typing', ({ senderId, recipientId }) => {
    io.to(recipientId).emit('user_stop_typing', { senderId });
  });

  socket.on('disconnect', () => {
    // Client disconnected
  });
});

// Make io accessible in request if needed
app.set('socketio', io);

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    portal: 'SRM Easwari Engineering College Integrated Alumni-Student Mentorship & Job Portal',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);

// Serve frontend static build
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(` SRM Easwari Engineering College Alumni-Student Portal Backend `);
  console.log(` Server running in ${process.env.NODE_ENV || 'development'} on port ${PORT} `);
  console.log(` API Health: http://localhost:${PORT}/api/health               `);
  console.log(`================================================================`);
});
