import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, AbstractControl, ValidationErrors, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Customer } from '../../model/customer.model';
import { CompassService } from '../../service/compass.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  standalone: false
})
export class ProfileComponent {
  isEditMode: boolean = false;
  profileForm!: FormGroup;
  customer?: Customer;
  constructor(private http: HttpClient, private router: Router, private compassService: CompassService) {

  }
  ngOnInit(): void {
    this.loadCustomerProfile();
    this.profileForm = new FormGroup({
      firstName: new FormControl(this.customer?.firstName, [Validators.required, Validators.maxLength(20)]),
      lastName: new FormControl(this.customer?.lastName, [Validators.required, Validators.maxLength(20)]),
      phoneNumber: new FormControl(this.customer?.phoneNumber, [Validators.required, Validators.pattern('^[0-9]{9}$')]),
    });
    this.profileForm.disable();
  }
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.profileForm.controls['firstName'].setValue(this.customer?.firstName);
      this.profileForm.controls['lastName'].setValue(this.customer?.lastName);
      this.profileForm.controls['phoneNumber'].setValue(this.customer?.phoneNumber);
      this.profileForm.enable(); // Enable controls in edit mode
    } else {
      this.profileForm.disable(); // Disable controls in view mode
    }
  }

  cancelEdit(): void {
    this.toggleEditMode(); // Exit edit mode
  }

  saveEdit(): void {
    this.toggleEditMode(); // Exit edit mode
  }

  profileUrl = 'http://localhost:8080/api/customers/';
  loadCustomerProfile() {
    var email = localStorage.getItem('email');
    var url = this.profileUrl + email;
    this.getProfile(url).subscribe({
      next: (data) => {
        this.customer = data;
      },
      error: (e) => console.error(e)
    });

  }

  getProfile(url: string): Observable<Customer> {
    var token = localStorage.getItem('token')!;
    var authHeader = "Bearer ";
    if(token){
      authHeader +=token;
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authHeader
      })
    };
    return this.http.get<Customer>(url, httpOptions);
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched(); // Mark all controls as touched
      return; // Prevent submission if form is invalid
    }
    var email = localStorage.getItem('email');
    var url = "http://localhost:8080/api/customers/" + email;
    const data = {
      firstName: this.profileForm.get('firstName')?.value,
      lastName: this.profileForm.get('lastName')?.value,
      email: email,
      phoneNumber: this.profileForm.get('phoneNumber')?.value,
    };
    this.updateProfile(url, data).subscribe({
      next: (data) => {
        this.toggleEditMode();
        this.customer = data;
      },
      error: (e) => {
      console.error(e);
      }
    });
  }

  updateProfile(url: string, data: any): Observable<Customer> {
    var token = localStorage.getItem('token')!;
    var authHeader = "Bearer ";
    if(token){
      authHeader +=token;
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authHeader
      })
    };
    return this.http.put<Customer>(url, data, httpOptions);
  }

}
