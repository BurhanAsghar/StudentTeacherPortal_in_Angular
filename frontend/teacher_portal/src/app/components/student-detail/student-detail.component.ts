// src/app/components/student-detail/student-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { StudentService } from 'src/app/student.service';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  teacherName: string | undefined;
  student: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit() {
    // Fetch teacher name or any other initialization logic
    this.teacherName = 'Teacher'; // Replace with actual teacher name logic
    this.fetchStudent();
  }

  fetchStudent() {
    const rollno = this.route.snapshot.params['rollno'];
    this.studentService.getStudentByRollno(rollno).subscribe(
      (data: any) => {
        this.student = data.student;
      },
      (err: any) => {
        console.error(err);
      }
    );
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
