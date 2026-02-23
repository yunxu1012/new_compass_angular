import { Component, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormsModule, AbstractControl, ValidationErrors, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { HomeType } from '../../enum/home-type';
import { BedCount } from '../../enum/bed-count';
import { BathCount } from '../../enum/bath-count';
import { Router } from '@angular/router';
import { Customer } from '../../model/customer.model';
import { CustomerPreference } from '../../model/customer-preference.model';
import { MultiSelectModule } from 'primeng/multiselect';
import { City } from '../../model/city.model';

@Component({
    selector: 'app-preference',
    templateUrl: './preference.component.html',
    styleUrl: './preference.component.css',
    standalone: false
})
export class PreferenceComponent {
  isEditMode: boolean = false;
  preferenceForm!: FormGroup;
  customerPreference?: CustomerPreference;
  homeTypes = Object.keys(HomeType);
  bedCounts = Object.keys(BedCount);
  bathCounts = Object.keys(BathCount);
  hasPreference: boolean = false;
  cities:City[] = [];
  selectedArr: any;
  selectedCityNames: string[] =[];
  selectedCityIds:string = "";

  
  constructor(private http: HttpClient, private router: Router) {

  }
  
  ngOnInit(): void {

    this.preferenceForm = new FormGroup({
      homeType: new FormControl('', Validators.required),
      minPrice: new FormControl('', Validators.required),
      maxPrice: new FormControl('', [Validators.required, this.validatePrice]),
      minSquareFeet: new FormControl('', Validators.required),
      maxSquareFeet: new FormControl('', [Validators.required, this.validateSquare]),
      minBed: new FormControl('', Validators.required),
      maxBed: new FormControl('', [Validators.required, this.validateBed]),
      minBath: new FormControl('', Validators.required),
      selectedCities:new FormControl(''),
    });
    //this.preferenceForm.disable();
    this.loadCustomerPreference();
    this.loadCities();
  }

  

  private validatePrice(control: AbstractControl): ValidationErrors | null {
    let minPrice = control.parent?.get('minPrice');
    let maxPrice = control.parent?.get('maxPrice');
    if (minPrice?.value != undefined && maxPrice?.value != undefined) {
      let min: number = +minPrice.value;
      let max: number = +maxPrice.value;
      return min <= max ? null : { 'priceError': true };
    }
    return null;
  }
  private validateBed(control: AbstractControl): ValidationErrors | null {
    const minBed = control.parent?.get('minBed')?.value;
    console.log(minBed);

    const maxBed = control.parent?.get('maxBed')?.value;
    let minValue = "";
    let maxValue = "";
    for (const [key, value] of Object.entries(BedCount)) {
      if (key === minBed) {
        minValue = value;
      }
      if (key === maxBed) {
        maxValue = value;
      }
    }
    if (minValue != "" && maxValue != "") {
      const min = Number(minValue.substring(0, 1));
      const max = Number(maxValue.substring(0, 1));
      return min <= max ? null : { 'bedError': true };
    }
    return null;
  }

  getBedByKey(keyStr: string): string {
    console.log("not undefined002");
    for (const [key, value] of Object.entries(BedCount)) {
      console.log("not undefined003");
      if (key === keyStr) {
        return value
      }
    }
    return "";
  }


  private validateSquare(control: AbstractControl): ValidationErrors | null {
    let minSquareFeet = control.parent?.get('minSquareFeet');
    let maxSquareFeet = control.parent?.get('maxSquareFeet');
    if (minSquareFeet?.value != undefined && maxSquareFeet?.value != undefined) {
      let min: number = +minSquareFeet.value;
      let max: number = +maxSquareFeet.value;
      return min <= max ? null : { 'squareFeetError': true };
    }
    return null;
  }

  profileUrl = 'http://localhost:8080/api/customersPreferences/';
  loadCustomerPreference() {
    console.log("start here ");
    var email = localStorage.getItem('email');
    var url = this.profileUrl + email;
    this.getPreference(url).subscribe({
      next: (data) => {
        this.customerPreference = data;
        this.hasPreference = true;
        console.log("custPre: " + this.customerPreference?.minPrice);
      },
      error: (e) => {
        console.error(e);
        console.log("preference not fouund");
      }
    });
  }

  getPreference(url: string): Observable<CustomerPreference> {
    return this.http.get<CustomerPreference>(url);
  }

  citiesUrl = 'http://localhost:8080/api/cities';
  loadCities() {
    console.log("load cities here ");
    this.getCities(this.citiesUrl).subscribe({
      next: (data) => {
        this.cities = data;
      },
      error: (e) => {
        console.error(e);
        console.log("cities not fouund");
      }
    });
  }

  getCities(url: string): Observable<City[]> {
    console.log("get cities");
    return this.http.get<City[]>(url);
  }

  public selected(value:any):void {
    console.log('Select here:');
    this.selectedArr = value;
   this.selectedCityNames = [];
    this.selectedCityIds = "";
    for (const city of this.selectedArr) {
      console.log('city name:'+city.name);
      this.selectedCityNames.push(city.name);
      this.selectedCityIds += city.cityId+",";
    } 
  }


  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.preferenceForm.controls['homeType'].setValue(this.customerPreference?.homeType);
      this.preferenceForm.controls['minBed'].setValue(this.customerPreference?.minBed);
      this.preferenceForm.controls['maxBed'].setValue(this.customerPreference?.maxBed);
      this.preferenceForm.controls['minBath'].setValue(this.customerPreference?.minBath);
      this.preferenceForm.controls['minPrice'].setValue(this.customerPreference?.minPrice);
      this.preferenceForm.controls['maxPrice'].setValue(this.customerPreference?.maxPrice);
      this.preferenceForm.controls['minSquareFeet'].setValue(this.customerPreference?.minSquareFeet);
      this.preferenceForm.controls['maxSquareFeet'].setValue(this.customerPreference?.maxSquareFeet);
      this.preferenceForm.controls['selectedCities'].setValue(this.customerPreference?.cities);
    } else {
      //this.preferenceForm.disable(); // Disable controls in view mode
    }
  }

  getHomeTypeByKey(keyStr: string | undefined): string | undefined {
    for (const [key, value] of Object.entries(HomeType)) {
      if (key === keyStr) {
        return value
      }
    }
    return undefined;
  }

  getBedCountByKey(keyStr: string | undefined): string | undefined {
    for (const [key, value] of Object.entries(BedCount)) {
      if (key === keyStr) {
        return value
      }
    }
    return undefined;
  }

  getBathCountByKey(keyStr: string | undefined): string | undefined {
    for (const [key, value] of Object.entries(BathCount)) {
      if (key === keyStr) {
        return value
      }
    }
    return undefined;
  }

  cancelEdit(): void {
    this.toggleEditMode(); // Exit edit mode
  }
  savePreference() {
    if (this.preferenceForm.invalid) {
      this.preferenceForm.markAllAsTouched(); // Mark all controls as touched
      return; // Prevent submission if form is invalid
    }
    var email = localStorage.getItem('email');
    console.log("save: ");
    var url = "http://localhost:8080/api/customersPreferences/" + email;
    const data = {
      homeType: this.preferenceForm.get('homeType')?.value,
      minBed: this.preferenceForm.get('minBed')?.value,
      maxBed: this.preferenceForm.get('maxBed')?.value,
      minBath: this.preferenceForm.get('minBath')?.value,
      minPrice: this.preferenceForm.get('minPrice')?.value,
      maxPrice: this.preferenceForm.get('maxPrice')?.value,
      minSquareFeet: this.preferenceForm.get('minSquareFeet')?.value,
      maxSquareFeet: this.preferenceForm.get('maxSquareFeet')?.value,
      cities: this.selectedArr,
    };
    if (!this.hasPreference) {
      this.createPreference(url, data).subscribe({
        next: (data) => {
          this.toggleEditMode();
          this.customerPreference = data;
          this.hasPreference = true;
        },
        error: (e) => console.error(e)
      });
    } else {
      this.updatePreference(url, data).subscribe({
        next: (data) => {
          this.toggleEditMode();
          this.customerPreference = data;
        },
        error: (e) => console.error(e)
      });
    }
  }
  createPreference(url: string, data: any): Observable<CustomerPreference> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<CustomerPreference>(url, data, httpOptions);
  }
  updatePreference(url: string, data: any): Observable<CustomerPreference> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<CustomerPreference>(url, data, httpOptions);
  }
}
