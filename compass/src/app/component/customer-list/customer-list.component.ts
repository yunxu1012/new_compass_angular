import { Component, inject } from '@angular/core';
import { Customer } from '../../model/customer.model';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css',
  standalone: false
})
export class CustomerListComponent {
  customers: Customer[] = [];
  constructor(private http: HttpClient,private router: Router) {
  }

  ngOnInit(): void {
    this.listRecord();
  }

  listRecord(): void {
    console.log("list customer");
    var url = "http://localhost:8080/api/customers";
    this.getRecords(url).subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (e) => console.error(e)
    });
  }

  getRecords(baseUrl: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(baseUrl);
  }
  

}
