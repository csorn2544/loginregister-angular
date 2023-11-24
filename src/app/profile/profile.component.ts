// profile.component.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ActivityService } from '../activity.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userInfo: any;
  userActivities: any;

  constructor(
    private authService: AuthService,
    private activityService: ActivityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.initUserInfo();
    this.userInfo = this.authService.getUserInfo();
  
    if (this.userInfo && this.userInfo.id) {
      this.activityService.getUserActivities(this.userInfo.id).subscribe(
        (activities) => {
          this.userActivities = activities;
          console.log(this.userActivities);
        },
        (error) => {
          console.error('Error fetching user activities:', error);
        }
      );
    }
  }
  

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
