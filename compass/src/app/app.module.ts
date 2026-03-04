import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MenuComponent } from './component/menu/menu.component';
import { AdminMenuComponent } from './component/admin-menu/admin-menu.component';
import { ProfileComponent } from './component/profile/profile.component';
import { PreferenceComponent } from './component/preference/preference.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminLoginComponent } from './component/admin-login/admin-login.component';
import { CustomerDetailComponent } from './component/customer-detail/customer-detail.component';
import { CustomerListComponent } from './component/customer-list/customer-list.component';
import { CustomerSearchComponent } from './component/customer-search/customer-search.component';
import { RouterLink, ActivatedRoute } from '@angular/router';

@NgModule({ declarations: [
        AppComponent,
        LoginComponent,
        AdminLoginComponent,
        RegisterComponent,
        MenuComponent,
        AdminMenuComponent,
        ProfileComponent,
        PreferenceComponent,
        CustomerListComponent,
        CustomerSearchComponent,
        CustomerDetailComponent
    ],
    bootstrap: [AppComponent], 
    imports: [BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        MultiSelectModule,
        NgSelectModule], 
        providers: [
        provideClientHydration(),
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
