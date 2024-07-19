// src/app/components/update-student/update-student.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { StudentService } from 'src/app/student.service';

@Component({
  selector: 'app-update-student',
  templateUrl: './update-student.component.html',
  styleUrls: ['./update-student.component.css']
})
export class UpdateStudentComponent implements OnInit {
  teacherName: string | undefined;
  studentData: any = {};
  error = '';

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
        this.studentData = data.student;
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  updateStudent() {
    const rollno = this.route.snapshot.params['rollno'];
    this.studentService.updateStudent(rollno, this.studentData).subscribe(
      () => {
        this.router.navigateByUrl('/students');  // Redirect to students page after update
      },
      (err: any) => {
        this.error = err.error.message;  // Display error message
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
