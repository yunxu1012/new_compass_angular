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
  selector: 'app-customer-task',
  templateUrl: './customer-task.component.html',
  styleUrl: './customer-task.component.css',
  standalone: false
})
export class CustomerTaskComponent {
  readonly tasks = signal<ScheduledTask[] | []>([]);
  readonly schedules = signal<Schedule[] | []>([]);
  readonly currentSchedule = signal<Schedule | null>(null);
  readonly timeList = signal<String[] | undefined>(undefined);
  readonly errorMsg = signal<string>('');
  taskForm!: FormGroup;
  constructor(private http: HttpClient, private router: Router, public compassService: CompassService) {

  }

  ngOnInit(): void {
    this.loadCustomerTasks();
    this.loadCustomerSchedules();
    this.taskForm = new FormGroup({
      selectedSchedule: new FormControl(this.schedules()[0], Validators.required),
      taskTime: new FormControl("", Validators.required,),
      address: new FormControl("", [Validators.required, Validators.maxLength(40)]),
      city:new FormControl("", Validators.required,),
      zipcode:new FormControl("", [Validators.required, Validators.pattern('^[0-9]{5}$')]),
      comment: new FormControl("", Validators.maxLength(40)),
    });
    this.compassService.loadCities();

  }

  noTasks(): boolean {
    return this.tasks().length == 0;
  }

  fullTasks(): boolean {
    return this.tasks().length >= 3;
  }
  
  taskIsRejected(task: ScheduledTask):boolean{
    if(task){
      return task.status == 'REJECTED';
    }
    return false;
  }
  changeSchedule() {
    const value = this.taskForm.get('selectedSchedule')?.value;
    console.log("value: " + value.taskDate);
    this.currentSchedule.set(value);
    this.timeList.set(this.currentSchedule()?.taskTime);
  }

  profileUrl = this.compassService.basicUrl + 'customers/';
  loadCustomerTasks() {
    console.log("load customer task");
    var email = localStorage.getItem('email');
    var url = this.profileUrl + email + "/tasks";
    this.getTasks(url).subscribe({
      next: (data) => {
        this.tasks.set(data);
        console.log("task size: "+this.tasks().length);
      },
      error: (e) => {
        console.error(e);
        var msg = e.error.message;
        if (msg === "JWT token expired") {
          this.compassService.customerLoginAgain();
          this.router.navigate(['/login']);
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

  loadCustomerSchedules() {
    var email = localStorage.getItem('email');
    var url = this.profileUrl + email + "/schedules";
    this.getSchedules(url).subscribe({
      next: (data) => {
        this.schedules.set(data);
        this.currentSchedule.set(this.schedules()[1]);
        if (this.currentSchedule()?.taskTime) {
          this.timeList.set(this.currentSchedule()?.taskTime);
        }
      },
      error: (e) => {
        console.error(e);
        var msg = e.error.message;
        if (msg === "JWT token expired") {
          this.compassService.customerLoginAgain();
          this.router.navigate(['/login']);
        }
      }
    });

  }

  getSchedules(url: string): Observable<Schedule[]> {
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
    return this.http.get<Schedule[]>(url, httpOptions);
  }

  saveTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched(); // Mark all controls as touched
      return; // Prevent submission if form is invalid
    }

    var email = localStorage.getItem('email');
    var url = this.compassService.basicUrl + "customers/" + email + "/tasks";
    const value = this.taskForm.get('selectedSchedule')?.value;
    var taskDate = value.taskDate;
    const data = {
      taskDate: taskDate,
      taskTime: this.taskForm.get('taskTime')?.value,
      address: this.taskForm.get('address')?.value,
      city: this.taskForm.get('city')?.value.name,
      state:"MA",
      zipcode: this.taskForm.get('zipcode')?.value,
      comment: this.taskForm.get('comment')?.value,
    };
    this.createTask(url, data).subscribe({
      next: (data) => {
        this.loadCustomerTasks();
        this.loadCustomerSchedules();
      },
      error: (e) => {
        var msg = e.error.message;
        if (msg === "JWT token expired") {
          this.compassService.customerLoginAgain();
          this.router.navigate(['/login']);
        }else{
          this.errorMsg.set(e.error);
        }
        console.error(msg);
      }
    });
  }
  createTask(url: string, data: any): Observable<ScheduledTask> {
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
    return this.http.post<ScheduledTask>(url, data, httpOptions);
  }

  removeTask(taskId:string|undefined){
    console.log("remove task: "+taskId);
    var email = localStorage.getItem('email');
    var url = this.compassService.basicUrl + "customers/" + email + "/tasks/"+taskId+"/done";
    this.changeTask(taskId, url);
  }
  cancelTask(taskId:string|undefined){
    var email = localStorage.getItem('email');
    var url = this.compassService.basicUrl + "customers/" + email + "/tasks/"+taskId+"/cancel";
    this.changeTask(taskId, url);
  }
  changeTask(taskId:string|undefined, url:string) {
    
    this.updateTask(url).subscribe({
      next: (data) => {
        this.loadCustomerTasks();
        this.loadCustomerSchedules();
      },
      error: (e) => {
        var msg = e.error.message;
        if (msg === "JWT token expired") {
          this.compassService.customerLoginAgain();
          this.router.navigate(['/login']);
        }
        console.error(msg);
      }
    });
  }
  updateTask(url: string): Observable<ScheduledTask> {
    var token = localStorage.getItem('token');
    var authHeader = "Bearer ";
    if (token) {
      authHeader += token;
    }
    console.log("header: "+ authHeader);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': authHeader
      })
    };
    return this.http.put<ScheduledTask>(url,null, httpOptions);
  }



}
