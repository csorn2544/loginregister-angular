import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loginSuccess: boolean = false;
  registerSuccess: boolean = false;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.registerSuccess = true;
      }
    });
  }

  login(): void {
    this.authService.login(this.username, this.password)
      .subscribe(response => {
        console.log('Login successful', response);
        this.loginSuccess = true; 
        this.registerSuccess = false; 
        this.router.navigate(['/profile']);
      }, error => {
        console.error('Login failed', error);
        this.errorMessage = error.error.message;
        this.loginSuccess = false; 
        this.registerSuccess = false;
      });
  }
}
