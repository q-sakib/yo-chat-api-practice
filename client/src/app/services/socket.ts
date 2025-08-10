import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;
  private readonly SOCKET_URL = 'http://localhost:4000'; // Change to your Node server URL

  // ✅ Connect to socket server
  connect(userId: number): void {
    if (!this.socket || !this.socket.connected) {
      this.socket = io(this.SOCKET_URL, {
        transports: ['websocket'], // Faster connection
        auth: { userId },          // Send userId on handshake
        reconnectionAttempts: 5,   // Retry if connection fails
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected:', this.socket.id);
        this.socket.emit('user_connected', userId); // optional handshake emit
      });

      this.socket.on('disconnect', (reason) => {
        console.warn('❌ Socket disconnected:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('🚫 Socket connection error:', error);
      });
    }
  }

  // ✅ Disconnect socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket.removeAllListeners();
    }
  }

  // ✅ Send a message to backend
  sendMessage(senderId: number, receiverId: number, content: string): void {
    if (this.socket?.connected) {
      const payload = {
        senderId,
        receiverId,
        content,
      };
      this.socket.emit('send-message', payload);
    }
  }

  // ✅ Listen for incoming message from backend
  onReceiveMessage(callback: (data: any) => void): void {
    this.socket?.on('receive-message', callback);
  }

  // 🔧 Generic event listener
  on(event: string, callback: (data: any) => void): void {
    this.socket?.on(event, callback);
  }

  // 🔧 Generic event emitter
  emit(event: string, data: any): void {
    this.socket?.emit(event, data);
  }

  // ✅ Check if socket is connected
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

}
