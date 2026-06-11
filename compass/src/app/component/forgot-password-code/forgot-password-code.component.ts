
import { Component, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CompassService } from '../../service/compass.service';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors,} from '@angular/forms';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-forgot-password-code',
  templateUrl: './forgot-password-code.component.html',
  styleUrl: './forgot-password-code.component.css',
  standalone: false
})
export class ForgotPasswordCodeComponent {

  readonly errorMsg = signal<string>('');
  readonly timeMsg = signal<string>('');
  validationForm!: FormGroup;
  fEmail?:string;
  constructor(private http: HttpClient, private router: Router,
    public compassService: CompassService, private datePipe: DatePipe) {
    console.log('MyComponent initialized!');
  }

  ngOnInit(): void {
    this.validationForm = new FormGroup({
      code: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: this.matchValidator });
    var email = localStorage.getItem('email');
    if(email){
      this.fEmail = email;
    }
  }
  private matchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control?.get('password');
    const confirmPassword = control?.get('confirmPassword');
    return password?.value == confirmPassword?.value ? null : { 'notSame': true };
  }
  sendAgain(){
    var email = localStorage.getItem('email');
    //var authUrl = "http://100.54.246.90:8080/api/auth/sendCode?email="+email+"&firstTime=false";
    var authUrl = this.compassService.basicUrl+"auth/sendCode?email="+email+"&firstTime=false";
    console.log("authUrl: "+authUrl);
      
    this.sendCode(authUrl).subscribe({
      next: (res) => {
        var codeTime = res;
        if(codeTime.time){
          console.log("time: "+codeTime.time);
          this.timeMsg.set("We send you token again at: "+this.getFormattedTime(codeTime.time)
          +",  Please use the latest token.")
        }
      },
      error: (e) => {
        console.log("error here");
        console.error(e);
        this.errorMsg.set(e.error);
      }
    });
  }

  getFormattedTime(rawDate: Date | string | number): string {
    // Arguments: (value, format, timezone, locale)
    return this.datePipe.transform(rawDate, 'MM/dd/yyyy HH:mm:ss') || '';
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
    //var authUrl = "http://100.54.246.90:8080/api/auth/customer/resetPassword";
    var authUrl = this.compassService.basicUrl+"auth/customer/resetPassword";
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
