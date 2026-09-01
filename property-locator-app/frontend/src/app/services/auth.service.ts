import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface AuthResponseBody {
  token?: string;
  user?: {
    userId?: number;
    username?: string;
    email?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;
  private readonly tokenKey = 'property_app_token';
  private readonly userKey = 'property_app_user';

  constructor(private http: HttpClient) {}

  login(payload: { username: string; password: string }): Observable<AuthResponseBody> {
    return this.http
      .post<AuthResponseBody>(`${this.apiUrl}/login`, {
        username: payload.username,
        password: payload.password,
      })
      .pipe(
        tap((response) => {
          const token = response?.token?.trim();
          const username = response?.user?.username?.trim();

          if (!token) {
            return;
          }

          localStorage.setItem(this.tokenKey, token);
          if (username) {
            localStorage.setItem(this.userKey, username);
          }
        }),
      );
  }

  register(payload: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      username: payload.username,
      email: payload.email,
      password: payload.password,
    });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      this.logout();
      return false;
    }

    const isValid = Date.now() < payload.exp * 1000;
    if (!isValid) {
      this.logout();
    }

    return isValid;
  }

  getCurrentUsername(): string | null {
    return localStorage.getItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private decodeToken(token: string): { exp?: number } | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return null;
      }

      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded) as { exp?: number };
    } catch {
      this.logout();
      return null;
    }
  }
}
