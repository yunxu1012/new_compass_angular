import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from '../model/city.model';
import { HttpClient } from '@angular/common/http';
import { BedCount } from '../enum/bed-count';
import { BathCount } from '../enum/bath-count';
import { Customer } from '../model/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CompassService {
  cities: City[] = [];
  customers: Customer[] = [];
  search:boolean = false;
  constructor(private http: HttpClient) { }
  citiesUrl = 'http://localhost:8080/api/cities';
  loadCities() {
    this.getCities(this.citiesUrl).subscribe({
      next: (data) => {
        this.cities = data;
      },
      error: (e) => {
        console.error(e);
        console.log("cities not fouund");
      }
    });
  }

  getCities(url: string): Observable<City[]> {
    return this.http.get<City[]>(url);
  }

  getBedByKey(keyStr: string): string {
    for (const [key, value] of Object.entries(BedCount)) {
      if (key === keyStr) {
        return value
      }
    }
    return "";
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

  clearFilter(){
    this.search = false;
    this.listCustomers();
  }

  listCustomers(): void {
    console.log("list customer");
    var url = "http://localhost:8080/api/customers";
    this.getCustomers(url).subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (e) => console.error(e)
    });
  }

  getCustomers(baseUrl: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(baseUrl);
  }

}
