import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { AdminLoginComponent } from './component/admin-login/admin-login.component';
import { AdminTaskComponent } from './component/admin-task/admin-task.component';
import { AdminTaskDetailsComponent } from './component/admin-task-details/admin-task-details.component';
import { RegisterComponent } from './component/register/register.component';
import { ProfileComponent } from './component/profile/profile.component';
import { PreferenceComponent } from './component/preference/preference.component';
import { CustomerListComponent } from './component/customer-list/customer-list.component';
import { CustomerDetailComponent } from './component/customer-detail/customer-detail.component';
import { CustomerSearchComponent } from './component/customer-search/customer-search.component';
import { CustomerTaskComponent } from './component/customer-task/customer-task.component';
import { CustomerTaskDetailsComponent } from './component/customer-task-details/customer-task-details.component';
import { RegisterValidationComponent } from './component/register-validation/register-validation.component';
import { ForgotPasswordCodeComponent } from './component/forgot-password-code/forgot-password-code.component';
import { ForgotPasswordEmailComponent } from './component/forgot-password-email/forgot-password-email.component';
import { loggedinGuard } from './loggedin.guard';
import { adminLoggedinGuard } from './admin-loggedin.guard';
import { HomeComponent } from './component/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: "full"},
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent,  canActivate: [loggedinGuard]},
  { path: 'admin_login', component: AdminLoginComponent, canActivate: [adminLoggedinGuard]},
  { path: 'admin-task', component: AdminTaskComponent },
  { path: 'admin-task-details/:taskId', component: AdminTaskDetailsComponent },
  { path: 'register', component: RegisterComponent, canActivate: [loggedinGuard]},
  { path: 'register-validation', component: RegisterValidationComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'preference', component: PreferenceComponent },
  { path: 'customer-list', component: CustomerListComponent },
  { path: 'customer-search', component: CustomerSearchComponent },
 { path: 'customer-detail/:email', component: CustomerDetailComponent },
 { path: 'customer-task', component: CustomerTaskComponent },
 { path: 'customer-task-details/:taskId', component: CustomerTaskDetailsComponent },
 { path: 'forgot-password-email', component: ForgotPasswordEmailComponent },
 { path: 'forgot-password-code', component: ForgotPasswordCodeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
