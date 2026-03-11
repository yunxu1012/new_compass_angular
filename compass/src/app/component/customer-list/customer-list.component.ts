import { Component, inject } from '@angular/core';
import { Customer } from '../../model/customer.model';
import { Router, RouterLink, RouterOutlet, ActivatedRoute} from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompassService } from '../../service/compass.service';
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css',
  standalone: false
})
export class CustomerListComponent {
  constructor(private http: HttpClient,private router: Router, public compassService: CompassService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    console.log("search: "+this.compassService.search);
    if(!this.compassService.search){
    this.listRecord();
    }
  }

  listRecord(): void {
    console.log("list customer");
    var url = "http://localhost:8080/api/customers";
    this.getRecords(url).subscribe({
      next: (data) => {
        this.compassService.customers = data;
      },
      error: (e) => console.error(e)
    });
  }

  getRecords(baseUrl: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(baseUrl);
  }
  clearFilter(){
    this.compassService.search = false;
  }

}
