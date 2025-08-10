import { Component, OnDestroy, OnInit } from '@angular/core';
import { Header } from './header/header';
import { Sidebar } from './sidebar/sidebar';
import { Body } from './body/body';
import { SocketService } from '../../services/socket';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [Header, Sidebar, Body],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit, OnDestroy {
  users: any[] = [];
  currentUser: any = null;
  selectedUser: any = null;
  messages: any[] = [];
  error: string | null = null;

  private apiBase = 'http://localhost:8000/api';

  constructor(private socketService: SocketService, private http: HttpClient) {}

  ngOnInit(): void {
    this.initChat();
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') ?? '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  async initChat() {
    try {
      const userJson = localStorage.getItem('auth_user');
      if (!userJson) throw new Error('User not logged in');
      this.currentUser = JSON.parse(userJson);

      this.socketService.connect(this.currentUser.id);

      // Fetch all users with auth header
      const response = await lastValueFrom(
        this.http.get<{ data: any[] }>(`${this.apiBase}/users`, {
          headers: this.getAuthHeaders(),
        })
      );

      const allUsers = response.data; // Adjust this line if your response structure is different

      this.users = (allUsers ?? []).filter((u) => u.id !== this.currentUser.id);

      if (this.users.length > 0) {
        this.selectedUser = this.users[0];
        await this.loadConversation(this.selectedUser.id);
      }

      // Listen to socket messages
      this.socketService.onReceiveMessage((data) => {
        if (
          data.senderId === this.selectedUser?.id ||
          data.senderId === this.currentUser.id
        ) {
          this.messages.push({
            text: data.content,
            isOwn: data.senderId === this.currentUser.id,
            avatar:
              data.senderId === this.currentUser.id
                ? this.currentUser.avatar
                : this.selectedUser?.avatar,
            timestamp: data.timestamp,
          });
        }
      });
    } catch (err) {
      console.error('[Chat] initChat error:', err);
      this.error = 'Failed to initialize chat. Please try again.';
    }
  }

  async loadConversation(userId: number): Promise<void> {
    try {
      this.messages = []; // clear messages immediately to avoid flicker

      const conv = await lastValueFrom(
        this.http.get<any[]>(
          `${this.apiBase}/messages/conversation/${userId}`,
          {
            headers: this.getAuthHeaders(),
          }
        )
      );

      this.messages = (conv ?? []).map((msg) => ({
        text: msg.content,
        isOwn: msg.sender_id === this.currentUser.id,
        avatar:
          msg.sender_id === this.currentUser.id
            ? this.currentUser.avatar
            : this.selectedUser?.avatar,
        timestamp: msg.created_at,
      }));
    } catch (err) {
      console.error('[Chat] loadConversation error:', err);
      this.error = 'Failed to load conversation.';
      this.messages = [];
    }
  }

  sendMessage(msg: string): void {
    if (!msg.trim() || !this.selectedUser) return;

    const messagePayload = {
      receiver_id: this.selectedUser.id,
      content: msg,
    };

    this.http
      .post(`${this.apiBase}/messages/send`, messagePayload, {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        error: (err) => {
          console.error('[Chat] sendMessage error:', err);
          this.error = 'Failed to send message.';
        },
      });

    this.socketService.sendMessage(
      this.currentUser.id,
      this.selectedUser.id,
      msg
    );

    this.messages.push({
      text: msg,
      isOwn: true,
      avatar: this.currentUser.avatar,
      timestamp: new Date().toISOString(),
    });
  }
  handleLogout() {
    localStorage.clear(); // or just auth keys
    this.socketService.disconnect();
    // Redirect to login page (example)
    window.location.href = '/login';
  }

  async onUserSelected(user: any): Promise<void> {
    this.selectedUser = user;
    await this.loadConversation(user.id);
  }
}