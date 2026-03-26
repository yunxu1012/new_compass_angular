import { Component, signal } from '@angular/core';
import { FormGroup, AbstractControl, ValidationErrors, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CompassService } from '../../service/compass.service';
import { JwtInfo } from '../../model/jwt-info.model';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
  standalone: false
})
export class AdminLoginComponent {
  email: string = '';
  password: string = '';
  readonly errorMsg = signal<string>('');
  jwtInfo?: JwtInfo;

  adminLoginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(private http: HttpClient, private router: Router, private compassService: CompassService) {
    console.log('MyComponent initialized!');
  }

  onSubmit() {
    console.log("submit: ");
    if (this.adminLoginForm.invalid) {
      this.adminLoginForm.markAllAsTouched(); // Mark all controls as touched
      return; // Prevent submission if form is invalid
    }
    let email = this.adminLoginForm.controls.email.value;
    if (email != null) {
      this.email = email;
    }
    let password = this.adminLoginForm.controls.password.value;
    if (password != null) {
      this.password = password;
    }
    console.log("email: " + this.email);
    //this.compassService.search = false;
    this.login();
  }
  authUrl = 'http://localhost:8080/api/auth/admin/login';

  login(): void {
    const data = {
      email: this.email,
      password: this.password,
    };

    this.createToken(this.authUrl, data).subscribe({
      next: (res) => {
        localStorage.setItem('email', this.email);
        this.jwtInfo = res;
        if (this.jwtInfo?.token) {
          localStorage.setItem('token', this.jwtInfo?.token);
        }
        console.log("token: " + this.jwtInfo?.token);
        this.router.navigate(['/customer-list']);
      },
      error: (e) => {
        console.error(e);
        this.errorMsg.set(e.error);
      }
    });
  }

  createToken(baseUrl: string, data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(baseUrl, data, {
      headers: headers
    });
  }



}
