import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CompassService } from '../../service/compass.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';
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
      homeType: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      squareFeet: new FormControl('', Validators.required),
      bedCount: new FormControl('', Validators.required),
      bathCount: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
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
    this.compassService.search = true;
    var url = "http://localhost:8080/api/admin/search";
    const data = {
      homeType: this.searchForm.get('homeType')?.value,
      bedCount: this.searchForm.get('bedCount')?.value,
      bathCount: this.searchForm.get('bathCount')?.value,
      price: this.searchForm.get('price')?.value,
      squareFeet: this.searchForm.get('squareFeet')?.value,
      cityId: this.searchForm.get('city')?.value.cityId,
    };
    this.getFilteredCustomers(url, data).subscribe({
      next: (data) => {
        this.compassService.customers = data;
        console.log("search001: "+this.compassService.search);
      },
      error: (e) => console.error(e)
    });
  }

  getFilteredCustomers(url: string, data: any): Observable<Customer[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Customer[]>(url, data, httpOptions);
  }
}
