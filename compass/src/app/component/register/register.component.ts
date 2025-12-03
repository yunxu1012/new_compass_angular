import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormGroup, AbstractControl,ValidationErrors, FormControl, ReactiveFormsModule,  Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import {Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private http: HttpClient, private router: Router) { }
  registerForm = new FormGroup({
    firstName: new FormControl('',  Validators.required),
    lastName: new FormControl('',  Validators.required),
    email: new FormControl('',  [Validators.required, Validators.email]),
    phoneNumber: new FormControl('',  Validators.required),
    password: new FormControl('',  Validators.required),
    confirmPassword: new FormControl('',  [Validators.required, this.validateSamePassword]),
  });

  private validateSamePassword(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('password');
    const confirmPassword = control.parent?.get('confirmPassword');
    return password?.value == confirmPassword?.value ? null : { 'notSame': true };
  }

  onSubmit(){
    console.log("submit on register");
    let name = this.registerForm.controls.firstName.value;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // Mark all controls as touched
      /*Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control && control.invalid) {
          console.log(`Control '${key}' is invalid. Errors:`, control.errors);
        }
      }); */
      return; // Prevent submission if form is invalid
    }
    this.register();
  }
  authUrl =  'http://localhost:8080/api/customers';

  register(): void {
    const data = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      email: this.registerForm.get('email')?.value,
      phoneNumber: this.registerForm.get('phoneNumber')?.value, 
      password: this.registerForm.get('password')?.value
    };
    this.registerCustomer(this.authUrl,data).subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
      },
      error: (e) => {
      console.error(e);
      }
    });
  }

  registerCustomer(baseUrl: string, data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

}
