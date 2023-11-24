// src/app/activity.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getUserActivities(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/user-activities/${userId}`);
  }
}
