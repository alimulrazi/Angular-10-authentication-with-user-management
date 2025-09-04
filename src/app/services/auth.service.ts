// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8001/api';
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private isLoggedIn = false;
  private userRole = '';
  public user = {
    id: 0,
    name: "",
    user_type_name: "",
    user_type_id: 0,
    default_printer_id: 0,
    image: 'assets/img/buddi-logo.png',
    permissions: [],
    menus: []
  };

  accessToken$ = new BehaviorSubject<string | null>(this.getAccessToken());

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(tokens => {
        this.isLoggedIn = true;
        this.setTokens(tokens.accessToken, tokens.refreshToken);
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<any>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap(tokens => {
        this.setTokens(tokens.accessToken, tokens.refreshToken);
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.accessToken$.next(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.accessToken$.next(accessToken);
  }

  getUserData() {
    const storedUser = localStorage.getItem('user_data');
    let currentUser = storedUser ? JSON.parse(storedUser) : "";

    this.user = {
      id: currentUser.id,
      name: currentUser.name,
      user_type_name: currentUser.user_type_name,
      user_type_id: currentUser.user_type_id,
      default_printer_id: currentUser.default_printer_id,
      image: 'assets/img/buddi-logo.png',
      permissions: currentUser.permissions,
      menus: currentUser.menus
    };
    return this.user;
  }

  isAuthenticated(): boolean {
    // Check token validity, session, etc.
    return this.isLoggedIn || !!localStorage.getItem('accessToken');
  }

  getUserRole(): string {
    return this.userRole || localStorage.getItem('userRole') || '';
  }
}
