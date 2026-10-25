import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [liveNotifications, setLiveNotifications] = useState([]);

  useEffect(() => {
    if (user?._id) {
      // Connect to Socket.io backend
      const newSocket = io('http://localhost:5000', {
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        newSocket.emit('join_user', user._id);
      });

      // Listen for notifications
      newSocket.on('new_notification', (data) => {
        setLiveNotifications((prev) => [data, ...prev]);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, liveNotifications, setLiveNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
