// src/app/components/students/students.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { StudentService } from 'src/app/student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  teacherName: string | undefined;
  students: any[] | undefined;

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit() {
    // Fetch teacher name or any other initialization logic
    this.teacherName = 'Teacher'; // Replace with actual teacher name logic
    this.fetchStudents();
  }

  fetchStudents() {
    this.studentService.getAllStudents().subscribe(
      (data: any) => {
        this.students = data.students;
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  deleteStudent(rollno: string) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(rollno).subscribe(
        () => {
          this.fetchStudents();  // Refresh student list after deletion
        },
        (err: any) => {
          console.error(err);
        }
      );
    }
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
