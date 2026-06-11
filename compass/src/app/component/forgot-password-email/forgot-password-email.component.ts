import { Component, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CompassService } from '../../service/compass.service';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
@Component({
  selector: 'app-forgot-password-email',
  templateUrl: './forgot-password-email.component.html',
  styleUrl: './forgot-password-email.component.css',
  standalone: false
})
export class ForgotPasswordEmailComponent {
  readonly errorMsg = signal<string>('');
  emailForm!: FormGroup;
  constructor(private http: HttpClient, private router: Router, public compassService: CompassService) {
    console.log('MyComponent initialized!');
  }
  ngOnInit(): void {
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(40)]),
    });
  }
  back(){
    this.router.navigate(['/login']);
  }
  submit(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched(); // Mark all controls as touched
      return; // Prevent submission if form is invalid
    }
    //var authUrl =  this.compassService.basicUrl+'auth/customer/signup';
    var email = this.emailForm.get('email')?.value;
    var authUrl = this.compassService.basicUrl+"auth/sendCode?email="+email+"&firstTime=true";
    console.log("authUrl: "+authUrl);
    localStorage.setItem('email', email);
    this.sendCode(authUrl).subscribe({
      next: (res) => {
        this.router.navigate(['/forgot-password-code']);
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
}
