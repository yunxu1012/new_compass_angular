import {Component} from '@angular/core';
import {FormGroup, AbstractControl,ValidationErrors, FormControl, ReactiveFormsModule,  Validators} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Router } from '@angular/router';

@Component({
    selector: 'app-admin-login',
    templateUrl: './admin-login.component.html',
    styleUrl: './admin-login.component.css',
    standalone: false
})
export class AdminLoginComponent {
  email:string ='';
  password:string = '';
  adminLoginForm = new FormGroup({
    email: new FormControl('',  [Validators.required, Validators.email]),
    password: new FormControl('',  Validators.required),
  });

  constructor(private http: HttpClient, private router: Router){
    console.log('MyComponent initialized!');
  }

  onSubmit(){ 
    console.log("submit: ");
    if (this.adminLoginForm.invalid) {
      this.adminLoginForm.markAllAsTouched(); // Mark all controls as touched
      return; // Prevent submission if form is invalid
    }
    let email= this.adminLoginForm.controls.email.value;
    if(email!=null){
      this.email = email;
    }
    let password = this.adminLoginForm.controls.password.value;
    if(password!=null){
      this.password = password;
    }
    console.log("email: "+this.email);
    this.login();
  }
  authUrl =  'http://localhost:8080/api/auth/login';

  login(): void {
    const data = {
      email: this.email,
      password: this.password,
    };

    this.createToken(this.authUrl,data).subscribe({
      next: (res) => {
        localStorage.setItem('email',this.email);
        this.router.navigate(['/customer-list']);
      },
      error: (e) => {
      console.error(e);
      }
    });
  }

  createToken(baseUrl: string, data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(baseUrl, data, {
      headers: headers,
      responseType: 'text' as const // Specify responseType as 'text'
    });
  }


  
}
