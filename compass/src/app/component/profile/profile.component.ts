import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, AbstractControl, ValidationErrors, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Customer } from '../../model/customer.model';
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
  constructor(private http: HttpClient, private router: Router) {

  }
  ngOnInit(): void {
    this.loadCustomerProfile();
    console.log("Customer first name002: " + this.customer?.firstName);
    ; this.profileForm = new FormGroup({
      firstName: new FormControl(this.customer?.firstName, Validators.required),
      lastName: new FormControl(this.customer?.lastName, Validators.required),
      email: new FormControl(this.customer?.email, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(this.customer?.phoneNumber, Validators.required),
      // password: new FormControl('',  Validators.required),
      // confirmPassword: new FormControl('',  [Validators.required, this.validateSamePassword]),
    });
    this.profileForm.disable();
  }
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.profileForm.controls['firstName'].setValue(this.customer?.firstName);
      this.profileForm.controls['lastName'].setValue(this.customer?.lastName);
      this.profileForm.controls['email'].setValue(this.customer?.email);
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
  private validateSamePassword(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('password');
    const confirmPassword = control.parent?.get('confirmPassword');
    return password?.value == confirmPassword?.value ? null : { 'notSame': true };
  }
  profileUrl = 'http://localhost:8080/api/customers/';
  loadCustomerProfile() {
    var email = localStorage.getItem('email');
    var url = this.profileUrl + email;
    this.getProfile(url).subscribe({
      next: (data) => {
        this.customer = data;
        console.log("Customer first name001: " + this.customer?.firstName);
      },
      error: (e) => console.error(e)
    });

  }

  getProfile(url: string): Observable<Customer> {
    return this.http.get<Customer>(url);
  }

  saveProfile() {
    //var email = localStorage.getItem('email');
    var url = "http://localhost:8080/api/customers";
    const data = {
      firstName: this.profileForm.get('firstName')?.value,
      lastName: this.profileForm.get('lastName')?.value,
      email: this.profileForm.get('email')?.value,
      phoneNumber: this.profileForm.get('phoneNumber')?.value,
      password: this.profileForm.get('password')?.value
    };
    this.updateProfile(url, data).subscribe({
      next: (data) => {
        this.toggleEditMode();
        this.customer = data;
      },
      error: (e) => console.error(e)
    });
  }

  updateProfile(url: string, data: any): Observable<Customer> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<Customer>(url, data, httpOptions);
  }

}
