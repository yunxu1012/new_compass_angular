import { Component, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CompassService } from '../../service/compass.service';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
@Component({
  selector: 'app-register-validation',
  templateUrl: './register-validation.component.html',
  styleUrl: './register-validation.component.css',
  standalone: false,
})
export class RegisterValidationComponent {
  readonly errorMsg = signal<string>('');
  validationForm!: FormGroup;
  constructor(private http: HttpClient, private router: Router,
    public compassService: CompassService) {
    console.log('MyComponent initialized!');
  }

  ngOnInit(): void {
    this.validationForm = new FormGroup({
      code: new FormControl('', [Validators.required]),
    });
  }
  sendAgain(){
    var email = localStorage.getItem('email');
    //var authUrl = "http://100.54.246.90:8080/api/auth/sendCode?email="+email+"&firstTime=false";
    var authUrl = this.compassService.basicUrl+"auth/sendCode?email="+email+"&firstTime=false";
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
    this.router.navigate(['/register']);
  }

  submit(){
    if (this.validationForm.invalid) {
      this.validationForm.markAllAsTouched(); // Mark all controls as touched
      return; // Prevent submission if form is invalid
    }
    var code = this.validationForm.get('code')?.value;
    var email = localStorage.getItem('email');
    //var authUrl = "http://100.54.246.90:8080/api/auth/customer/signup";
    var authUrl = this.compassService.basicUrl+"auth/customer/signup";
    const data = {
      firstName: localStorage.getItem('firstName'),
      lastName: localStorage.getItem('lastName'),
      email: localStorage.getItem('email'),
      phoneNumber: localStorage.getItem('phoneNumber'), 
      password: localStorage.getItem('password'),
      code: code,
    };
    this.registerCustomer(authUrl,data).subscribe({
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

