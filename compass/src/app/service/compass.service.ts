import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from '../model/city.model';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { BedCount } from '../enum/bed-count';
import { BathCount } from '../enum/bath-count';
import { Customer } from '../model/customer.model';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompassService {
basicUrl: string = "http://100.31.117.71:8080/api/"
  //basicUrl: string = "http://localhost:8080/api/"
  cities: City[] = [];
  registerCustomer: Customer;
  customers: Customer[] = [];
  readonly pagedCustomers = signal<Customer[] | []>([]);;
  search:boolean = false;
  currentCustomer?:Customer;
  readonly adminTimeOut = signal<string>('');
  readonly customerTimeOut = signal<string>('');
  constructor(private http: HttpClient, private router: Router) { 
    this.registerCustomer = {
      firstName : "", lastName: "", email:"", phoneNumber: "", password: ""
    };
  }
  citiesUrl = this.basicUrl+'cities';
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

  getAdminHttpHeaders():HttpHeaders{
    var token = localStorage.getItem('admin_token');
    return this.getHttpHeaders(token);
  }

  getCustomerHttpHeaders():HttpHeaders{
    var token = localStorage.getItem('token');
    return this.getHttpHeaders(token);
  }

  getHttpHeaders(token:string|null):HttpHeaders{
    var authHeader = "Bearer ";
    if (token) {
      authHeader += token;
    }
      var headers=  new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authHeader
      });
      return headers;
  }

  clearFilter(){
    this.search = false;
    this.listCustomers();
  }

  listCustomers(): void {
    var url = this.basicUrl+"admin/customers";
    this.getCustomers(url).subscribe({
      next: (data) => {
        this.customers = data;
        this.pagedCustomers.set(data);
        this.totalPages = Math.ceil(this.customers.length / this.pageSize);
        this.updatePagedData();
      },
      error: (e) => {
      console.error(e);
      var msg = e.error.message;
          if(msg==="JWT token expired"){
           this.adminLoginAgain();
           this.router.navigate(['/admin_login']);
          }
      }
    });
  }

  getCustomers(baseUrl: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(baseUrl, {
      headers: this.getAdminHttpHeaders()
    });
  }

  updatePagedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedCustomers.set(this.customers.slice(startIndex, endIndex));
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
    localStorage.removeItem('name');
  }

  adminLogout(){
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_token');
  }
  adminLoginAgain(){
    this.adminLogout();
    this.adminTimeOut.set("Your session is end. Please login again");
  }

  customerLoginAgain(){
    this.logout();
    this.customerTimeOut.set("Your session is end. Please login again");
  }

  clearTimeout(){
    this.adminTimeOut.set("");
    this.customerTimeOut.set("");
  }

}
