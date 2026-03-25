import { Component } from '@angular/core';
import { CompassService } from '../../service/compass.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css',
    standalone: false
})
export class MenuComponent {
    constructor(public compassService: CompassService) {

    }
  

}
