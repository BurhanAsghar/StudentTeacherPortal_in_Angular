import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { StudentDetailComponent } from './components/student-detail/student-detail.component';
import { StudentsComponent } from './components/students/students.component';
import { UpdateStudentComponent } from './components/update-student/update-student.component';



import { AuthService } from './auth.service';
import { StudentService } from './student.service';
import { AuthInterceptor  } from './http.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    AddStudentComponent,
    DashboardComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    StudentDetailComponent,
    StudentsComponent,
    UpdateStudentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Import FormsModule here
    HttpClientModule
  ],
  providers: [AuthService, StudentService,
      { 
        provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor , multi:true
      },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
