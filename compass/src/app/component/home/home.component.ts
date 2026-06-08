import { Component } from '@angular/core';
import { CompassService } from '../../service/compass.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: false
})
export class HomeComponent {
  constructor(private router: Router, public compassService: CompassService){
    console.log('MyComponent initialized!');
  }
}
