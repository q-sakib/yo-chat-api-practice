// src/app/auth/services/auth.service.ts
import { Injectable } from '@angular/core';
// import { HttpClient,  } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginResponse, User } from '../interfaces/api-user.interface';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly apiBaseUrl = 'http://localhost:8000/api';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.restoreSession();
  }

  // 🔐 LOGIN
  login(email: string, password: string): Observable<User> {
    return this.http
      .post<{ user: User; token: string }>(`${this.apiBaseUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => this.saveSession(res.user, res.token)),
        map((res) => res.user)
      );
  }

  // 🆕 REGISTER
  register(data: any): Observable<User> {
    return this.http
      .post<{ user: User; token: string }>(`${this.apiBaseUrl}/auth/register`, data)
      .pipe(
        tap((res) => this.saveSession(res.user, res.token)),
        map((res) => res.user)
      );
  }

  // 🔐 LOGOUT
  logout(): void {
    const token = this.getAccessToken();

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.post(`${this.apiBaseUrl}/auth/logout`, {}, { headers }).subscribe({
        next: () => this.clearSession(),
        error: () => this.clearSession(),
      });
    } else {
      this.clearSession();
    }

    this.router.navigate(['/auth/login']);
  }

  // 🌐 GET AUTH USER (optional use)
  fetchUser(): Observable<User> {
    const token = this.getAccessToken();
    if (!token) {
      this.logout();
      throw new Error('No access token');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiBaseUrl}/auth/user`, { headers }).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      })
    );
  }

  // 🧠 SESSION HELPERS
  private restoreSession(): void {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    const userJson = localStorage.getItem(this.USER_KEY);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (err) {
        this.logout(); // corrupted user data
      }
    }
  }

  private saveSession(user: User, token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private clearSession(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  // 📦 HELPERS
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken() && !!this.getCurrentUser();
  }

  getPermissions(): string[] {
    return this.getCurrentUser()?.permissions || [];
  }

  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  // // 🔧 SEND PASSWORD RESET EMAIL (STUB / BACKEND REQUIRED)
  // sendResetEmail(email: string): Observable<boolean> {
  //   // Replace with real API call when backend is ready
  //   return this.http.post(`${this.apiBaseUrl}/password/email`, { email }).pipe(
  //     tap(() => console.log('[AuthService] Password reset email sent')),
  //     mapTo(true)
  //   );
  // }

  // // 🔧 RESET PASSWORD (STUB / BACKEND REQUIRED)
  // resetPassword(
  //   token: string,
  //   email: string,
  //   password: string
  // ): Observable<boolean> {
  //   // Replace with real API call when backend is ready
  //   return this.http
  //     .post(`${this.apiBaseUrl}/password/reset`, {
  //       token,
  //       email,
  //       password,
  //       password_confirmation: password,
  //     })
  //     .pipe(
  //       tap(() => console.log('[AuthService] Password has been reset')),
  //       mapTo(true)
  //     );
  // }

  // 🔧 OPTIONAL: Password reset stubs
  sendResetEmail(email: string): Observable<boolean> {
    console.log('[AuthService] Sending password reset email...');
    return of(true); // implement when backend ready
  }

  resetPassword(email: string, newPassword: string): Observable<boolean> {
    console.log('[AuthService] Resetting password...');
    return of(true); // implement when backend ready
  }
}