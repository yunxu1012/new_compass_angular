import { Component } from '@angular/core';
import { CompassService } from '../../service/compass.service';
@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.css',
  standalone: false
})
export class AdminMenuComponent {
  constructor(public compassService: CompassService) {

  }

}
