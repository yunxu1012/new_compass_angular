import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '../../model/customer.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomerPreference } from '../../model/customer-preference.model';
import { BedCount } from '../../enum/bed-count';
import { BathCount } from '../../enum/bath-count';
@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.css',
  standalone: false
})
export class CustomerDetailComponent {
  constructor(private router: Router, private route: ActivatedRoute,private http: HttpClient) { }
email?:string;
profileUrl = 'http://localhost:8080/api/customers/';
customer?:Customer;
customerPreference?: CustomerPreference;
selectedCityNames: string[] = [];
bedCounts = Object.keys(BedCount);
bathCounts = Object.keys(BathCount);
search: boolean = false;

ngOnInit(): void {
let cEmail = this.route.snapshot.paramMap.get('email');
let search = this.route.snapshot.paramMap.get('search');
if(search!=null && search=="true"){
  this.search = true;
}
console.log("email: "+cEmail);
if(cEmail){
  this.email = cEmail;
  this.loadCustomer();
  //this.loadCustomerPreference();
}

}
loadCustomer() {
  var url = this.profileUrl + this.email;
  this.getProfile(url).subscribe({
    next: (data) => {
      this.customer = data;
      console.log("Customer001 phone number: " + this.customer?.phoneNumber);
    },
    error: (e) => console.error(e)
  });

}
getProfile(url: string): Observable<Customer> {
  return this.http.get<Customer>(url);
}

preferenceUrl = 'http://localhost:8080/api/customersPreferences/';
  loadCustomerPreference() {
    console.log("load preference: "+ this.email);
    var url = this.profileUrl + this.email;
    this.getPreference(url).subscribe({
      next: (data) => {
        this.customerPreference = data;
        console.log("success: "+ this.customerPreference.maxPrice);
        this.displayCustomerCity();
      },
      error: (e) => {
        console.log("load preference error: "+ this.email);
        console.error(e);
      }
    });
  }

  getPreference(url: string): Observable<CustomerPreference> {
    return this.http.get<CustomerPreference>(url);
  }

  displayCustomerCity(){
    if (this.customerPreference?.cities) {
      this.selectedCityNames = [];
      for (const city of this.customerPreference?.cities) {
        if (city.name) {
          this.selectedCityNames.push(city.name);
        }
      }
    }
  }

  getBedCountByKey(keyStr: string | undefined): string | undefined {
    for (const [key, value] of Object.entries(BedCount)) {
      if (key === keyStr) {
        return value
      }
    }
    return undefined;
  }

  getBathCountByKey(keyStr: string | undefined): string | undefined {
    for (const [key, value] of Object.entries(BathCount)) {
      if (key === keyStr) {
        return value
      }
    }
    return undefined;
  }
}
