import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { CompassService } from '../../service/compass.service';
import { Observable } from 'rxjs';
import { ScheduledTask } from '../../model/scheduled-task.model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-customer-task-details',
  templateUrl: './customer-task-details.component.html',
  styleUrl: './customer-task-details.component.css',
  standalone: false
})
export class CustomerTaskDetailsComponent {
  profileUrl = this.compassService.basicUrl+'customers/';
  task?:ScheduledTask;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient,
    private compassService: CompassService) { }
    ngOnInit(): void {
      let taskId = this.route.snapshot.paramMap.get('taskId');
      if (taskId) {
        this.loadTask(taskId);
      }
  
    }
    loadTask(taskId:string) {
      var email = localStorage.getItem('email');
      var url = this.profileUrl + email+"/tasks/"+taskId;
      this.getTask(url).subscribe({
        next: (data) => {
          this.task = data;
        },
        error: (e) => {
          console.error(e);
          var msg = e.error.message;
          if (msg === "JWT token expired") {
            this.compassService.adminLoginAgain();
            this.router.navigate(['/customer_login']);
          }
        }
      });
  
    }
    getTask(url: string): Observable<ScheduledTask> {
      
      const httpOptions = {
        headers: this.compassService.getCustomerHttpHeaders()
      };
      return this.http.get<ScheduledTask>(url, httpOptions);
    }
}
