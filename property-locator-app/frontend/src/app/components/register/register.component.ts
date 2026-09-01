import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  username = '';
  email = '';
  password = '';
  isLoading = false;
  popup: { type: 'success' | 'error'; message: string; navigateToLogin?: boolean } | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/search']);
    }
  }

  onSubmit(): void {
    if (this.isLoading || !this.username.trim() || !this.email.trim() || !this.password.trim()) return;
    this.isLoading = true;
    this.authService.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.popup = {
          type: 'success',
          message: 'Registered successfully',
          navigateToLogin: true,
        };
      },
      error: (err) => {
        this.isLoading = false;
        this.popup = {
          type: 'error',
          message: this.registrationError(err),
        };
      },
    });
  }

  closePopup(): void {
    const goToLogin = this.popup?.navigateToLogin;
    this.popup = null;
    if (goToLogin) {
      this.router.navigate(['/login']);
    }
  }

  private registrationError(err: unknown): string {
    const body = (err as { error?: unknown })?.error;
    const raw = typeof body === 'string' ? body : (body as { message?: string })?.message || '';
    const text = raw.toLowerCase();
    if (text.includes('username')) {
      return 'Username already taken';
    }
    if (text.includes('email')) {
      return 'Email already taken';
    }
    return raw.trim() || 'Registration failed';
  }
}
