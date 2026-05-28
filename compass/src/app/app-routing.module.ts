import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { AdminLoginComponent } from './component/admin-login/admin-login.component';
import { RegisterComponent } from './component/register/register.component';
import { ProfileComponent } from './component/profile/profile.component';
import { PreferenceComponent } from './component/preference/preference.component';
import { CustomerListComponent } from './component/customer-list/customer-list.component';
import { CustomerDetailComponent } from './component/customer-detail/customer-detail.component';
import { CustomerSearchComponent } from './component/customer-search/customer-search.component';
import { CustomerTaskComponent } from './component/customer-task/customer-task.component';
import { RegisterValidationComponent } from './component/register-validation/register-validation.component';
import { ForgotPasswordCodeComponent } from './component/forgot-password-code/forgot-password-code.component';
import { ForgotPasswordEmailComponent } from './component/forgot-password-email/forgot-password-email.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: "full"},
  { path: 'login', component: LoginComponent },
  { path: 'admin_login', component: AdminLoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register-validation', component: RegisterValidationComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'preference', component: PreferenceComponent },
  { path: 'customer-list', component: CustomerListComponent },
  { path: 'customer-search', component: CustomerSearchComponent },
 { path: 'customer-detail/:email', component: CustomerDetailComponent },
 { path: 'customer-task', component: CustomerTaskComponent },
 { path: 'forgot-password-email', component: ForgotPasswordEmailComponent },
 { path: 'forgot-password-code', component: ForgotPasswordCodeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
