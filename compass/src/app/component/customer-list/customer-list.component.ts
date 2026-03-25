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
   // this.compassService.clearFilter();
   if(!this.compassService.search){
    var token = localStorage.getItem('token');
    var authHeader = "Bearer ";
    if(token){
      authHeader +=token;
    }
    this.compassService.listCustomers(authHeader);
   }
  }

  
  clearFilter(){
    this.compassService.clearFilter();
    window.location.reload();
  }
}
