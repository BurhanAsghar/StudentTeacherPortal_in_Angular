import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';  // Adjust the import path as necessary

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  userData: any = {
    username: '',
    email: '',
    password: ''
  };
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  signup() {
    this.authService.signup(this.userData).subscribe(
      () => {
        this.router.navigateByUrl('/login');  // Redirect to login after successful signup
      },
      (err: any) => {
        this.error = err.error.message;  // Display error message
      }
    );
  }
}
