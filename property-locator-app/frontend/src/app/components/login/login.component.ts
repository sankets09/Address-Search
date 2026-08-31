import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  popup: { type: 'success' | 'error'; message: string } | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.router.navigate(['/search']),
      error: (err) => {
        this.popup = {
          type: 'error',
          message: this.loginError(err),
        };
      },
    });
  }

  closePopup(): void {
    this.popup = null;
  }

  private loginError(err: unknown): string {
    const body = (err as { error?: unknown })?.error;
    if (typeof body === 'string') {
      try {
        const parsed = JSON.parse(body) as { message?: string };
        if (parsed?.message) {
          return parsed.message;
        }
      } catch {
        return body.trim() || 'Invalid username or password';
      }
      return body.trim() || 'Invalid username or password';
    }
    return (body as { message?: string })?.message?.trim() || 'Invalid username or password';
  }
}
