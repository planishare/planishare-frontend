import { Component } from '@angular/core';
import { inOutYAnimation } from 'src/app/shared/animations/animations';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
    animations: [inOutYAnimation]
})
export class HomepageComponent {
    constructor() {}
}
