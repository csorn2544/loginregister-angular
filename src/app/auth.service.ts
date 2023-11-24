// src/app/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private isAuthenticated = false;
  private userInfo: any;

  constructor(private http: HttpClient) {
    this.initUserInfo();
  }

  initUserInfo() {
    const storedUserInfo = localStorage.getItem('userInfo');
    this.userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : {};
    this.isAuthenticated = !!this.userInfo.userId;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username: username, password })
      .pipe(
        map((response: any) => {
          this.isAuthenticated = true;
          this.userInfo = response.user; 
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
          return response;
        })
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getUserInfo(): any {
    return this.userInfo;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.userInfo = null;
    localStorage.removeItem('userInfo');
  }

}
