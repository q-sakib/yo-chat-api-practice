import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import '@ui5/webcomponents/dist/Input.js';
import '@ui5/webcomponents/dist/Dialog.js';
import '@ui5/webcomponents/dist/Button.js';
import '@ui5/webcomponents-icons/dist/show.js';
import '@ui5/webcomponents-icons/dist/hide.js';
import '@ui5/webcomponents-icons/dist/sys-enter-2.js';
import { Ui5InputComponent } from '../../../ui5-input/ui5-input';
// import { AuthService } from '../../auth.service';
import { LoginFormComponent } from '../login-form.component';
import { ForgotPasswordFormComponent } from '../forgot-password-form.component';
import { ChangePasswordFormComponent } from '../change-password-form.component';
import { AuthService } from '../../../serve/auth.service';
// import { AuthService } from '../../serve/auth.service';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  templateUrl: './auth-dialog.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    FormsModule,
    CommonModule,
    // Ui5InputComponent,
    LoginFormComponent,
    ForgotPasswordFormComponent,
    ChangePasswordFormComponent,
  ],
})
export class AuthDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('loginPopupDialog') dialogRef!: ElementRef;
  // @Output() cancelled = new EventEmitter<void>();

  // === State Management ===
  currentState: 'login' | 'forgot' | 'reset' | 'machineboard' = 'login';
  title: string = 'Sign In';

  // === Form fields ===
  // username = '';
  email = '';
  password = '';
  newPassword = '';
  confirmPassword = '';
  passwordVisible = false;

  // === Feedback ===
  error: string = '';
  emailSent: string = '';

  returnUrl: string = '/messages'; // Default return URL after login

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Redirect if already authenticated
    // if (this.auth.isAuthenticated()) {
    //   this.router.navigateByUrl(this.returnUrl);
    //   return;
    // }

    // Optionally get return URL from query params
    this.returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') || this.returnUrl;
  }

  ngAfterViewInit(): void {
    console.log('Opening dialog...');

    if (this.dialogRef && this.dialogRef.nativeElement) {
      console.log('dialogRef.nativeElement:', this.dialogRef.nativeElement);
      this.dialogRef.nativeElement.open = true; // UI5 v2+ uses `.open = true`
    } else {
      console.warn('dialogRef is undefined or not ready');
    }
    // Open the dialog after view is initialized
    // this.dialogRef.nativeElement.open = false;
    // if (this.dialogRef?.nativeElement) {
    //   this.dialogRef.nativeElement.open = true;
    // }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  switchState(state: 'login' | 'forgot' | 'reset' | 'machineboard'): void {
    this.currentState = state;
    this.error = '';
    this.emailSent = '';

    switch (state) {
      case 'login':
        this.title = 'Sign In';
        break;
      case 'forgot':
        this.title = 'Forgot my password';
        break;
      case 'reset':
        this.title = 'Change Password';
        break;
      case 'machineboard':
        this.title = 'Machineboard';
        break;
    }
  }

  // closeDialog(): void {
  //   this.dialogRef.nativeElement.open = false;
  //   this.cancelled.emit();

  //   // if (this.dialogRef?.nativeElement) {
  //   //   this.dialogRef.nativeElement.open = false;
  //   // }
  // }

  closeDialog(): void {
    console.log('Closing dialog...');

    if (this.dialogRef && this.dialogRef.nativeElement) {
      this.dialogRef.nativeElement.open = false;
    } else {
      console.warn('dialogRef is undefined or not ready');
    }
  }

  //   onLoginSubmit(): void {
  //     this.error = '';
  //     // const username = this.username.trim();
  //     const email = this.email.trim();
  //     const password = this.password.trim();

  // // if ((!username && !email) || (username && email) || !password) {
  // //   this.error = 'Sorry, we could not authenticate you. Try again.';
  // //   return;
  //     // }

  //     if (!email || !password) {
  //   this.error = 'Sorry, we could not authenticate you. Try again.';
  //   return;
  // }

  //     // this.auth.login(email || username, password).subscribe({
  //     this.auth.login(email, password).subscribe({
  //       next: (res) => {
  //         // res has type LoginResponse: { user, token }
  //         console.log('Logged in user:', res.user);
  //         this.closeDialog();
  //         this.router.navigateByUrl(this.returnUrl || '/dashboard');
  //       },
  //       error: (err) => {
  //         console.error('Login error:', err);
  //         this.error = err?.error?.message || 'Login failed. Try again.';
  //       },
  //     });
  //   }

  async onLoginSubmit(): Promise<void> {
    this.error = '';
    const email = this.email;
    const password = this.password;

    // 🔐 Basic validation
    if (!email) {
      this.error = 'Email is required.';
      return;
    }
    if (!password) {
      this.error = 'Password is required.';
      return;
    }

    try {
      // 🔐 Call login and wait for the Observable to be returned
      const login$ = await this.auth.login(email, password);

      // 🔁 Now subscribe to the observable
      login$.subscribe({
        next: (user) => {
          console.log('✅ Logged in user:', user);
          this.closeDialog();
          this.router.navigateByUrl(this.returnUrl || '/messages');
        },
        error: (err) => {
          console.error('Login error:', err);
          this.error =
            err?.error?.error ||
            err?.error?.message ||
            'Login failed. Please check your credentials.';
        },
      });
    } catch (err) {
      console.error('Login CSRF or network error:', err);
      this.error = 'Login failed. Please try again.';
    }
  }

  // === FORGOT PASSWORD ===
  onForgotSubmit(email: string): void {
    this.error = '';
    this.emailSent = '';

    if (!email || !email.includes('@')) {
      this.error = 'Sorry, we could not authenticate you. Try again.';
      return;
    }

    // Simulate backend API call
    this.auth.sendResetEmail(email).subscribe({
      next: () => {
        this.emailSent = 'Email successfully sent! Please check your email.';
        // Optionally auto-switch after delay
        setTimeout(() => this.switchState('reset'), 2000);
      },
      error: (err) => {
        console.error('Email reset error:', err);
        this.error = err?.message || 'Failed to send reset email.';
      },
    });
  }

  // === CHANGE PASSWORD ===
  onPasswordResetSubmit(): void {
    this.error = '';
    if (!this.newPassword || this.newPassword.length < 6) {
      this.error = 'Password must be at least 6 characters.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match. Please try again.';
      return;
    }
    // Simulate backend call to reset password
    this.auth.resetPassword(this.email, this.newPassword).subscribe({
      next: () => {
        this.switchState('login');
        this.emailSent = 'Password changed successfully. You can now sign in.';
        this.newPassword = '';
      },
      error: (err) => {
        console.error('Reset password error:', err);
        this.error = err?.message || 'Failed to change password.';
      },
    });
  }
}
