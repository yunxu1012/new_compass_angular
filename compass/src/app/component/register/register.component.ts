import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormGroup, AbstractControl,ValidationErrors, FormControl, ReactiveFormsModule,  Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import {Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
    standalone: false
})
export class RegisterComponent {
  readonly errorMsg = signal<string>('');
  constructor(private http: HttpClient, private router: Router) { }
  registerForm = new FormGroup({
    firstName: new FormControl('',  [Validators.required, Validators.maxLength(20)]),
    lastName: new FormControl('',  [Validators.required, Validators.maxLength(20)]),
    email: new FormControl('',  [Validators.required, Validators.email, Validators.maxLength(40)]),
    phoneNumber: new FormControl('',  [Validators.required,  Validators.pattern('^[0-9]{9}$')]),
    password: new FormControl('',  [Validators.required, Validators.minLength(5),Validators.maxLength(20)]),
    confirmPassword: new FormControl('',  [Validators.required]),
  }, { validators: this.matchValidator });

 private matchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control?.get('password');
  const confirmPassword = control?.get('confirmPassword');
  return password?.value == confirmPassword?.value ? null : { 'notSame': true };
  }
  


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
  authUrl =  'http://localhost:8080/api/auth/customer/signup';

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
      this.errorMsg.set(e.error); 
      }
    });
  }

  registerCustomer(baseUrl: string, data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

}
