import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CompassService } from '../../service/compass.service';
import { ScheduledTask } from '../../model/scheduled-task.model';
import { Schedule } from '../../model/schedule.model';
import { Observable } from 'rxjs';
import { signal } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-task',
  templateUrl: './admin-task.component.html',
  styleUrl: './admin-task.component.css',
  standalone: false
})
export class AdminTaskComponent {
  readonly tasks = signal<ScheduledTask[] | []>([]);
  constructor(private http: HttpClient, private router: Router, public compassService: CompassService) {

  }

  ngOnInit(): void {
    this.loadTasks();
  }

  noTasks(): boolean {
    return this.tasks().length == 0;
  }

  taskUrl = this.compassService.basicUrl + 'admin/tasks';
  loadTasks() {
    this.getTasks(this.taskUrl).subscribe({
      next: (data) => {
        this.tasks.set(data);
        console.log("task size: "+this.tasks().length);
      },
      error: (e) => {
        console.error(e);
        var msg = e.error.message;
        if (msg === "JWT token expired") {
          this.compassService.customerLoginAgain();
          this.router.navigate(['/admin_login']);
        }
      }
    });

  }

  getTasks(url: string): Observable<ScheduledTask[]> {
    var token = localStorage.getItem('token');
    var authHeader = "Bearer ";
    if (token) {
      authHeader += token;
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authHeader
      })
    };
    return this.http.get<ScheduledTask[]>(url, httpOptions);
  }

}
