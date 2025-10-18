'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected');
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
}
