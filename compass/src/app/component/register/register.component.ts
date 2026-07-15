import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, AbstractControl, ValidationErrors, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CompassService } from '../../service/compass.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: false
})
export class RegisterComponent {
  readonly errorMsg = signal<string>('');
  registerForm!: FormGroup;
  constructor(private http: HttpClient, private router: Router,
    public compassService: CompassService) {
    console.log('MyComponent initialized!');
  }
  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(40)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: this.matchValidator });
  }
  private matchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control?.get('password');
    const confirmPassword = control?.get('confirmPassword');
    return password?.value == confirmPassword?.value ? null : { 'notSame': true };
  }

  onSubmit() {
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
    this.send_code();
  }



  send_code(): void {
    //var authUrl =  this.compassService.basicUrl+'auth/customer/signup';
    var email = this.registerForm.get('email')?.value;
    //var authUrl = "http://100.54.246.90:8080/api/auth/registerCode?email="+email+"&firstTime=true";
    var authUrl = this.compassService.basicUrl+"auth/registerCode?email="+email+"&firstTime=true";
  
    localStorage.setItem('firstName', this.registerForm.get('firstName')?.value);
    localStorage.setItem('lastName',  this.registerForm.get('lastName')?.value);
    localStorage.setItem('email', email);
    localStorage.setItem('phoneNumber', this.registerForm.get('phoneNumber')?.value);
    localStorage.setItem('password', this.registerForm.get('password')?.value);
    this.sendCode(authUrl).subscribe({
      next: (res) => {
        this.router.navigate(['/register-validation']);
      },
      error: (e) => {
        console.error(e);
        this.errorMsg.set(e.error);
      }
    });
  }

  sendCode(baseUrl: string): Observable<any> {
    return this.http.get(baseUrl);
  }

  hidePassword = true; // Initially hide the password

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  hideConfirmPassword = true; // Initially hide the password
  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}
