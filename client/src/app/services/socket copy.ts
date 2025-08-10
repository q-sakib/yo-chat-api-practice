import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
 private readonly SOCKET_URL = 'http://localhost:4000'; // Change to your Node server URL
 private socket!: Socket;

  connect(userId: number): void {
    if (!this.socket || !this.socket.connected) {
      
    }
  }
}
