import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CompassService } from '../../service/compass.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BedCount } from '../../enum/bed-count';
import { BathCount } from '../../enum/bath-count';
import { Customer } from '../../model/customer.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrl: './customer-search.component.css',
  standalone: false
})
export class CustomerSearchComponent {
  searchForm!: FormGroup;
  hometypes = ["House", "Multi Family", "Townhouse", "Condo", "Mobile", "Co-op", "Land", "Other"];
  bedCounts = Object.keys(BedCount);
  bathCounts = Object.keys(BathCount);
  selectedCityNames: string[] = [];

  constructor(private http: HttpClient, private router: Router, public compassService: CompassService) {

  }

  ngOnInit(): void {

    this.searchForm = new FormGroup({
      homeType: new FormControl(''),
      price: new FormControl('', [ Validators.pattern('^[0-9]{0,8}$')]),
      squareFeet: new FormControl('', [Validators.pattern('^[0-9]{0,8}$')]),
      bedCount: new FormControl(''),
      bathCount: new FormControl(''),
      city: new FormControl(''),
    });
    this.compassService.loadCities();
  }

  public selected(value: any): void {
    /*this.selectedCityNames = [];
    for (const city of value) {
      this.selectedCityNames.push(city.name);
    } */
  }

  search(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched(); // Mark all controls as touched
      return; // Prevent submission if form is invalid
    }
    this.compassService.search = true;
    var url = this.compassService.basicUrl+'admin/search';
    var homeTypeValue = null;
    if(this.searchForm.get('homeType')?.value!=""){
      homeTypeValue = this.searchForm.get('homeType')?.value;
    }
    var bedCountValue = null;
    if(this.searchForm.get('bedCount')?.value!=""){
      bedCountValue = this.searchForm.get('bedCount')?.value;
    }
    var bathCountValue = null;
    if(this.searchForm.get('bathCount')?.value!=""){
      bathCountValue = this.searchForm.get('bathCount')?.value;
    }
    var priceValue = null;
    if(this.searchForm.get('price')?.value!=""){
       priceValue = this.searchForm.get('price')?.value;
    }
    var squareFeetValue = null;
    if(this.searchForm.get('squareFeet')?.value!=""){
      squareFeetValue = this.searchForm.get('squareFeet')?.value;
    }
    var cityIdValue = null;
    if(this.searchForm.get('city')?.value.cityId){
       cityIdValue = this.searchForm.get('city')?.value.cityId;
    }
    const data = {
      homeType: homeTypeValue,
      bedCount: bedCountValue,
      bathCount: bathCountValue,
      price: priceValue,
      squareFeet: squareFeetValue,
      cityId: cityIdValue,
    };
    this.getFilteredCustomers(url, data).subscribe({
      next: (data) => {
        this.compassService.customers = data;
        this.compassService.pagedCustomers.set(data);
        this.compassService.totalPages = Math.ceil(this.compassService.customers.length
          / this.compassService.pageSize);
        this.compassService.updatePagedData();
        this.router.navigate(['/customer-list']);
      },
      error: (e) => {
        console.error(e);
        if(e && e.error){
        var msg = e.error.message;
        if (msg === "JWT token expired") {
          this.compassService.adminLoginAgain();
          this.router.navigate(['/admin_login']);
        }
      }
      }
    });
  }

  cancel() {
    this.compassService.search = false;
    this.router.navigate(['/customer-list']);
  }

  getFilteredCustomers(url: string, data: any): Observable<Customer[]> {
    
    const httpOptions = {
      headers: this.compassService.getAdminHttpHeaders()
    };
    return this.http.post<Customer[]>(url, data, httpOptions);
  }
}
