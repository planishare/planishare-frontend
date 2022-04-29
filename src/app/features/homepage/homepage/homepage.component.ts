import { Component, OnInit } from '@angular/core';
import { isMobile } from 'src/app/shared/utils';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
    public isMobile = isMobile;

    constructor() { }

    public ngOnInit(): void {
        console.log('homepage');
    }

}
