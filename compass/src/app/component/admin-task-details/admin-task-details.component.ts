import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { CompassService } from '../../service/compass.service';
import { Observable } from 'rxjs';
import { ScheduledTask } from '../../model/scheduled-task.model';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { signal } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-task-details',
  templateUrl: './admin-task-details.component.html',
  styleUrl: './admin-task-details.component.css',
  standalone: false
})
export class AdminTaskDetailsComponent {
  taskForm!: FormGroup;
  taskUrl = this.compassService.basicUrl+'admin/tasks/';
  task?:ScheduledTask;
  readonly errorMsg = signal<string>('');
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient,
    private compassService: CompassService) { }
    ngOnInit(): void {
      let taskId = this.route.snapshot.paramMap.get('taskId');
      if (taskId) {
        this.loadTask(taskId);
      }
      this.taskForm = new FormGroup({
        note: new FormControl("", Validators.maxLength(40)),
        agent: new FormControl("")
      });
  
    }

    isPending():boolean{
     if(this.task){
      return this.task.status == 'PENDING';
     }
     return false;
    }

    loadTask(taskId:string) {
      var url = this.taskUrl +taskId;
      this.getTask(url).subscribe({
        next: (data) => {
          this.task = data;
        },
        error: (e) => {
          console.error(e);
          var msg = e.error.message;
          if (msg === "JWT token expired") {
            this.compassService.adminLoginAgain();
            this.router.navigate(['/admin_login']);
          }
        }
      });
  
    }
    getTask(url: string): Observable<ScheduledTask> {
      const httpOptions = {
        headers: this.compassService.getAdminHttpHeaders()
      };
      return this.http.get<ScheduledTask>(url, httpOptions);
    }

    approve(){
      var agent =  this.taskForm.get('agent')?.value;
      console.log("agent :"+agent+"!");
      if(agent == null || agent == ""){
        this.errorMsg.set("Agent can't be empty for appoving appointments.");
        return;
      }
      if(this.task){
       this.task.status = "APPROVED";
      }
      console.log("appove task");
      this.saveTask();
    }
    reject(){
      if(this.task){
        this.task.status = "REJECTED";
       }
       this.saveTask();
    }

    saveTask() {
      var url = this.compassService.basicUrl+"admin/tasks";
      if(this.task){
      this.task.agent =  this.taskForm.get('agent')?.value;
      this.task.note  = this.taskForm.get('note')?.value;
      }
      const data = this.task;
      console.log("update task");
      this.updateTask(url, data).subscribe({
        next: (data) => {
          console.log("update task01");
        },
        error: (e) => {
          console.log("error: "+e);
         var msg = e.error.message;
         if(msg==="JWT token expired"){
          this.compassService.customerLoginAgain();
          this.router.navigate(['/admin_login']);
         }
        console.error(e);
        }
      });
    }
  
    updateTask(url: string, data: any): Observable<ScheduledTask> {
      const httpOptions = {
        headers: this.compassService.getAdminHttpHeaders()
      };
      return this.http.put<ScheduledTask>(url, data, httpOptions);
    }
  
}
