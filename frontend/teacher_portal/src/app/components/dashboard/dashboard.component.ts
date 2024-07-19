import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  teacherName: string | undefined;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    // Fetch teacher name or any other initialization logic
    this.teacherName = 'Teacher'; // Replace with actual teacher name logic
  }
  logout() {
    this.authService.logout().subscribe(
      () => {
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');  // Redirect to login after logout
      },
      (err: any) => {
        console.error(err);
      }
    );
  }
}
