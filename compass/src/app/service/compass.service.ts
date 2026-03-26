import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from '../model/city.model';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { BedCount } from '../enum/bed-count';
import { BathCount } from '../enum/bath-count';
import { Customer } from '../model/customer.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CompassService {
  cities: City[] = [];
  customers: Customer[] = [];
  pagedCustomers?: Customer[];
  search:boolean = false;
  constructor(private http: HttpClient, private router: Router) { }
  citiesUrl = 'http://localhost:8080/api/cities';
  pageSize :number= 10;
  currentPage:number = 1;
  totalPages: number =1;
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
    var token = localStorage.getItem('token');
    var authHeader = "Bearer ";
    if(token){
      authHeader +=token;
    }
    this.listCustomers(authHeader);
  }

  listCustomers(authHeader:string): void {
    console.log("list customer: "+ authHeader);
    var url = "http://localhost:8080/api/admin/customers";
    this.getCustomers(url, authHeader).subscribe({
      next: (data) => {
        this.customers = data;
        this.pagedCustomers = data;
        this.totalPages = Math.ceil(this.customers.length / this.pageSize);
        this.updatePagedData();
      },
      error: (e) => {
      console.error(e);
      var msg = e.error.message;
          if(msg==="JWT token expired"){
           this.logout();
           this.router.navigate(['/admin_login']);
          }
      }
    });
  }

  getCustomers(baseUrl: string, authHeader:string): Observable<Customer[]> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    };
    return this.http.get<Customer[]>(baseUrl, {
      headers: headers
    });
  }

  updatePagedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedCustomers = this.customers.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedData();
    }
  }

  getPages(): number[] {
      return Array(this.totalPages).fill(0).map((_, index) => index + 1);
  }
 
  logout(){
    localStorage.removeItem('email');
    localStorage.removeItem('token');
  }

}
