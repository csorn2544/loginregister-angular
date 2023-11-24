import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  registerSuccess: boolean = false; 

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'Please fill out all fields.';
      return;
    }

    this.authService.register(this.username, this.email, this.password)
      .subscribe(response => {
        console.log('Registration successful', response);
        this.registerSuccess = true;
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      }, error => {
        console.error('Registration failed', error);
        this.errorMessage = error.error.message; 
      });
  }
}
