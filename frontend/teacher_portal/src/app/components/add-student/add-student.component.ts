import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/student.service';  // Adjust the path as necessary
import { AuthService } from 'src/app/auth.service';  // Assuming AuthService has the logout method
@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {
  studentData = {
    name: '',
    rollno: '',
    subject: ''
  };
  error = '';
  teacherName = `Teacher `;
  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit() {
    this.teacherName = this.authService.getTeacherName();  // Ensure teacher's name is properly set
  }
  addStudent() {
    this.studentService.addStudent(this.studentData).subscribe(
      () => {
        this.router.navigateByUrl('/students');  // Navigate to students page after successful addition
      },
      (err: any) => {
        this.error = err.error.message || 'Server error';  // Display error message
      }
    );
  }
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
