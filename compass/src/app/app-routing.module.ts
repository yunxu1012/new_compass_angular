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

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: "full"},
  { path: 'login', component: LoginComponent },
  { path: 'admin_login', component: AdminLoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'preference', component: PreferenceComponent },
  { path: 'customer-list', component: CustomerListComponent },
  { path: 'customer-search', component: CustomerSearchComponent },
 { path: 'customer-detail/:email', component: CustomerDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
