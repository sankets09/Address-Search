import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(payload: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      username: payload.username,
      passwordHash: payload.password,
    }, { responseType: 'text' });
  }

  register(payload: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      username: payload.username,
      email: payload.email,
      passwordHash: payload.password,
    });
  }
}
