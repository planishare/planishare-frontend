import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-big-button',
    templateUrl: './big-button.component.html',
    styleUrls: ['./big-button.component.scss']
})
export class BigButtonComponent {
    @Input() public text: string = 'no text';
    @Input() public icon: string = 'cancel';

    constructor() { }

    // TODO: Delete this, this doesnt have any style
}
