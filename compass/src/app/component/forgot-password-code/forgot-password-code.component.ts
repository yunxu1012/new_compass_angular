
import { Component, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CompassService } from '../../service/compass.service';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors,} from '@angular/forms';

@Component({
  selector: 'app-forgot-password-code',
  templateUrl: './forgot-password-code.component.html',
  styleUrl: './forgot-password-code.component.css',
  standalone: false
})
export class ForgotPasswordCodeComponent {

  readonly errorMsg = signal<string>('');
  validationForm!: FormGroup;
  constructor(private http: HttpClient, private router: Router,
    public compassService: CompassService) {
    console.log('MyComponent initialized!');
  }

  ngOnInit(): void {
    this.validationForm = new FormGroup({
      code: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: this.matchValidator });
  }
  private matchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control?.get('password');
    const confirmPassword = control?.get('confirmPassword');
    return password?.value == confirmPassword?.value ? null : { 'notSame': true };
  }
  sendAgain(){
    var email = localStorage.getItem('email');
    var authUrl = "http://localhost:8080/api/auth/sendCode?email="+email+"&firstTime=false";
    console.log("authUrl: "+authUrl);
      
    this.sendCode(authUrl).subscribe({
      next: (res) => {
        
      },
      error: (e) => {
        console.log("error here");
        console.error(e);
        this.errorMsg.set(e.error);
      }
    });
  }

  sendCode(baseUrl: string): Observable<any> {
    return this.http.get(baseUrl);
  }

  back() {
    this.router.navigate(['/forgot-password-email']);
  }

  submit(){
    if (this.validationForm.invalid) {
      this.validationForm.markAllAsTouched(); // Mark all controls as touched
      return; // Prevent submission if form is invalid
    }
    var email = localStorage.getItem('email');
    var authUrl = "http://localhost:8080/api/auth/customer/resetPassword";
    const data = {
      email: localStorage.getItem('email'),
      password: this.validationForm.get('password')?.value,
      code: this.validationForm.get('code')?.value,
    };
    this.forgotPassword(authUrl,data).subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
      },
      error: (e) => {
      console.error(e);
      this.errorMsg.set(e.error); 
      }
    });
  }

  forgotPassword(baseUrl: string, data: any): Observable<any> {
    return this.http.post(baseUrl, data);
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
