import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-all-users',
  standalone: true,

  imports: [CommonModule],
  templateUrl: './all-users.html',
  styleUrl: './all-users.css',
})
export class AllUsers implements OnInit {
  users: any[] = [];
  error: string | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('[AllUsers] Component initialized');
    this.fetchUsers();
  }

  async fetchUsers(): Promise<void> {
    const token = localStorage.getItem('auth_token');
    console.log('[AllUsers] Retrieved token:', token);

    if (!token) {
      this.error = 'Unauthorized: No token found.';
      this.users = [];
      console.warn('[AllUsers] No token found, cannot fetch users');
      return;
    }

    try {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });

      console.log('[AllUsers] Using headers:', headers.get('Authorization'));

      const res = await lastValueFrom(
        this.http.get<any>('http://localhost:8000/api/users', { headers })
      );

      console.log('[AllUsers] Raw API response:', res);

      // ✅ Extract users safely from the API response
      this.users = Array.isArray(res) ? res : res.users ?? res.data ?? [];

      console.log('[AllUsers] Users assigned:', this.users);

      this.error = null;
      this.cdr.detectChanges(); // ✅ Trigger change detection
    } catch (err: any) {
      console.error('[AllUsers] Failed to fetch users', err);
      this.error =
        'Failed to load users. ' +
        (err?.error?.message || err?.statusText || 'Unknown error');
      this.users = [];
    }
  }
}