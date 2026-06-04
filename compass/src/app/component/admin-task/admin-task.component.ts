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
  tasks: ScheduledTask[]=[];
  pagedTasks: ScheduledTask[]=[];
  readonly pagedTasksToDisplay = signal<ScheduledTask[] | []>([]);
  pageSize :number= 10;
  currentPage:number = 1;
  totalPages: number =1;
  constructor(private http: HttpClient, private router: Router, public compassService: CompassService) {

  }

  ngOnInit(): void {
    this.loadTasks();
  }

  noTasks(): boolean {
    return this.tasks.length == 0;
  }

  taskUrl = this.compassService.basicUrl + 'admin/tasks';
  loadTasks() {
    this.getTasks(this.taskUrl).subscribe({
      next: (data) => {
        //this.tasks.set(data);
        this.tasks = data;
        this.pagedTasks = data;
        this.totalPages = Math.ceil(this.tasks.length / this.pageSize);
        this.updatePagedData();
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

  updatePagedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedTasks = this.tasks.slice(startIndex, endIndex);
    this.pagedTasksToDisplay.set(this.pagedTasks);
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
 
}
